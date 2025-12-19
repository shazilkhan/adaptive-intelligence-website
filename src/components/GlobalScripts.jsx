import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useSettings } from '@/context/SettingsContext';

const GlobalScripts = () => {
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [ids, setIds] = useState({
    gaId: null,
    gtmId: null,
    fbPixelId: null,
    linkedInPartnerId: null
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || (!ids.gaId && !ids.fbPixelId)) return;

    const handleRouteChange = (url) => {
      // 1. Google Analytics
      if (window.gtag && ids.gaId) {
        window.gtag('config', ids.gaId, {
          page_path: url,
        });
      }
      // 2. Meta Pixel
      if (window.fbq && ids.fbPixelId) {
        window.fbq('track', 'PageView');
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, ids.gaId, ids.fbPixelId, mounted]);

  useEffect(() => {
    if (!settings || !mounted) return;

    console.log("GlobalScripts: Using settings from context:", settings);

    // 1. Find GA4 ID (Looks like 'G-XXXXXXXX')
    let foundGaId = null;
    if (settings.googleAnalyticsCode) {
      const match = settings.googleAnalyticsCode.match(/(G-[A-Z0-9]+)/i);
      if (match) foundGaId = match[0];
    }

    // 2. Find GTM ID (Looks like 'GTM-XXXXXX')
    let foundGtmId = null;
    if (settings.googleTagManagerCode) {
      const match = settings.googleTagManagerCode.match(/(GTM-[A-Z0-9]+)/i);
      if (match) foundGtmId = match[0];
    }

    // 3. Find FB Pixel ID
    let foundFbPixelId = null;
    if (settings.facebookPixelCode) {
      const match = settings.facebookPixelCode.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]\s*\)/i);
      if (match) foundFbPixelId = match[1];
    }

    // 4. Find LinkedIn Partner ID
    let foundLinkedInId = null;
    if (settings.linkedInInsightTagCode) {
      const match = settings.linkedInInsightTagCode.match(/_linkedin_partner_id\s*=\s*['"](\d+)['"]/i);
      if (match) foundLinkedInId = match[1];
    }

    setIds({
      gaId: foundGaId,
      gtmId: foundGtmId,
      fbPixelId: foundFbPixelId,
      linkedInPartnerId: foundLinkedInId
    });
  }, [settings, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* --- 1. Apollo Meetings Widget --- */}
      <Script
        id="apollo-meetings"
        src="https://assets.apollo.io/js/meetings/meetings-widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          const domElement = document.getElementById("apollo-meetings-widget");
          if (window.ApolloMeetings && domElement) {
            window.ApolloMeetings.initWidget({
              appId: "671a95320431f502ce274b0d",
              schedulingLink: "mkq-h23-4je",
              domElement: domElement,
            });
          } else if (window.ApolloMeetings) {
            console.warn("Apollo Widget: Target element #apollo-meetings-widget not found. Skipping initialization.");
          }
        }}
      />

      {/* --- 2. Google Analytics (Optimized) --- */}
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

      {/* --- 3. Google Tag Manager (Optimized) --- */}
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

      {/* --- 4. Meta Pixel (Optimized) --- */}
      {ids.fbPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${ids.fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* --- 5. LinkedIn Insight Tag (Optimized) --- */}
      {ids.linkedInPartnerId && (
        <Script id="linkedin-insight-tag" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${ids.linkedInPartnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}
    </>
  );
};

export default GlobalScripts;
