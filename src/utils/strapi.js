/**
 * Strapi backend config: use either local Strapi or AWS (App Runner) by env.
 *
 * Local:  NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
 * AWS:    NEXT_PUBLIC_STRAPI_USE_AWS=1  and  NEXT_PUBLIC_STRAPI_AWS_URL=https://admin.adaptiveintelligence.online
 *
 * Optional: NEXT_PUBLIC_STRAPI_MEDIA_URL for media base (e.g. S3) when different from API URL.
 */

const LOCAL_DEFAULT = 'http://localhost:1337';

/**
 * Base URL for Strapi API (no trailing slash).
 * Uses AWS URL when NEXT_PUBLIC_STRAPI_USE_AWS is set and NEXT_PUBLIC_STRAPI_AWS_URL is set.
 */
export function getStrapiApiUrl() {
  const useAws =
    typeof process.env.NEXT_PUBLIC_STRAPI_USE_AWS !== 'undefined' &&
    (process.env.NEXT_PUBLIC_STRAPI_USE_AWS === '1' ||
      process.env.NEXT_PUBLIC_STRAPI_USE_AWS === 'true');
  const awsUrl = process.env.NEXT_PUBLIC_STRAPI_AWS_URL;
  if (useAws && awsUrl) return awsUrl.replace(/\/$/, '');
  return (process.env.NEXT_PUBLIC_STRAPI_API_URL || LOCAL_DEFAULT).replace(/\/$/, '');
}

/**
 * Base URL for media (images, uploads). Use S3/CDN when set, else same as API.
 */
function getStrapiMediaBase() {
  return (
    process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
    getStrapiApiUrl()
  ).replace(/\/$/, '');
}

/**
 * Full URL for a Strapi media field (url or attributes.url).
 * - If url is already absolute (http/https), returns as-is.
 * - Otherwise prefixes with media base (API URL or NEXT_PUBLIC_STRAPI_MEDIA_URL).
 */
export function getStrapiMediaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const base = getStrapiMediaBase();
  return u.startsWith('/') ? `${base}${u}` : `${base}/${u}`;
}
