export default ({ env }) => {
  // Use S3 when AWS_BUCKET is set (e.g. on AWS). Otherwise local uploads (Render / dev).
  const useS3 = env('AWS_BUCKET');
  const upload = useS3
    ? {
        config: {
          provider: 'aws-s3',
          providerOptions: {
            baseUrl: env('CDN_URL'),
            rootPath: env('CDN_ROOT_PATH'),
            s3Options: {
              credentials: {
                accessKeyId: env('AWS_ACCESS_KEY_ID'),
                secretAccessKey: env('AWS_SECRET_ACCESS_KEY') || env('AWS_ACCESS_SECRET'),
              },
              region: env('AWS_REGION'),
              params: {
                ACL: env('AWS_ACL', 'public-read'),
                signedUrlExpires: env.int('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                Bucket: env('AWS_BUCKET'),
              },
            },
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      }
    : undefined;

  return {
    ...(upload && { upload }),
  };
};