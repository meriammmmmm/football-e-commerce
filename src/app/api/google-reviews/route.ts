type NormalizedReview = {
  id: string;
  name: string;
  initials: string;
  age: string;
  copy: string;
  rating: number;
  avatarClass: string;
  avatar?: string;
  photo?: string;
  photos?: string[];
};

type ReviewsPayload = {
  source: 'places' | 'business-profile';
  averageRating?: number;
  totalReviewCount: number;
  reviews: NormalizedReview[];
};

type PlacesReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; photoUri?: string };
};

type PlacesPlace = {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
};

type BusinessProfileMediaItem = {
  mediaItemData?: {
    mediaType?: string;
    originalUrl?: string;
    thumbnailUrl?: string;
    description?: string;
  };
  thumbnailUrl?: string;
  originalUrl?: string;
};

type BusinessProfileReview = {
  name?: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; photoUrl?: string };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewMediaItems?: BusinessProfileMediaItem[];
};

const DEFAULT_PLACE_ID = 'ChIJe9hQQ8yjpBIRjv__oFetjEM';
// Selecting a parent field returns the whole sub-message, so `reviews` already
// carries text, authorAttribution, rating, publishTime and the relative date.
const PLACES_FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews';

const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_REVIEWS = 60;
const REVIEW_PAGE_SIZE = 50;

const AVATAR_CLASSES = [
  'bg-blue-500/20 text-blue-300',
  'bg-amber-500/20 text-amber-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-rose-500/20 text-rose-300',
  'bg-violet-500/20 text-violet-300',
  'bg-cyan-500/20 text-cyan-300',
  'bg-orange-500/20 text-orange-300',
  'bg-fuchsia-500/20 text-fuchsia-300',
];

const STAR_RATINGS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

class GoogleReviewsError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly detail?: string,
  ) {
    super(message);
    this.name = 'GoogleReviewsError';
  }
}

let cachedPayload: { payload: ReviewsPayload; expiresAt: number } | null = null;
let cachedAccessToken: { token: string; expiresAt: number } | null = null;
let cachedLocationId: { locationId: string; expiresAt: number } | null = null;

function env(name: string) {
  return process.env[name]?.trim() || '';
}

function initialsFor(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return initials || 'GU';
}

function formatPublishTime(publishTime?: string) {
  if (!publishTime) return 'Google review';
  const published = new Date(publishTime);
  if (Number.isNaN(published.getTime())) return 'Google review';

  const days = Math.max(0, Math.floor((Date.now() - published.getTime()) / 86_400_000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  const years = Math.round(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function redact(text: string) {
  return text.replace(/AIza[0-9A-Za-z_-]{10,}/g, '[redacted-api-key]');
}

async function readGoogleError(response: Response) {
  const body = await response.text().catch(() => '');
  if (!body) return `HTTP ${response.status}`;
  try {
    const parsed = JSON.parse(body) as {
      error?: string | { message?: string; status?: string };
      error_description?: string;
    };
    // OAuth token endpoint uses a flat shape, Google APIs a nested one.
    if (typeof parsed.error === 'string') {
      return parsed.error_description ? `${parsed.error}: ${parsed.error_description}` : parsed.error;
    }
    const message = parsed.error?.message || parsed.error?.status;
    if (message) return `${message}${parsed.error?.status ? ` (${parsed.error.status})` : ''}`;
  } catch {
    // fall through to the raw body
  }
  return body.slice(0, 300);
}

/** The reviewer's Google profile picture, if they have one. */
function reviewerAvatar(review: BusinessProfileReview) {
  const url = review.reviewer?.profilePhotoUrl || review.reviewer?.photoUrl;
  return url?.trim() || undefined;
}

/** The first photo the reviewer attached to the review. */
function reviewPhoto(review: BusinessProfileReview) {
  for (const item of review.reviewMediaItems ?? []) {
    const url =
      item.mediaItemData?.thumbnailUrl ||
      item.thumbnailUrl ||
      item.mediaItemData?.originalUrl ||
      item.originalUrl;
    if (url?.trim()) return url.trim();
  }
  return undefined;
}

function reviewPhotos(review: BusinessProfileReview) {
  return (review.reviewMediaItems ?? [])
    .map((item) => item.mediaItemData?.thumbnailUrl || item.thumbnailUrl || item.mediaItemData?.originalUrl || item.originalUrl)
    .filter((url): url is string => Boolean(url?.trim()))
    .map((url) => url.trim());
}

async function fetchPlacesReviews(): Promise<ReviewsPayload> {

  const placeId = env('GOOGLE_PLACE_ID') || DEFAULT_PLACE_ID;
  const apiKey = env('GOOGLE_PLACES_API_KEY') || env('GOOGLE_MAPS_API_KEY');
  if (!apiKey) {
    throw new GoogleReviewsError(
      'Google Maps API key is not configured.',
      503,
      'missing_api_key',
    );
  }
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
  url.searchParams.set('languageCode', 'en');

  const response = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACES_FIELD_MASK,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = redact(await readGoogleError(response));
    throw new GoogleReviewsError(
      `Places API (New) request failed with ${response.status}.`,
      502,
      'places_api_error',
      detail,
    );
  }

  const place = (await response.json()) as PlacesPlace;
  const reviews = (place.reviews ?? []).map((review, index) => {
    const name = review.authorAttribution?.displayName?.trim() || 'Google user';
    return {
      id: review.name || `places-review-${index}`,
      name,
      initials: initialsFor(name),
      age: review.relativePublishTimeDescription || formatPublishTime(review.publishTime),
      copy: review.text?.text?.trim() || 'No written comment.',
      rating: typeof review.rating === 'number' ? review.rating : 5,
      avatarClass: AVATAR_CLASSES[index % AVATAR_CLASSES.length],
      avatar: review.authorAttribution?.photoUri,
    } satisfies NormalizedReview;
  });

  if (reviews.length === 0) {
    throw new GoogleReviewsError(
      'Places API (New) returned no reviews for this place.',
      502,
      'empty_response',
      `Place ${placeId} has no readable reviews yet.`,
    );
  }

  return {
    source: 'places',
    averageRating: typeof place.rating === 'number' ? place.rating : undefined,
    totalReviewCount: place.userRatingCount ?? reviews.length,
    reviews,
  };
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) return cachedAccessToken.token;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = redact(await readGoogleError(response));
    const revoked = /invalid_grant|unauthorized_client/i.test(detail);
    throw new GoogleReviewsError(
      revoked
        ? 'The Google OAuth refresh token was revoked.'
        : 'The Google OAuth refresh token was rejected.',
      502,
      'oauth_failed',
      revoked
        ? `${detail}. Run "npm run auth:google-business" to re-authorize and refresh the token in .env.local.`
        : `${detail}. Re-authorize the OAuth client to mint a new refresh token, or switch to the Places API (New) key.`,
    );
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new GoogleReviewsError(
      'Google did not return an access token.',
      502,
      'oauth_failed',
      'The token endpoint replied without an access_token field.',
    );
  }

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(60, (data.expires_in ?? 3600) - 300) * 1000,
  };
  return cachedAccessToken.token;
}

