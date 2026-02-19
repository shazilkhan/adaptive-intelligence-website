import React from "react";
import Image from "next/image";
import Head from "next/head";
import FooterWithSettings from "@/components/footer/FooterWithSettings";

// Component imports
import Header from "@/components/header/Header";
import Hero from "@/components/home-page/hero";
import Feedback from "@/components/home-page/Feedback";
import Feature from "@/components/home-page/Feature";
import Leads from "@/components/home-page/Leads";
import FeaturesBlock from "@/components/home-page/FeaturesBlock";
import Counter from "@/components/home-page/Counter";
import SuccessStory from "@/components/home-page/SuccessStory";
import Testimonial from "@/components/home-page/Testimonial";
import Faq from "@/components/home-page/Faq";
import LetsTalkButton from "@/components/LetsTalkButton";
import Link from "next/link";
import TreeStats from "@/components/home-page/TreeStats";

import SEO from "@/components/SEO";
import { getStrapiApiUrl, getStrapiMediaUrl } from "@/utils/strapi";

const HomePage = ({ homepageData }) => {
  // --- Background Logic (Video vs Image) ---
  const heroType = homepageData?.heroBackgroundType || 'Video';
  const hasMediaBackground = (heroType === 'Video') || (heroType === 'Image');

  return (
    <>
      <SEO
        pageTitle={homepageData?.pageTitle || "Homepage"}
        metaDescription={homepageData?.metaDescription}
        ogImage={homepageData?.pagePreviewImage}
      />

      {/* --- 2. Pass the calculated boolean to Header --- */}
      <Header menuTextColor={hasMediaBackground ? "white" : "dark"} />

      {/* Hero Component handles the actual rendering of the background */}
      <Hero isHomePage={true} heroData={homepageData} />

      <Feedback feedbackData={homepageData} />

      <Feature featureData={homepageData} />

      {/* Services Section */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-140 pb-140 lg-pt-100 lg-pb-70 md-pt-80 md-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-9 m-auto">
              <div
                className="title-style-ten text-center pb-40 lg-pb-20"
                data-aos="fade-up"
              >
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {homepageData?.servicesTitle || "Our"}{" "}
                  <span className="position-relative">
                    {homepageData?.servicesTitleHighlight || "Services"}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={220}
                      height={5}
                      className="shape-svg"
                    />
                  </span>
                </h2>
                <p className="fs-20 mt-20">
                  {homepageData?.servicesSubtitle || "Powered by Adaptive Intelligence."}
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <Leads services={homepageData?.services} />
          </div>
        </div>
      </div>

      {/* Features Block */}
      <div className="fancy-feature-thirtyTwo mt-190 lg-mt-120">
        <div className="container">
          <div className="row">
            <FeaturesBlock featuresData={homepageData} />
          </div>
        </div>
        <div className="wrapper mt-90 lg-mt-30">
          <div className="container">
            <div className="row">
              <Counter counterData={homepageData?.whyUsCounterItems} />
              <TreeStats />
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="feedback-section-nine position-relative mt-200 lg-mt-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-7 ms-lg-auto" data-aos="fade-left">
              <div className="title-style-ten">
                <div className="sc-title">
                  {homepageData?.successStoriesTagline || "SUCCESS STORIES"}
                </div>
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {homepageData?.successStoriesTitle || "See success"}{" "}
                  <span className="position-relative">
                    {homepageData?.successStoriesTitleHighlight || "stories"}{" "}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="img"
                      width={185}
                      height={5}
                    />
                  </span>
                  {homepageData?.successStoriesTitleEnd || " of our customers."}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <SuccessStory successStoryData={homepageData} />
      </div>

      {/* Testimonials Section */}
      <div className="feedback-section-ten position-relative pt-100 lg-pt-100 pb-100 lg-pb-100">

        {/* --- 1. Background Image & Overlay --- */}
        <div className="section-bg-wrapper">
          {homepageData?.testimonialsBackgroundImage?.url ? (
            <Image
              src={getStrapiMediaUrl(homepageData.testimonialsBackgroundImage?.url) || ''}
              alt="Testimonial Background"
              fill
              className="hero-bg-media"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            /* Fallback Dark Background */
            <div className="hero-bg-fallback" style={{ background: '#2c003e', width: '100%', height: '100%' }} />
          )}

          {/* Purple Overlay (Adjust opacity to match your image) */}
          <div
            className="hero-overlay"
            style={{
              background: 'linear-gradient(135deg, rgba(74, 10, 77, 0.9) 0%, rgba(200, 15, 120, 0.85) 100%)',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          ></div>
        </div>

        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-8 m-auto">
              <div
                className="title-style-ten text-center mb-80 lg-mb-40"
                data-aos="fade-up"
              >

                <h2 className="main-title font-recoleta fw-normal text-white">
                  {homepageData?.testimonialsTitle || "Trusted By"}{" "}
                  <span className="position-relative">
                    Leading
                    <Image
                      src="/images/shape/shape_129.svg"
                      alt=""
                      width={160}
                      height={6}
                      style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '100%' }}
                    />
                  </span>{" "}
                  Brands
                </h2>
              </div>
            </div>
          </div>

          {/* --- Testimonial Component --- */}
          {/* We don't restrict columns here, we let the component handle the width */}
          <div className="row">
            <div className="col-12">
              <Testimonial />
            </div>
          </div>
        </div>

        <style jsx>{`
    .section-bg-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
    .z-2 { z-index: 2; }
  `}</style>
      </div>


      {/* CTA Section */}
      <div className="fancy-short-banner-twelve position-relative zn2 pt-160 pb-100 lg-pt-120 lg-pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 m-auto text-center">
              <div className="title-style-ten" data-aos="fade-up">
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {homepageData?.ctaTitle || "Have an idea for a project?"} <br />
                  <span className="position-relative">
                    {homepageData?.ctaTitleHighlight || "Let's Talk"}{" "}
                    <Image
                      width={221}
                      height={7}
                      src="/images/shape/shape_132.svg"
                      alt=""
                    />
                  </span>
                  {homepageData?.ctaTitleEnd || " & Grow your Business"}
                </h2>
              </div>
              <p
                className="text-lg mt-45 mb-55 lg-mb-30 lg-mt-40"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {homepageData?.ctaDescription || "We're ready to help you. Our experts are here, just send a message."}
              </p>

              {/* Button Group Container */}
              {/* FIXED: Removed data-aos="fade-up" so buttons are always visible without animation delay */}
              <div
                className="d-flex align-items-center justify-content-center gap-3"
              >
                {/* Button 1 (Primary) */}
                <LetsTalkButton
                  buttonText={homepageData?.ctaButtonText || "Send Message"}
                  href={homepageData?.ctaButtonUrl || "/contact"}
                  size="large"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      {/* FAQ Section */}
      <div className="fancy-feature-thirtyThree mt-100 lg-mt-100 mb-100 lg-mb-100">
        <div className="container">
          <div className="title-style-ten text-center" data-aos="fade-up">
            <div className="sc-title">{homepageData?.faqTagline || "FAQs"}</div>
            <h2 className="main-title font-recoleta fw-normal tx-dark">
              {homepageData?.faqTitle || "Answers to your most"} &amp;{" "}
              <span className="position-relative">
                {homepageData?.faqTitleHighlight || "frequently"}{" "}
                <Image
                  width={219}
                  height={7}
                  src="/images/shape/shape_132.svg"
                  alt=""
                />
                {homepageData?.faqTitleEnd || " asked questions."}
              </span>
            </h2>
          </div>

          {/* FIX: Added inline style to override the default grey background of .bg-wrapper */}
          <div
            className="bg-wrapper position-relative mt-80 lg-mt-40"
            data-aos="fade-up"
            style={{
              background: 'transparent',
              padding: '0',
              boxShadow: 'none',
              borderRadius: '0'
            }}
          >
            <Faq />
          </div>
        </div>
      </div>
      <FooterWithSettings />

      {/* --- 3. Apply CSS Overrides ONLY if media background exists --- */}
      {hasMediaBackground && (
        <style jsx>{`
          /* Force Nav Links to White when header is NOT fixed (at top) */
          :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) {
            color: white !important;
          }
          /* Force Hover Color (Pink) */
          :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
          :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
          :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) {
            color: #FF1292 !important;
          }
          /* Force Button to White Border/Text */
          :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) {
            color: white !important;
            border-color: white !important;
            background: transparent !important;
          }
          /* Force Button Hover */
          :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) {
            color: black !important;
            background: white !important;
          }

          .btn-twentyOne,
                .cta-btn-two {
                  padding-top: 0.9rem !important;
                  padding-bottom: 0.9rem !important;
                }
                .cta-btn-two {
                  background-color: #FF1292;
                  border: 2px solid #FF1292;
                }
                .cta-btn-two:hover {
                  background-color: transparent;
                  color: #FF1292 !important;
                }
        `}</style>
      )}
    </>
  );
};

export async function getStaticProps() {
  const apiUrl = `${getStrapiApiUrl()}/api/homepage?populate=*`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API fetch failed: ${res.status}`);
    const data = await res.json();

    // Standardize data extraction for Strapi v5 / v4 compatibility
    const homepageData = data?.data?.attributes || data?.data || null;

    if (!homepageData) {
      console.warn("Homepage: No data received from API");
    }

    return {
      props: {
        homepageData
      },
      revalidate: 10
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        homepageData: null
      },
      revalidate: 60 // Longer revalidate on error
    };
  }
}

export default HomePage;