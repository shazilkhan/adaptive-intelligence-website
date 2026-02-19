/**
 * Workaround for Strapi bug: Media Library sends fileInfo as double-stringified JSON,
 * causing "fileInfo must be a 'object' type" / JSON parse error on upload.
 * See: https://github.com/strapi/strapi/issues/23819
 */
import type { Core } from '@strapi/strapi';

function safeParseJson(value: string): object | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (s.length === 0 || (s[0] !== '{' && s[0] !== '[')) return null;
  try {
    const parsed = JSON.parse(s);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: { request: { path: string; method: string; body?: { fileInfo?: unknown } }; [key: string]: unknown }, next: () => Promise<void>) => {
    try {
      if (ctx.request.path === '/upload' && ctx.request.method === 'POST') {
        const rawFileInfo = ctx.request.body?.fileInfo;
        let normalizedFileInfo: unknown = rawFileInfo;

        if (Array.isArray(rawFileInfo) && rawFileInfo.length === 1) {
          const first = rawFileInfo[0];
          if (typeof first === 'object' && first !== null) {
            normalizedFileInfo = first;
          } else if (typeof first === 'string') {
            normalizedFileInfo = safeParseJson(first) ?? normalizedFileInfo;
          }
        } else if (typeof rawFileInfo === 'string') {
          normalizedFileInfo = safeParseJson(rawFileInfo) ?? normalizedFileInfo;
        }

        if (typeof normalizedFileInfo !== 'object' || normalizedFileInfo === null) {
          normalizedFileInfo = {};
        }
        ctx.request.body = ctx.request.body ?? {};
        ctx.request.body.fileInfo = normalizedFileInfo;
      }
    } catch (e) {
      strapi.log.warn?.('upload middleware fileInfo normalize failed', e);
    }
    await next();
  };
};
