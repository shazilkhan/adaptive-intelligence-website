// pages/api/env-check.js
//
// Safe diagnostics endpoint: never returns secret values.
// Use to confirm which environment variables are available at runtime (SSR/API).

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const has = (key) => {
    const v = process.env[key];
    return typeof v === 'string' && v.trim().length > 0;
  };

  return res.status(200).json({
    ok: true,
    // Public info
    nodeEnv: process.env.NODE_ENV || null,

    // Hosting/runtime hints (booleans only)
    runtimeHints: {
      hasAwsRegion: has('AWS_REGION'),
      hasAwsLambdaFunctionName: has('AWS_LAMBDA_FUNCTION_NAME'),
      hasAmplifyAppId: has('AMPLIFY_APP_ID'),
      hasAmplifyBranch: has('AWS_BRANCH'),
    },

    // App-required envs (booleans only)
    env: {
      hasApolloApiKey: has('APOLLO_API_KEY'),
      hasApolloListIdContactForm: has('APOLLO_LIST_ID_CONTACT_FORM'),
      hasApolloListIdLetsTalk: has('APOLLO_LIST_ID_LETS_TALK'),
      hasApolloListIdDownloads: has('APOLLO_LIST_ID_DOWNLOADS'),
      hasApolloListIdNewsletter: has('APOLLO_LIST_ID_NEWSLETTER'),
      hasNextPublicStrapiApiUrl: has('NEXT_PUBLIC_STRAPI_API_URL'),
      hasRevalidationSecret: has('REVALIDATION_SECRET'),
      hasTurnstileSecretKey: has('TURNSTILE_SECRET_KEY'),
      hasSlackWebhookUrl: has('SLACK_WEBHOOK_URL'),
    },

    // Alerting / monitoring (booleans only). Used by src/utils/alerts.js,
    // src/utils/monitor.js, and /api/monitor/status. See
    // docs/DOWNTIME-DETECTOR-DESIGN.md §8 for what each one drives.
    monitoring: {
      hasSlackWebhookUrlAlerts: has('SLACK_WEBHOOK_URL_ALERTS'),
      hasResendApiKey: has('RESEND_API_KEY'),
      hasAlertEmailFrom: has('ALERT_EMAIL_FROM'),
      hasAlertEmailTo: has('ALERT_EMAIL_TO'),
      hasRunbookBaseUrl: has('RUNBOOK_BASE_URL'),
      hasMonitorSecret: has('MONITOR_SECRET'),
      hasMonitorStatusUrl: has('MONITOR_STATUS_URL'),
    },
  });
}

