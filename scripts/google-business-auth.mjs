#!/usr/bin/env node
/**
 * Re-authorizes the Google Business Profile OAuth client and discovers the
 * location id for the Headbutt listing.
 *
 * Why this exists: the refresh token stored in .env.local was revoked
 * ("invalid_grant"), and the Google Business Profile API is the only Google
 * API that returns reviewer avatars *and* the photos people attach to their
 * reviews.
 *
 * Usage:
 *   node scripts/google-business-auth.mjs [--port 8080]
 *
 * It opens Google's consent screen in the default browser, waits for you to
 * approve, then writes GOOGLE_REFRESH_TOKEN and GOOGLE_BUSINESS_LOCATION_ID
 * into .env.local. The redirect URI must be registered on the OAuth client
 * (Google Cloud Console -> APIs & Services -> Credentials -> your OAuth
 * client -> Authorized redirect URIs). "http://localhost:8080" is the
 * default; pass --port to match a different registered URI.
 */
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = path.join(ROOT, '.env.local');
const SCOPE = 'https://www.googleapis.com/auth/business.manage';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';

const argv = process.argv.slice(2);
const portArgIndex = argv.indexOf('--port');
const START_PORT = Number(portArgIndex >= 0 ? argv[portArgIndex + 1] : 8080) || 8080;
const TIMEOUT_MS = 10 * 60 * 1000;

function parseEnv(text) {
  const values = {};
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    values[key] = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
  }
  return values;
}

