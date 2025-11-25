export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
          ],
          upgradeInsecureRequests: null,
        },
      },
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
      path: process.env.NODE_ENV === 'production' ? '/data/public' : './public',
    },
  },
];