/**
 * Resolves the business location id when GOOGLE_BUSINESS_LOCATION_ID is not
 * set. The Business Information API and the legacy v4 API are both tried
 * because Google has been migrating the endpoints.
 */
async function resolveLocationId(accessToken: string, accountId: string) {
  if (cachedLocationId && cachedLocationId.expiresAt > Date.now()) return cachedLocationId.locationId;

  const configured = env('GOOGLE_BUSINESS_LOCATION_ID');
  if (configured) return configured;

  const headers = { Authorization: `Bearer ${accessToken}` };
  const attempts: Array<() => Promise<Response>> = [
    () => fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title,storefrontAddress&pageSize=50`,
      { headers },
    ),
    () => fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations?readMask=name,title,storefrontAddress`,
      { headers },
    ),
    () => fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/search?readMask=name,title,storefrontAddress`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSize: 50 }),
      },
    ),
  ];

  for (const attempt of attempts) {
    try {
      const response = await attempt();
      if (!response.ok) continue;
      const payload = (await response.json()) as {
        locations?: Array<{
          name?: string;
          title?: { text?: string } | string;
          storefrontAddress?: { locality?: string; addressLocality?: string };
        }>;
      };
      const locations = payload.locations ?? [];
      if (!locations.length) continue;

      const scored = locations
        .map((location) => {
          const title = typeof location.title === 'string' ? location.title : location.title?.text ?? '';
          const locality = location.storefrontAddress?.locality ?? location.storefrontAddress?.addressLocality ?? '';
          const score = /headbutt/i.test(title) ? 3 : /barcelona/i.test(locality) ? 2 : 1;
          return { location, score };
        })
        .sort((a, b) => b.score - a.score);

      const locationId = String(scored[0].location.name ?? '').split('/locations/')[1] ?? '';
      if (!locationId) continue;

      cachedLocationId = { locationId, expiresAt: Date.now() + CACHE_TTL_MS };
      return locationId;
    } catch {
      // try the next endpoint
    }
  }

  throw new GoogleReviewsError(
    'Could not find the Google Business location.',
    503,
    'missing_business_location_id',
    'Set GOOGLE_BUSINESS_LOCATION_ID in .env.local, or run "npm run auth:google-business" to discover it automatically.',
  );
}

async function fetchBusinessProfileReviews(): Promise<ReviewsPayload> {
  const clientId = env('GOOGLE_CLIENT_ID');
  const clientSecret = env('GOOGLE_CLIENT_SECRET');
  const refreshToken = env('GOOGLE_REFRESH_TOKEN');
  const accountId = env('GOOGLE_BUSINESS_ACCOUNT_ID');

  const missing = [
    ['GOOGLE_CLIENT_ID', clientId],
    ['GOOGLE_CLIENT_SECRET', clientSecret],
    ['GOOGLE_REFRESH_TOKEN', refreshToken],
    ['GOOGLE_BUSINESS_ACCOUNT_ID', accountId],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new GoogleReviewsError(
      'Google Reviews is not configured.',
      503,
      'missing_business_profile_env',
      `Missing ${missing.join(', ')}. Set GOOGLE_PLACES_API_KEY instead to use the Places API (New).`,
    );
  }

  const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
  const locationId = await resolveLocationId(accessToken, accountId);
  const reviews: BusinessProfileReview[] = [];
  let pageToken = '';
  let totalReviewCount: number | undefined;
  let averageRating: number | undefined;

  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews`,
    );
    url.searchParams.set('pageSize', String(REVIEW_PAGE_SIZE));
    url.searchParams.set('orderBy', 'updateTime desc');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      const detail = redact(await readGoogleError(response));
      throw new GoogleReviewsError(
        `Google reviews request failed with ${response.status}.`,
        502,
        'business_profile_error',
        `${detail}. The My Business API needs to be enabled for the project and Google Business Profile API access must be approved.`,
      );
    }

    const data = (await response.json()) as {
      reviews?: BusinessProfileReview[];
      nextPageToken?: string;
      totalReviewCount?: number;
      averageRating?: number;
    };
    reviews.push(...(data.reviews ?? []));
    pageToken = data.nextPageToken ?? '';
    totalReviewCount = data.totalReviewCount ?? totalReviewCount;
    averageRating = data.averageRating ?? averageRating;
  } while (pageToken && reviews.length < MAX_REVIEWS);

  if (reviews.length === 0) {
    throw new GoogleReviewsError(
      'Google returned no reviews for this location.',
      502,
      'empty_response',
      'Check GOOGLE_BUSINESS_LOCATION_ID points at the Headbutt Barcelona location.',
    );
  }

  return {
    source: 'business-profile',
    averageRating,
    totalReviewCount: totalReviewCount ?? reviews.length,
    reviews: reviews.slice(0, MAX_REVIEWS).map((review, index) => {
      const name = review.reviewer?.displayName?.trim() || 'Google user';
      return {
        id: review.name || `business-profile-review-${index}`,
        name,
        initials: initialsFor(name),
        age: review.updateTime ? new Date(review.updateTime).toLocaleDateString() : 'Google review',
        copy: review.comment?.trim() || 'No written comment.',
        rating: STAR_RATINGS[review.starRating ?? ''] ?? 5,
        avatarClass: AVATAR_CLASSES[index % AVATAR_CLASSES.length],
        avatar: reviewerAvatar(review),
        photo: reviewPhoto(review),
        photos: reviewPhotos(review),
      } satisfies NormalizedReview;
    }),
  };
}