async function readEnvFile() {
  try {
    return parseEnv(await readFile(ENV_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function writeEnvUpdates(updates) {
  let text = '';
  try {
    text = await readFile(ENV_PATH, 'utf8');
  } catch {
    text = '';
  }
  const lines = text.length ? text.split('\n') : [];
  for (const [key, value] of Object.entries(updates)) {
    const index = lines.findIndex((line) => line.trim().startsWith(`${key}=`));
    const next = `${key}=${value}`;
    if (index >= 0) lines[index] = next;
    else lines.push(next);
  }
  await writeFile(ENV_PATH, `${lines.join('\n').replace(/\n+$/, '')}\n`, 'utf8');
}

function openBrowser(url) {
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '""', url] : [url];
  try {
    spawn(command, args, { stdio: 'ignore', detached: true }).unref();
    return true;
  } catch {
    return false;
  }
}

/** Starts the loopback listener that Google redirects back to after consent. */
function startCallbackServer(port) {
  return new Promise((resolve, reject) => {
    let settle;
    const result = new Promise((res, rej) => {
      settle = { resolve: res, reject: rej };
    });

    const server = createServer((request, response) => {
      const url = new URL(request.url ?? '/', `http://localhost:${port}`);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      const detail = url.searchParams.get('error_description');

      response.writeHead(error ? 400 : 200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(error
        ? `<h1>Authorization failed</h1><p>${error}</p><p>${detail ?? ''}</p>`
        : '<h1>Authorization complete</h1><p>You can close this tab and return to the terminal.</p>');

      server.close();
      if (error) settle.reject(new Error(`Google returned "${error}".${detail ? ` ${detail}` : ''}`));
      else if (!code) settle.reject(new Error('Google did not return an authorization code.'));
      else settle.resolve(code);
    });

    server.once('error', reject);
    server.listen(port, () => resolve({ server, result }));
  });
}

async function exchangeCode({ code, clientId, clientSecret, redirectUri }) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `Token exchange failed (${response.status}): ${payload.error ?? 'unknown_error'} — ${payload.error_description ?? ''}`,
    );
  }
  return payload;
}

async function findLocation(accessToken, accountId) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const attempts = [
    {
      label: 'Business Information API v1 accounts.locations.list',
      run: () => fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title,storefrontAddress&pageSize=50`,
        { headers },
      ),
    },
    {
      label: 'My Business API v4 accounts.locations.list',
      run: () => fetch(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations?readMask=name,title,storefrontAddress`,
        { headers },
      ),
    },
    {
      label: 'My Business API v4 accounts.locations.search',
      run: () => fetch(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/search?readMask=name,title,storefrontAddress`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageSize: 50 }),
        },
      ),
    },
  ];

  const failures = [];
  for (const attempt of attempts) {
    try {
      const response = await attempt.run();
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        failures.push(`${attempt.label}: HTTP ${response.status} ${payload.error?.message ?? payload.error ?? ''}`);
        continue;
      }
      const locations = payload.locations ?? [];
      if (!locations.length) {
        failures.push(`${attempt.label}: no locations returned`);
        continue;
      }
      const scored = locations
        .map((location) => {
          const title = location.title?.text ?? location.title ?? '';
          const address = location.storefrontAddress ?? location.address ?? {};
          const locality = address.locality ?? address.addressLocality ?? '';
          const score = /headbutt/i.test(title) ? 3 : /barcelona/i.test(locality) ? 2 : 1;
          return { location, title, locality, score };
        })
        .sort((a, b) => b.score - a.score);
      const best = scored[0];
      const locationId = String(best.location.name ?? '').split('/locations/')[1] ?? '';
      return { locationId, title: best.title, locality: best.locality, endpoint: attempt.label };
    } catch (error) {
      failures.push(`${attempt.label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(`Could not list business locations.\n  ${failures.join('\n  ')}`);
}

const env = await readEnvFile();
const clientId = process.env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || env.GOOGLE_CLIENT_SECRET;
const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID || env.GOOGLE_BUSINESS_ACCOUNT_ID;

if (!clientId || !clientSecret) {
  console.error('Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env.local.');
  process.exit(1);
}
if (!accountId) {
  console.error('Missing GOOGLE_BUSINESS_ACCOUNT_ID in .env.local.');
  process.exit(1);
}

let server;
let port = START_PORT;
let result;
for (let attempt = 0; attempt < 10; attempt += 1) {
  try {
    ({ server, result } = await startCallbackServer(port));
    break;
  } catch (error) {
    if (error?.code === 'EADDRINUSE') {
      port += 1;
      continue;
    }
    throw error;
  }
}
if (!server) {
  console.error(`Could not bind a local port starting at ${START_PORT}.`);
  process.exit(1);
}

const redirectUri = `http://localhost:${port}`;
const authUrl = new URL(AUTH_ENDPOINT);
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPE);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');
authUrl.searchParams.set('include_granted_scopes', 'true');

console.log('\nHeadbutt — Google Business Profile authorization');
console.log('─────────────────────────────────────────────────');
console.log('1. Approve the request in your browser (sign in as the account that owns the Headbutt listing).');
console.log(`2. If your browser did not open, visit:\n   ${authUrl.toString()}`);
console.log(`\nWaiting for the callback on ${redirectUri} …\n`);

if (!openBrowser(authUrl.toString())) {
  console.log('(Could not open a browser automatically — use the link above.)');
}

const timer = setTimeout(() => {
  console.error('Timed out waiting for authorization.');
  process.exit(1);
}, TIMEOUT_MS);

let code;
try {
  code = await result;
} catch (error) {
  clearTimeout(timer);
  console.error(`\nAuthorization failed: ${error instanceof Error ? error.message : String(error)}`);
  if (String(error).includes('redirect_uri')) {
    console.error(`\nThe redirect URI ${redirectUri} is probably not registered on the OAuth client.`);
    console.error('Add it in Google Cloud Console -> APIs & Services -> Credentials -> your OAuth client -> Authorized redirect URIs, then run this script again.');
  }
  process.exit(1);
}

clearTimeout(timer);
console.log('\nAuthorization received. Minting tokens …');

let tokens;
try {
  tokens = await exchangeCode({ code, clientId, clientSecret, redirectUri });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const refreshToken = tokens.refresh_token;
if (!refreshToken) {
  console.error('Google did not return a refresh token. Revoke the existing grant for this app and run the script again.');
  process.exit(1);
}

const updates = { GOOGLE_REFRESH_TOKEN: refreshToken };

if (tokens.access_token) {
  try {
    const location = await findLocation(tokens.access_token, accountId);
    if (location.locationId) {
      updates.GOOGLE_BUSINESS_LOCATION_ID = location.locationId;
      console.log(`\nFound location "${location.title}" (${location.locality || 'no locality'})`);
      console.log(`  id: ${location.locationId}`);
      console.log(`  via: ${location.endpoint}`);
    }
  } catch (error) {
    console.warn(`\nCould not auto-discover the location id: ${error instanceof Error ? error.message : String(error)}`);
    console.warn('Set GOOGLE_BUSINESS_LOCATION_ID manually in .env.local.');
  }
}

await writeEnvUpdates(updates);

console.log('\nSaved to .env.local:');
for (const key of Object.keys(updates)) console.log(`  ${key}`);
console.log('\nRestart the dev server so the new credentials are picked up:');
console.log('  npm run dev');
