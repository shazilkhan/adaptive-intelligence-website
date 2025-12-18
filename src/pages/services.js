import React from "react";
import Image from "next/image";
import Header from "@/components/header/Header";
import LetsTalkButton from "@/components/LetsTalkButton";
import Testimonial from "@/components/home-page/Testimonial";
import Faq from "@/components/home-page/Faq";
import ClientCarousel from "@/components/ClientCarousel";
import LatestCaseStudiesSection from '@/components/case-studies/LatestCaseStudiesSection';
import IndustriesGrid from '@/components/IndustriesGrid';
import ServicesGridBullets from "@/components/ServicesGridBullets";
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import Link from "next/link";
import SEO from "@/components/SEO";

const ServicesPage = ({ servicesPageData }) => {
  return (
    <>
      <SEO
        pageTitle={servicesPageData?.pageTitle || "Our Services"}
        metaDescription={servicesPageData?.metaDescription}
        ogImage={servicesPageData?.pagePreviewImage}
      />
      <Header menuTextColor="white" />

      {/* --- Hero Section --- */}
      <div className="services-hero-section">
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
            <div className="hero-bg-fallback" />
          )}
          <div className="hero-overlay" />
        </div>

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
                      style={{ filter: 'brightness(0) invert(1)' }}
                      className="hero-shape"
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

      {/* --- Services Grid Section --- */}
      {/* Added md-pt-80 md-pb-80 for mobile spacing */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-180 pb-140 lg-pt-140 lg-pb-100 md-pt-80 md-pb-80" style={{ background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' }}>
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
                <h2 className="main-title font-recoleta fw-normal" style={{ color: 'white', textTransform: 'none' }}>
                  {(servicesPageData?.servicesSectionTitle || "Powered by").replace("Powered By", "Powered by")}
                  <span className="position-relative">
                    {" "}
                    {servicesPageData?.servicesSectionTitleHighlight || "Adaptive Intelligence"}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={220}
                      height={5}
                      className="shape-svg"
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
            <ServicesGridBullets />
          </div>
        </div>
      </div>

      {/* --- Process Image Section --- */}
      {/* Added md-pt-80 md-pb-80 */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-140 pb-140 lg-pt-100 lg-pb-100 md-pt-80 md-pb-80" style={{ background: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="process-image-wrapper text-center" data-aos="fade-up">
                <Image
                  src={
                    servicesPageData?.processImage?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${servicesPageData.processImage.url}`
                      : "/images/assets/process_placeholder.jpg"
                  }
                  alt="Our Process"
                  width={1200}
                  height={800}
                  className="img-fluid process-main-image"
                  style={{ height: 'auto', borderRadius: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Insights Section */}
      <div className="insights-section-wrapper" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Added mb-50 on mobile to separate image from text */}
            <div className="col-lg-6 mb-50 lg-mb-0">
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
            <div className="col-lg-6">
              <div className="insights-text-content" data-aos="fade-left">
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {servicesPageData?.insightsHeading || "Marketing Insights"}
                </h2>
                <p className="body-text fs-20 mt-30 mb-50 lg-mb-30">
                  {servicesPageData?.insightsBodyText || "Stay ahead of the curve with our data-driven analysis and strategic guidance."}
                </p>
                <div className="d-flex justify-content-center">
                  <LetsTalkButton
                    buttonText={servicesPageData?.insightsButtonText || "Market Trend Report"}
                    href={servicesPageData?.insightsButtonUrl || "/contact"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* --- Clients Section (Full Width Infinite) --- */}
      {/* ============================================== */}
      <div className="clients-section pt-100 pb-100 md-pt-60 md-pb-60" style={{ background: '#f8f9fa' }}>

        {/* 1. Title Container (Stays Centered) */}
        <div className="container mb-50">
          <div className="text-center">
            <h2 className="main-title font-recoleta fw-normal tx-dark">Clients.</h2>
            <div className="title-underline mx-auto" style={{ width: '60px', height: '2px', background: '#000', marginTop: '15px' }}></div>
            <p className="fs-20 mt-20 opacity-75">Trusted by industry leaders worldwide</p>
          </div>
        </div>

        {/* 2. Carousel Container (Full Width) */}
        <div className="container-fluid p-0">
          <ClientCarousel />
        </div>

      </div>

      {/* Industries Section */}
      <div className="fancy-feature-thirtyOne position-relative zn2 pt-140 pb-140 lg-pt-100 lg-pb-100" style={{ background: '#151937' }}>
        <div className="container">

          {/* 1. Header Section */}
          <div className="row">
            <div className="col-xl-8 col-lg-9 m-auto">
              <div className="title-style-ten text-center pb-60 lg-pb-40" data-aos="fade-up">
                <h2 className="main-title font-recoleta fw-normal text-white">
                  {servicesPageData?.industriesHeading || "Industries We Have"}
                  <span className="position-relative ms-2">
                    {servicesPageData?.industriesHeadingHighlight || "Served"}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="underline"
                      width={220} height={5}
                      className="shape-svg"
                      style={{ position: 'absolute', bottom: '-5px', left: 0, width: '100%' }}
                    />
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* 2. Grid Section (Full Width) */}
          <div className="row">
            <div className="col-12" data-aos="fade-up">
              <IndustriesGrid />
            </div>
          </div>

          {/* 3. Bottom CTA Section (Centered) */}
          <div className="row mt-60 lg-mt-40">
            <div className="col-xl-8 m-auto text-center" data-aos="fade-up">
              <p className="text-white fs-20 lh-lg mb-35">
                {servicesPageData?.industriesSubtext || "Not seeing your industry? No problem. Reach out to our team! We likely have experience helping brands in your space."}
              </p>

              <LetsTalkButton
                buttonText={servicesPageData?.industriesButtonText || "Reach Out"}
                href={servicesPageData?.industriesButtonUrl || "/contact"}
                showIcon={true}
              />
            </div>
          </div>

        </div>
      </div>
      <LatestCaseStudiesSection />
      {/* ============================================== */}
      {/* --- CTA Section (Direct Implementation) --- */}
      {/* ============================================== */}
      {(() => {
        // 1. Data Source (Checks both pageData and common variations)
        const ctaData = servicesPageData || {};

        // 2. Text Logic (Matches your schema)
        const title = ctaData.ctaBgTitle || ctaData.ctaTitle || "Feeling Inspired Yet?";
        const subtitle = ctaData.ctaBgSubtitle || ctaData.ctaSubtitle || "We're only a click away.";
        const btnText = ctaData.ctaBgBtnText || ctaData.ctaBtnText || "Schedule a Marketing Audit";
        const btnUrl = ctaData.ctaBgBtnUrl || ctaData.ctaBtnUrl || "/contact";

        // 3. Smart Image Logic
        const getBgUrl = (obj) => {
          if (!obj) return null;
          const imgField = obj.ctaBgImage || obj['cta-bg'];
          if (!imgField) return null;
          return imgField.data?.attributes?.url || imgField.url || imgField.data?.url || null;
        };

        const rawUrl = getBgUrl(ctaData);
        // Build full URL if it's relative
        const fullUrl = rawUrl
          ? (rawUrl.startsWith('http') ? rawUrl : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${rawUrl}`)
          : null;

        return (
          <div className="cta-hardcoded-wrapper">

            {/* Background Image Container */}
            <div className="bg-image-holder">
              {fullUrl ? (
                <Image
                  src={fullUrl}
                  alt="Background"
                  fill
                  className="cta-cover-image"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="fallback-bg"></div>
              )}

              {/* Gradient Overlay */}
              <div className="overlay"></div>
            </div>

            <div className="container position-relative z-2">
              <div className="row">
                <div className="col-lg-10 m-auto text-center">

                  <h2 className="main-title" data-aos="fade-up">
                    {title}
                  </h2>

                  <p className="subtitle" data-aos="fade-up" data-aos-delay="100">
                    {subtitle}
                  </p>

                  <div className="btn-holder" data-aos="fade-up" data-aos-delay="200">
                    <div className="d-inline-block">
                      <LetsTalkButton
                        buttonText={btnText}
                        href={btnUrl}
                        showIcon={false}
                        className="custom-cta-button"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/*
      <div className="fancy-feature-thirtyThree mt-180 lg-mt-120 md-mt-80">
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
            className="bg-wrapper position-relative mt-80 lg-mt-40 md-mt-40"
            data-aos="fade-up"
          >
            <Faq />
          </div>
        </div>
      </div>

      <div className="fancy-short-banner-twelve position-relative zn2 pt-160 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80">
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
                className="text-lg mt-45 mb-55 lg-mb-30 lg-mt-40 md-mt-30 md-mb-30"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {servicesPageData?.ctaDescription || "We're ready to help you. Our experts are here, just send a message."}
              </p>
              
              <div 
                className="d-flex align-items-center justify-content-center gap-3"
                data-aos="fade-up" 
                data-aos-delay="300"
              >

                <LetsTalkButton 
                  buttonText={servicesPageData?.ctaButtonText || "Send Message"} 
                  href={servicesPageData?.ctaButtonUrl || "/contact"} 
                />


                {servicesPageData?.ctaButtonText2 && (
                  <Link
                    href={servicesPageData?.ctaButtonUrl2 || "/services"}
                    className="btn-pink-custom fw-500 tran3s d-inline-flex align-items-center justify-content-center"
                    style={{ minWidth: "180px" }}
                  >
                    {servicesPageData?.ctaButtonText2}
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .btn-twentyOne {
            padding-top: 0.9rem !important;
            padding-bottom: 0.9rem !important;
          }
          .btn-pink-custom {
            background-color: #FF1292;
            border: 2px solid #FF1292;
            color: white !important;
            padding-top: 0.9rem !important;
            padding-bottom: 0.9rem !important;
          }
          .btn-pink-custom:hover {
            background-color: transparent !important;
            color: #FF1292 !important;
          }
        `}} />
      </div> */}

      <FooterWithSettings />

      <style jsx>{`
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

        .process-image-wrapper {
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }
        .process-main-image {
            width: 100%;
            height: auto;
            object-fit: contain; 
        }

        .insights-section-wrapper { padding: 120px 0; }
        .insights-image-container { position: relative; }
        .insights-main-image { width: 100%; height: auto; object-fit: cover; border-radius: 12px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08); }
        .insights-text-content { padding-left: 40px; }
        .insights-text-content .main-title { line-height: 1.3; }
        .insights-text-content .body-text { color: #555; line-height: 1.7; }
        
        .capabilities-image-wrapper { position: relative; margin-bottom: 30px; }
        .capabilities-main-image { width: 100%; height: 400px; object-fit: cover; border-radius: 12px; }

        .title-underline { width: 60px; height: 4px; background: #FF1292; }
        .clients-carousel { margin-top: 40px; }

        .feedback-section-ten { background: #000 !important; }
        .feedback-section-ten .sc-title { color: #FF1292 !important; }
        .feedback-section-ten .main-title { color: white !important; }

        @media (max-width: 991px) {
             .insights-text-content { padding-left: 0; margin-top: 0; text-align: center; }
             .insights-section-wrapper { padding: 80px 0; }
        }
        @media (max-width: 768px) {
            .services-hero-section { 
                height: auto; 
                min-height: 500px; 
                padding-top: 120px; 
                padding-bottom: 80px;
            } 
            .capabilities-main-image { height: 250px; }
            .hero-shape { width: 200px; height: auto; }
        }
      `}</style>

      <style jsx global>{`
        body .theme-main-menu:not(.fixed) .navbar-nav .nav-link { color: white !important; }
        body .theme-main-menu:not(.fixed) .navbar-nav .nav-item:hover .nav-link,
        body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.active .nav-link,
        body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.current-menu-item .nav-link { color: #FF1292 !important; }
        body .theme-main-menu:not(.fixed) .lets-talk-btn { color: white !important; border-color: white !important; background: transparent !important; }
        body .theme-main-menu:not(.fixed) .lets-talk-btn:hover { color: black !important; background: white !important; }
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
    return { props: { servicesPageData }, revalidate: 10 };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { props: { servicesPageData: null } };
  }
}
export default ServicesPage;