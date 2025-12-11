"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GlobalScripts = () => {
  const [ids, setIds] = useState({ gaId: null, gtmId: null });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/setting`); 
        const json = await res.json();
        const data = json.data?.attributes || {};

        // --- SMART EXTRACTION LOGIC ---
        
        // 1. Find GA4 ID (Looks like 'G-XXXXXXXX')
        let foundGaId = null;
        if (data.googleAnalyticsCode) {
            // Regex to find "G-..." inside the messy text
            const match = data.googleAnalyticsCode.match(/(G-[A-Z0-9]+)/);
            if (match) foundGaId = match[0];
        }

        // 2. Find GTM ID (Looks like 'GTM-XXXXXX')
        let foundGtmId = null;
        if (data.googleTagManagerCode) {
            // Regex to find "GTM-..." inside the messy text
            const match = data.googleTagManagerCode.match(/(GTM-[A-Z0-9]+)/);
            if (match) foundGtmId = match[0];
        }

        setIds({ gaId: foundGaId, gtmId: foundGtmId });

      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

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