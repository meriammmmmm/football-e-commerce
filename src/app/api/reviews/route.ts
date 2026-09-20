import { createReview, getAllReviews } from '@/lib/db';

export async function GET() {
  try {
    return Response.json({ reviews: await getAllReviews() });
  } catch (error) {
    console.error('Review loading error:', error);
    return Response.json({ error: 'Failed to load reviews.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as { name?: unknown; rating?: unknown; copy?: unknown } | null;
    if (!body || typeof body.name !== 'string' || body.name.trim().length < 2 || typeof body.copy !== 'string' || body.copy.trim().length < 10 || typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return Response.json({ error: 'Add your name, a rating, and a review of at least 10 characters.' }, { status: 400 });
    }
    const review = await createReview(body.name, body.rating, body.copy);
    return Response.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Review submission error:', error);
    return Response.json({ error: 'Failed to submit review. Please try again.' }, { status: 500 });
  }
}
