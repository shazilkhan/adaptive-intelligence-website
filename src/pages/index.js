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

const HomePage = ({ homepageData }) => {
  
  // --- 1. Correct Logic for Strapi v5 (Flat Data) ---
  // We check if the user selected 'Video' or 'Image' AND if the file actually exists.
  const heroType = homepageData?.heroBackgroundType || 'Shapes'; // Default fallback
  
  // Access fields directly (Flat structure)
  const heroVideoUrl = homepageData?.heroBackgroundVideo?.url;
  const heroImageUrl = homepageData?.heroBackgroundImage?.url;

  // Determine if we should force white text (Only for Video or Image backgrounds)
  const hasMediaBackground = (heroType === 'Video' && heroVideoUrl) || (heroType === 'Image' && heroImageUrl);

  return (
    <>
      <Head>
        <title>Adaptive Intelligence | Homepage</title>
        <meta name="description" content="Fueling Creative Innovation and Digital Growth." />
      </Head>

      {/* --- 2. Pass the calculated boolean to Header --- */}
      <Header menuTextColor={hasMediaBackground ? "white" : "dark"} />

      {/* Hero Component handles the actual rendering of the background */}
      <Hero isHomePage={true} heroData={homepageData} />

      <Feedback feedbackData={homepageData} />

      <Feature featureData={homepageData} />

      {/* Services Section */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-140 pb-140 lg-pt-100 lg-pb-70">
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
                    />
                  </span>
                </h2>
                <p className="fs-20 mt-20">
                  {homepageData?.servicesSubtitle || "Powered by Innovation."}
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

      {/* Testimonials */}
      <div className="feedback-section-ten position-relative pt-200 lg-pt-150">
        <div className="container">
          <div className="position-relative">
            <div className="row">
              <div className="col-lg-5">
                <div
                  className="title-style-ten text-center text-lg-start"
                  data-aos="fade-right"
                >
                  <div className="sc-title">
                    {homepageData?.testimonialsTagline || "Client Testimonials"}
                  </div>
                  <h2 className="main-title font-recoleta fw-normal tx-dark">
                    {homepageData?.testimonialsTitle || "Trusted by"}
                    <span className="position-relative">
                      {" "}
                      {homepageData?.testimonialsTitleHighlight || "Leading"}{" "}
                      <Image
                        src="/images/shape/shape_129.svg"
                        alt=""
                        width={160}
                        height={6}
                      />
                    </span>
                    {homepageData?.testimonialsTitleEnd || " Brands"}
                  </h2>
                </div>
              </div>
            </div>
            <Testimonial />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="fancy-feature-thirtyThree mt-180 lg-mt-120">
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
          <div
            className="bg-wrapper position-relative mt-80 lg-mt-40"
            data-aos="fade-up"
          >
            <Faq />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="fancy-short-banner-twelve position-relative zn2 pt-160 pb-150 lg-pt-120 lg-pb-120">
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
              <LetsTalkButton 
                buttonText={homepageData?.ctaButtonText || "Send Message"} 
                href={homepageData?.ctaButtonUrl || "/contact"} 
              />
            </div>
          </div>
        </div>
        <div className="shapes shape-one" />
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
        `}</style>
      )}
    </>
  );
};

export async function getStaticProps() {
  // Revert to standard populate=* to ensure all fields (including shapes and nested components) are fetched correctly
  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/homepage?populate=*`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API fetch failed: ${res.status}`);
    const data = await res.json();
    
    // Flatten the response if needed (handling Strapi v5 structure)
    const homepageData = data?.data?.attributes || data?.data || null;
    
    return { props: { homepageData }, revalidate: 10 };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { props: { homepageData: null } };
  }
}

export default HomePage;