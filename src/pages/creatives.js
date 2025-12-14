import React from 'react';
import Image from 'next/image';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import LetsTalkButton from "@/components/LetsTalkButton";

const Creatives = ({ pageData }) => {

  if (!pageData) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // --- Background Logic (Video vs Image) ---
  const heroType = pageData.heroBackgroundType || 'Image';
  const heroVideoUrl = pageData.heroBackgroundVideo?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundVideo.url}`
    : null;
  const heroImageUrl = pageData.heroBackgroundImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundImage.url}`
    : null;

  // Fallback images
  const missionImageUrl = pageData.missionImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.missionImage.url}`
    : '/images/media/img_133.jpg';

  return (
    <>
      <Header menuTextColor="white" />

      {/* --- HERO SECTION --- */}
      <section className="eco-hero">
        <div className="hero-background">
          {heroType === 'Video' && heroVideoUrl ? (
            <video autoPlay loop muted playsInline className="hero-video-bg">
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt="Hero Background"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#151937' }}></div>
          )}
          <div className="hero-overlay" />
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">

              <h1 className="main-title">
                {pageData.heroTitle || 'Shape the Future'}
              </h1>
              <p className="hero-subtitle">
                {pageData.heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <div className="mission-section pt-150 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80" style={{ background: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-lg-0 mb-50">
              <div className="mission-content">
                <h2 className="section-title font-recoleta">{pageData.missionTitle || 'What We Do'}</h2>
                <p className="mission-text">{pageData.missionParagraph1}</p>
                <p className="mission-text">{pageData.missionParagraph2}</p>

                <div className="mt-40">
                  <LetsTalkButton
                    buttonText={pageData.joinUsButtonText || "Join Us"}
                    href={pageData.joinUsButtonUrl || "/contact"}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mission-image">
                <Image
                  src={missionImageUrl}
                  alt="Team collaboration"
                  width={600}
                  height={400}
                  className="rounded-img"
                  // FIX: Force width 100% and height auto to maintain aspect ratio
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- VALUES SECTION --- */}
      <div className="values-section pt-150 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* On mobile, move text to bottom so image is first */}
            <div className="col-lg-6 mb-50 lg-mb-0">
              <div className="mission-image">
                <Image
                  src={
                    pageData.valuesImage?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.valuesImage.url}`
                      : '/images/media/img_133.jpg'
                  }
                  alt={pageData.valuesTitle || 'Our Values'}
                  width={600}
                  height={450}
                  className="rounded-img"
                  // FIX: Force width 100% and height auto to maintain aspect ratio
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mission-content ps-lg-5">
                <div className="sc-title">{pageData.valuesTagline || 'Our Values'}</div>
                <h2 className="section-title font-recoleta">{pageData.valuesTitle || 'What Drives Us'}</h2>
                <p className="mission-text mt-30">
                  {pageData.valuesDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BENEFITS SECTION --- */}
      <div className="benefits-section pt-150 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80" style={{ background: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-last mb-50 lg-mb-0">
              <div className="mission-image">
                <Image
                  src={
                    pageData.benefitsImage?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.benefitsImage.url}`
                      : '/images/media/img_133.jpg'
                  }
                  alt={pageData.benefitsTitle || 'Benefits & Perks'}
                  width={600}
                  height={450}
                  className="rounded-img"
                  // FIX: Force width 100% and height auto to maintain aspect ratio
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mission-content pe-lg-5">
                <div className="sc-title">{pageData.benefitsTagline || 'Why Join Us'}</div>
                <h2 className="section-title font-recoleta">{pageData.benefitsTitle || 'Benefits & Perks'}</h2>
                <p className="mission-text mt-30">
                  {pageData.benefitsDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="cta-section pt-150 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80" style={{ background: 'linear-gradient(135deg, #FF1292 0%, #e60d82 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 m-auto text-center">

              <div className="sc-title" style={{ color: '#FF1292', marginBottom: '20px' }}>
                {pageData.heroTagline || 'Join Our Team'}
              </div>
              <h2 className="cta-title">{pageData.ctaTitle || 'Ready to Join Our Team?'}</h2>
              <p className="cta-description">{pageData.ctaDescription}</p>
              <div className="cta-buttons">
                <a
                  href={pageData.applyButtonUrl || 'https://smlof6a6801.typeform.com/to/dBDGwPOT'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-button"
                >
                  {pageData.applyButtonText || 'Apply to Work With Us'}
                </a>
              </div>
              <p className="contact-info">
                Questions? Reach us at{' '}
                <a href={`mailto:${pageData.hrEmail || 'HR@aii.agency'}`} className="email-link">
                  {pageData.hrEmail || 'HR@aii.agency'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterWithSettings />

      <style jsx>{`
        /* --- Header Fixes --- */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        /* --- HERO STYLES --- */
        .eco-hero { 
            position: relative; 
            height: 80vh; 
            min-height: 600px; 
            display: flex; 
            align-items: center; 
            color: white; 
            text-align: center; 
        }
        .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1; }
        .hero-video-bg { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        
        .main-title { font-family: 'Recoleta', serif; font-size: 4rem; font-weight: 400; color: white; line-height: 1.2; margin-bottom: 20px; }
        .hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.85); max-width: 800px; margin: 0 auto; line-height: 1.6; }

        /* --- GENERAL STYLES --- */
        .sc-title {
          color: #FF1292;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 2.5rem;
          color: #151937;
          margin-bottom: 30px;
          font-weight: 400;
        }
        .mission-text {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .rounded-img {
          border-radius: 12px;
          /* Height auto and Width 100% handled inline to be safe */
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        /* --- CTA STYLES --- */
        .cta-title {
          color: white;
          font-size: 2.8rem;
          margin-bottom: 20px;
          font-family: 'Recoleta', serif;
          font-weight: 400;
        }
        .cta-description {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.2rem;
          margin-bottom: 50px;
          line-height: 1.6;
        }
        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }
        .apply-button {
          background: white;
          color: #FF1292;
          padding: 18px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .apply-button:hover {
          background: #151937;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .contact-button {
          background: transparent;
          color: white;
          padding: 18px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          border: 2px solid white;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .contact-button:hover {
          background: white;
          color: #FF1292;
          transform: translateY(-3px);
        }
        .contact-info {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          margin-top: 20px;
        }
        .email-link {
          color: white;
          text-decoration: underline;
          font-weight: 600;
        }
        .email-link:hover {
          color: #151937;
        }

        /* --- MOBILE & TABLET OPTIMIZATION --- */
        @media (max-width: 991px) {
            .main-title { font-size: 3rem; }
            .section-title { font-size: 2rem; }
            .cta-title { font-size: 2.2rem; }
        }

        @media (max-width: 768px) {
          .eco-hero { 
            /* Reverted to Fixed Height for Cinematic look, but reduced from 80vh */
            height: 70vh; 
            min-height: 500px;
          }
          .main-title { 
            font-size: 2.5rem; 
            line-height: 1.2;
          }
          .section-title { 
            font-size: 2rem; 
            margin-bottom: 20px;
          }
          .cta-title { 
            font-size: 2rem; 
          }
          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }
          .apply-button, .contact-button {
            width: 100%;
            max-width: 300px;
            text-align: center;
            padding: 15px 30px;
          }
          .mission-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  try {
    const pageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/creatives-page?populate=*`;
    const pageRes = await fetch(pageUrl);
    const pageJson = await pageRes.json();
    const pageData = pageJson.data || null;

    return {
      props: { pageData },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching creatives page data:", error);
    return { props: { pageData: null } };
  }
}

export default Creatives;