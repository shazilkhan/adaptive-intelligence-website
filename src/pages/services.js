import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/Header";
import LetsTalkButton from "@/components/LetsTalkButton";
import Testimonial from "@/components/home-page/Testimonial";
import Faq from "@/components/home-page/Faq";
import ClientCarousel from "@/components/ClientCarousel"; 
import LatestCaseStudiesSection from '@/components/case-studies/LatestCaseStudiesSection'; 
import IndustriesGrid from '@/components/IndustriesGrid';
import ServicesGridDark from "@/components/ServicesGridDark";
import FooterWithSettings from "@/components/footer/FooterWithSettings";

const ServicesPage = ({ servicesPageData }) => {
  
  // --- 1. Background Logic for Hero ---
  const heroType = servicesPageData?.heroBackgroundType || 'Image';
  
  // Strapi v5 Flat Structure Access
  const heroVideoUrl = servicesPageData?.heroBackgroundVideo?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${servicesPageData.heroBackgroundVideo.url}` 
    : null;
    
  const heroImageUrl = servicesPageData?.heroBackgroundImage?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${servicesPageData.heroBackgroundImage.url}` 
    : null;

  // Determine if we have media (to toggle white header text)
  const hasMediaBackground = (heroType === 'Video' && heroVideoUrl) || heroImageUrl;

  return (
    <>
      {/* --- Header: Dynamic Color based on Hero Media --- */}
      <Header menuTextColor={hasMediaBackground ? "white" : "dark"} />
      
      {/* --- Hero Section: Custom Cinematic Structure --- */}
      <div className="services-hero-section">
        
        {/* Background Layer */}
        <div className="hero-bg-wrapper">
            {heroType === 'Video' && heroVideoUrl ? (
                <video autoPlay loop muted playsInline className="hero-bg-media">
                    <source src={heroVideoUrl} type="video/mp4" />
                </video>
            ) : heroImageUrl ? (
                <Image 
                    src={heroImageUrl}
                    alt="Hero Background"
                    fill
                    className="hero-bg-media"
                    style={{ objectFit: 'cover' }}
                    priority
                />
            ) : (
                // Fallback Gradient
                <div className="hero-bg-fallback" />
            )}
            {/* Overlay to ensure text readability */}
            <div className="hero-overlay" />
        </div>

        {/* Content Layer */}
        <div className="container position-relative z-2">
            <div className="row">
                <div className="col-xl-10 m-auto text-center">
                    <div className="title-style-fourteen" data-aos="fade-up">
                        <h2 className="main-title font-recoleta fw-normal text-white">
                            {servicesPageData?.servicesHeroTitle || "Services"}.
                            <span className="position-relative ms-2">
                                <Image
                                    width={302}
                                    height={9}
                                    src="/images/shape/shape_186.svg"
                                    alt="shape"
                                    style={{ filter: 'brightness(0) invert(1)' }} // Make shape white
                                />
                            </span>
                        </h2>
                        <p className="text-lg text-white text-center lh-lg mt-25 md-mt-20" data-aos="fade-up">
                            {servicesPageData?.servicesHeroDescription || "We deliver comprehensive solutions that drive growth, enhance brand visibility, and create meaningful connections with your audience."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Services Grid Section (Dark) */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-180 pb-140 lg-pt-140 lg-pb-100" style={{ background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-9 m-auto">
              <div
                className="title-style-ten text-center pb-40 lg-pb-20"
                data-aos="fade-up"
              >
                <div className="sc-title" style={{ color: '#FF1292', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
                  {servicesPageData?.servicesSectionTagline || "Our Services"}
                </div>
                <h2 className="main-title font-recoleta fw-normal" style={{ color: 'white' }}>
                  {servicesPageData?.servicesSectionTitle || "Powered by"}
                  <span className="position-relative">
                    {" "}
                    {servicesPageData?.servicesSectionTitleHighlight || "Innovation"}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={220}
                      height={5}
                    />
                  </span>
                </h2>
                <p className="fs-20 mt-20" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {servicesPageData?.servicesSectionDescription || "Comprehensive solutions that drive growth and enhance brand visibility."}
                </p>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <ServicesGridDark />
          </div>
        </div>
      </div>

      {/* Approach Section - White Background */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-180 pb-180 lg-pt-140 lg-pb-140" style={{ background: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="approach-content-white text-center">
                {/* Section Title */}
                <div className="sc-title" style={{ color: '#FF1292', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
                  {servicesPageData?.approachTagline || "Our Approach"}
                </div>
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {servicesPageData?.approachTitle || "Our 5 Key"}
                  <span className="position-relative">
                    {" "}
                    {servicesPageData?.approachTitleHighlight || "Phases"}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={220}
                      height={5}
                      className="mx-auto"
                    />
                  </span>
                </h2>

                {/* New 5 Key Phases List */}
                <div className="phases-container mt-80 lg-mt-50 text-start">
                  {servicesPageData?.approachPhases?.map((phase, index) => (
                    <div key={index} className="phase-item-static">
                      <div className="phase-number-static">{`0${index + 1}`}</div>
                      <div className="phase-text-content">
                        <h4 className="phase-title-static">{phase.title}</h4>
                        <p className="phase-description-static">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Body Text with CTA */}
                <div className="col-lg-8 mx-auto">
                    <p className="approach-text-dark mt-60 lg-mt-40 fs-20">
                    {servicesPageData?.approachDescription || "This structured process ensures we cover every critical step, from initial understanding to a successful market launch, delivering results that are both measurable and impactful."}
                    </p>
                    <LetsTalkButton 
                      buttonText={servicesPageData?.approachButtonText || "Start Your Project"} 
                      href={servicesPageData?.approachButtonUrl || "/contact"}
                    />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Insights Section */}
      <div className="insights-section-wrapper" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Image Column */}
            <div className="col-lg-6">
              <div className="insights-image-container" data-aos="fade-right">
                <Image 
                  src={
                    servicesPageData?.insightsImage?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${servicesPageData.insightsImage.url}`
                      : "/images/assets/marketing_insights_placeholder.jpg" 
                  }
                  alt={servicesPageData?.insightsHeading || "Marketing Insights"}
                  width={600}
                  height={550}
                  className="insights-main-image"
                />
              </div>
            </div>
            
            {/* Text Content Column */}
            <div className="col-lg-6">
              <div className="insights-text-content" data-aos="fade-left">
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {servicesPageData?.insightsHeading || "Marketing Insights"}
                </h2>
                <p className="body-text fs-20 mt-30 mb-50 lg-mb-30">
                  {servicesPageData?.insightsBodyText || "Stay ahead of the curve with our data-driven analysis and strategic guidance. We help you navigate the complexities of the market to make informed decisions that drive success."}
                </p>
                <LetsTalkButton 
                  buttonText={servicesPageData?.insightsButtonText || "Market Trend Report"}
                  href={servicesPageData?.insightsButtonUrl || "/contact"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-180 pb-180 lg-pt-140 lg-pb-140" style={{ background: '#151937' }}>
        <div className="container">
          {/* Section Heading */}
          <div className="row">
            <div className="col-xl-8 col-lg-9 m-auto">
              <div
                className="title-style-ten text-center pb-80 lg-pb-50"
                data-aos="fade-up"
              >
                <h2 className="main-title font-recoleta fw-normal" style={{ color: 'white' }}>
                  {servicesPageData?.industriesHeading || "Industries We Have"}
                  <span className="position-relative">
                    {" "}
                    {servicesPageData?.industriesHeadingHighlight || "Served"}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="underline"
                      width={220} height={5} className="mx-auto"
                    />
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* Main Content: Image + Grid */}
          <div className="row align-items-center">
            {/* Image Column */}
            <div className="col-lg-6" data-aos="fade-right">
                <div className="capabilities-image-wrapper"> 
                    <Image
                    src={
                        servicesPageData?.industriesImage?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${servicesPageData.industriesImage.url}`
                        : "/images/assets/team-diverse-analysts-consultants-reviewing-data-checklists_482257-125957.jpg" 
                    }
                    alt={servicesPageData?.industriesHeading || "Industries served"}
                    width={600}
                    height={450}
                    className="capabilities-main-image" 
                    />
                </div>
            </div>

            {/* Industries Grid and CTA Column */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="capabilities-content ps-lg-5"> 
                <IndustriesGrid />
                <div className="mt-50">
                  <p className="industries-subtext" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', marginBottom: '30px' }}>
                    {servicesPageData?.industriesSubtext || "Not seeing your industry? Reach out to our team."}
                  </p>
                  <p className="industries-subtext" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', marginBottom: '30px' }}>
                    {servicesPageData?.industriesSubtext2 || "Not seeing your industry? Reach out to our team."}
                  </p>
                  <LetsTalkButton
                    buttonText={servicesPageData?.industriesButtonText || "Discuss Your Project"}
                    href={servicesPageData?.industriesButtonUrl || "/contact"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LatestCaseStudiesSection />

      {/* Clients Section */}
      <div className="clients-section pt-100 pb-100" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="main-title font-recoleta fw-normal tx-dark">Clients.</h2>
            <div className="title-underline mx-auto"></div>
            <p className="fs-20 mt-20">Trusted by industry leaders worldwide</p>
          </div>
          <div className="clients-carousel">
            <ClientCarousel />
          </div>
        </div>
      </div>

      {/* Testimonials Section - Black Background */}
      <div className="feedback-section-ten position-relative pt-200 pb-200 lg-pt-150 lg-pb-150" style={{ background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' }}>
        <div className="container">
          <div className="position-relative">
            <div className="row">
              <div className="col-lg-5">
                <div
                  className="title-style-ten text-center text-lg-start"
                  data-aos="fade-right"
                >
                  <div className="sc-title" style={{ color: '#FF1292', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
                    {servicesPageData?.testimonialsTagline || "Client Testimonials"}
                  </div>
                  <h2 className="main-title font-recoleta fw-normal" style={{ color: 'white', marginTop: '20px' }}>
                    {servicesPageData?.testimonialsTitle || "Trusted by"}{" "}
                    <span className="position-relative">
                      {servicesPageData?.testimonialsTitleHighlight || "Leading"}{" "}
                      <Image
                        src="/images/shape/shape_129.svg"
                        alt=""
                        width={160}
                        height={6}
                      />
                    </span>
                    {" "}{servicesPageData?.testimonialsTitleEnd || "Brands"}
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem', marginTop: '20px', lineHeight: '1.6' }}>
                    {servicesPageData?.testimonialsDescription || "Don't just take our word for it. Here's what our clients say about working with us."}
                  </p>
                </div>
              </div>
            </div>
            <Testimonial />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="fancy-feature-thirtyThree mt-180 lg-mt-120">
        <div className="container">
          <div className="title-style-ten text-center" data-aos="fade-up">
            <div className="sc-title">{servicesPageData?.faqTagline || "FAQs"}</div>
            <h2 className="main-title font-recoleta fw-normal tx-dark">
              {servicesPageData?.faqTitle || "Answers to your most &"}{" "}
              <span className="position-relative">
                {servicesPageData?.faqTitleHighlight || "frequently"}{" "}
                <Image
                  width={219}
                  height={7}
                  src="/images/shape/shape_132.svg"
                  alt=""
                />
              </span>
              {" "}{servicesPageData?.faqTitleEnd || "asked questions."}
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
                  {servicesPageData?.ctaTitle1 || "Have an idea for a project?"} <br />
                  <span className="position-relative">
                    {servicesPageData?.ctaTitleHighlight || "Let's Talk"}{" "}
                    <Image
                      width={221}
                      height={7}
                      src="/images/shape/shape_132.svg"
                      alt=""
                    />
                  </span>
                  {" "}{servicesPageData?.ctaTitleEnd || "& Grow your Business"}
                </h2>
              </div>
              <p
                className="text-lg mt-45 mb-55 lg-mb-30 lg-mt-40"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {servicesPageData?.ctaDescription || "We're ready to help you. Our experts are here, just send a message."}
              </p>
              <LetsTalkButton 
                buttonText={servicesPageData?.ctaButtonText || "Send Message"} 
                href={servicesPageData?.ctaButtonUrl || "/contact"} 
              />
            </div>
          </div>
        </div>
        <div className="shapes shape-one" />
      </div>

      <FooterWithSettings />

      <style jsx>{`
        /* White Header Fix */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        /* --- HERO STYLES (Cinematic / Large) --- */
        .services-hero-section { 
            position: relative; 
            overflow: hidden; 
            height: 80vh; 
            min-height: 600px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white; 
            text-align: center; 
        }
        .hero-bg-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .hero-bg-fallback { width: 100%; height: 100%; background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); position: absolute; top: 0; left: 0; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1; }
        .z-2 { z-index: 2; }

        /* Phases Container Styles */
        .phases-container { max-width: 800px; margin: 0 auto; }
        .phase-item-static { display: flex; align-items: flex-start; gap: 25px; padding: 30px 0; border-bottom: 1px solid #e9ecef; }
        .phase-item-static:last-child { border-bottom: none; }
        .phase-number-static { font-size: 1.5rem; font-weight: 700; color: #FF1292; font-family: 'Recoleta', serif; line-height: 1.2; }
        .phase-text-content { flex: 1; }
        .phase-title-static { font-size: 1.6rem; font-weight: 600; color: #151937; font-family: 'Recoleta', serif; margin: 0 0 10px; }
        .phase-description-static { color: #666; line-height: 1.7; font-size: 1.1rem; margin: 0; }

        /* Insights Section */
        .insights-section-wrapper { padding: 120px 0; }
        .insights-image-container { position: relative; }
        .insights-main-image { width: 100%; height: auto; object-fit: cover; border-radius: 12px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08); }
        .insights-text-content { padding-left: 40px; }
        .insights-text-content .main-title { line-height: 1.3; }
        .insights-text-content .body-text { color: #555; line-height: 1.7; }
        
        /* Capabilities Image */
        .capabilities-image-wrapper { position: relative; margin-bottom: 30px; }
        .capabilities-main-image { width: 100%; height: 400px; object-fit: cover; border-radius: 12px; }

        /* Clients */
        .title-underline { width: 60px; height: 4px; background: #FF1292; }
        .clients-carousel { margin-top: 40px; }

        /* Testimonials */
        .feedback-section-ten { background: #000 !important; }
        .feedback-section-ten .sc-title { color: #FF1292 !important; }
        .feedback-section-ten .main-title { color: white !important; }

        /* Responsive */
        @media (max-width: 991px) {
             .insights-text-content { padding-left: 0; margin-top: 50px; text-align: center; }
             .insights-section-wrapper { padding: 100px 0; }
        }
        @media (max-width: 768px) {
            .services-hero-section { height: 70vh; } /* Adjust for mobile */
            .phase-item-static { padding: 25px 0; gap: 15px; }
            .phase-title-static { font-size: 1.3rem; }
            .phase-description-static { font-size: 1rem; }
            .capabilities-main-image { height: 250px; }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/services-page?populate=*`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API fetch failed: ${res.status}`);
    const data = await res.json();
    const servicesPageData = data?.data || null;
    
    return { 
      props: { servicesPageData }, 
      revalidate: 10
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { 
      props: { servicesPageData: null } 
    };
  }
}
export default ServicesPage;