function hasBusinessProfileConfig() {
  return Boolean(
    env('GOOGLE_CLIENT_ID') &&
      env('GOOGLE_CLIENT_SECRET') &&
      env('GOOGLE_REFRESH_TOKEN') &&
      env('GOOGLE_BUSINESS_ACCOUNT_ID'),
  );
}

async function loadReviews(): Promise<ReviewsPayload> {
  if (cachedPayload && cachedPayload.expiresAt > Date.now()) return cachedPayload.payload;

  const providers: Array<() => Promise<ReviewsPayload>> = [];
  if (env('GOOGLE_PLACES_API_KEY')) providers.push(fetchPlacesReviews);
  if (hasBusinessProfileConfig()) providers.push(fetchBusinessProfileReviews);

  if (providers.length === 0) {
    throw new GoogleReviewsError(
      'Google Reviews is not configured.',
      503,
      'not_configured',
      'Set GOOGLE_PLACES_API_KEY in .env.local (and in the Vercel project environment), then enable "Places API (New)" for the Google Cloud project. See .env.example for the full setup.',
    );
  }

  let lastError: unknown;
  for (const provider of providers) {
    try {
      const payload = await provider();
      cachedPayload = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
      return payload;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function GET() {
  try {
    return Response.json(await loadReviews());
  } catch (error) {
    if (error instanceof GoogleReviewsError) {
      console.error('Google review loading error:', error.code, error.message, error.detail ?? '');
      return Response.json(
        { error: error.message, code: error.code, detail: error.detail },
        { status: error.status },
      );
    }
    console.error('Google review loading error:', error);
    return Response.json(
      { error: 'Google reviews are not configured or unavailable.', code: 'unknown_error' },
      { status: 503 },
    );
  }
}
