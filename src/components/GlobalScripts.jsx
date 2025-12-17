import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useSettings } from '@/context/SettingsContext';

const GlobalScripts = () => {
  const { settings } = useSettings();
  const [ids, setIds] = useState({ gaId: null, gtmId: null });
  const router = useRouter();

  useEffect(() => {
    if (!ids.gaId) return;

    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag('config', ids.gaId, {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, ids.gaId]);

  useEffect(() => {
    if (!settings) return;

    console.log("GlobalScripts: Using settings from context:", settings);

    // 1. Find GA4 ID (Looks like 'G-XXXXXXXX')
    let foundGaId = null;
    if (settings.googleAnalyticsCode) {
      // Regex to find "G-..." inside the messy text
      const match = settings.googleAnalyticsCode.match(/(G-[A-Z0-9]+)/i);
      if (match) foundGaId = match[0];
    }

    // 2. Find GTM ID (Looks like 'GTM-XXXXXX')
    let foundGtmId = null;
    if (settings.googleTagManagerCode) {
      // Regex to find "GTM-..." inside the messy text
      const match = settings.googleTagManagerCode.match(/(GTM-[A-Z0-9]+)/i);
      if (match) foundGtmId = match[0];
    }

    console.log("GlobalScripts: Extracted IDs:", { foundGaId, foundGtmId });
    setIds({ gaId: foundGaId, gtmId: foundGtmId });
  }, [settings]);

  return (
    <>
      {/* --- 1. Google Analytics (Optimized) --- */}
      {ids.gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ids.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ids.gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* --- 2. Google Tag Manager (Optimized) --- */}
      {ids.gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${ids.gtmId}');
          `}
        </Script>
      )}
    </>
  );
};

export default GlobalScripts;