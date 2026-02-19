export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      // Disable CSP so admin can load images/media from S3 (adaptive-strapi bucket).
      // Custom img-src/media-src with S3 were not applied (likely overridden by Strapi/App Runner).
      contentSecurityPolicy: false,
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '512mb', // Increase form limit
      jsonLimit: '512mb', // Increase JSON limit
      textLimit: '512mb', // Increase text limit
      formidable: {
        maxFileSize: 512 * 1024 * 1024, // Increase file size limit (in bytes)
      },
    },
  },
  {
    name: 'strapi::session',
    config: {
      key: 'strapi.sid',
      secure: false,
      sameSite: 'lax',
      rolling: false,
      renew: false,
      proxy: true,
    },
  },
  'strapi::favicon',
  {
    name: 'strapi::public',
    config: {
      // Render: set STRAPI_PUBLIC_PATH=/data/public. AWS/local: default ./public
      path: process.env.STRAPI_PUBLIC_PATH || './public',
    },
  },
  'global::upload', // Normalize fileInfo for /upload (fix Media Library JSON parse error)
];