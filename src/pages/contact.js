"use client";

import React from 'react';
import Header from '@/components/header/Header';
import ContactV4 from '@/components/contact';
import Hero from "@/components/home-page/hero";
import ContactForm4 from "@/components/contact/ContactForm4";
import Map2 from "@/components/contact/Map2";
import Container from '@mui/material/Container';
import { useSettings } from '@/context/SettingsContext';
import FooterWithSettings from "@/components/footer/FooterWithSettings";

const Contact = ({ settings: propSettings, contactPageData }) => {
  const { settings: contextSettings } = useSettings();

  // Use props for immediate rendering (SEO/Speed), fallback to context
  const settings = propSettings || contextSettings;

  // --- 1. Background Logic ---
  const heroType = contactPageData?.heroBackgroundType || 'Shapes';
  const heroVideoUrl = contactPageData?.heroBackgroundVideo?.url;
  const heroImageUrl = contactPageData?.heroBackgroundImage?.url;

  // Check if we have a Dark Media Background
  const hasMediaBackground = (heroType === 'Video' && heroVideoUrl) || (heroType === 'Image' && heroImageUrl);

  return (
    <div className="contact-page-wrapper">

      {/* Header receives the prop, but we will force styles below just in case */}
      <Header menuTextColor={hasMediaBackground ? "white" : "dark"} />

      {/* Hero with autoHeight */}
      <Hero isHomePage={false} autoHeight={true} heroData={contactPageData}>
        <ContactV4 settings={settings} />
      </Hero>

      <div className="contact-section-four pt-0 md-pt-0" id='contact'>
        <div className="contact-meta mt-0 lg-mt-40">
          <div className="row gx-0">

            {/* FORM COLUMN */}
            <div className="col-lg-6 order-lg-last d-flex">
              <div className="form-wrapper pt-60 lg-pt-40 pb-85 lg-pb-50 w-100">
                <div className="form-style-five">
                  <h3 className="form-title font-recoleta fw-normal pb-30 lg-pb-20">
                    Send Us a Message.
                  </h3>
                </div>
                <Container>
                  <ContactForm4 />
                </Container>
              </div>
            </div>

            {/* MAP COLUMN */}
            <div className="col-lg-6 order-lg-first d-flex">
              <Map2 settings={settings} />
            </div>

          </div>
        </div>
      </div>

      <FooterWithSettings />

      {/* --- 1. Layout Fixes (Always Active) --- */}
      <style jsx global>{`
        .contact-page-wrapper .hero-banner-nine {
            height: auto !important;
            min-height: 550px !important;
            padding-bottom: 80px !important;
            padding-top: 200px !important;
        }
        .contact-page-wrapper .contact-v4-container {
            margin-bottom: 0 !important;
        }
      `}</style>

      {/* --- 2. WHITE MENU OVERRIDES (Conditional) --- */}
      {/* We use a standard style tag to guarantee application without compiler errors */}
      {hasMediaBackground && (
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Force Nav Links to White when Header is NOT fixed (scrolled) */
          body .theme-main-menu:not(.fixed) .navbar-nav .nav-link {
            color: #ffffff !important;
          }
          
          /* Keep Hover/Active states Pink */
          body .theme-main-menu:not(.fixed) .navbar-nav .nav-item:hover .nav-link,
          body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.active .nav-link,
          body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.current-menu-item .nav-link {
            color: #FF1292 !important;
          }

          /* Force Mobile Toggler to White */
          body .theme-main-menu:not(.fixed) .navbar-toggler {
            border-color: rgba(255,255,255,0.5) !important;
          }
          body .theme-main-menu:not(.fixed) .navbar-toggler span {
            background-color: #ffffff !important;
          }

          /* Force "Let's Talk" Button to White Outline */
          body .theme-main-menu:not(.fixed) .lets-talk-btn {
            color: #ffffff !important;
            border-color: #ffffff !important;
            background: transparent !important;
          }
          
          /* Button Hover */
          body .theme-main-menu:not(.fixed) .lets-talk-btn:hover {
            color: #000000 !important;
            background: #ffffff !important;
          }
        `}} />
      )}
    </div>
  );
};

export async function getStaticProps() {
  let settings = null;
  let contactPageData = null;

  try {
    const [settingsRes, pageRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/setting?populate=*`),
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-page?populate=*`)
    ]);

    const settingsJson = settingsRes.ok ? await settingsRes.json() : { data: null };
    const pageJson = pageRes.ok ? await pageRes.json() : { data: null };

    settings = settingsJson.data || null;
    contactPageData = pageJson.data || null;

  } catch (error) {
    console.error("Error fetching contact page data:", error);
  }

  return {
    props: {
      settings,
      contactPageData
    },
    revalidate: 10,
  };
}

export default Contact;