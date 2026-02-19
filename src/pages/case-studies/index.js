import SEO from '@/components/SEO';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';
import LetsTalkButton from "@/components/LetsTalkButton";


const CaseStudies = ({ allCaseStudies, pageData }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Fallback data if Strapi Single Type is empty
  const data = pageData || {};

  // --- Hero Background Logic ---
  const heroType = data.heroBackgroundType || 'Image';

  const heroVideoUrl = getStrapiMediaUrl(data.heroBackgroundVideo?.url);
  const heroImageUrl = getStrapiMediaUrl(data.heroBackgroundImage?.url);

  const isVideo = heroType === 'Video' || heroType === 'video' || heroType === 'heroBackgroundVideo';

  return (
    <>
      <SEO
        pageTitle={data.pageTitle || "Case Studies"}
        metaDescription={data.metaDescription || "Explore how we've helped leading brands transform their digital presence."}
        ogImage={data.pagePreviewImage}
      />
      <Header menuTextColor="white" />

      {/* --- HERO SECTION --- */}
      <div className="case-studies-hero">

        <div className="hero-bg-wrapper">
          {isVideo && heroVideoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hero-bg-media"
            >
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

        <div className="container position-relative">
          <div className="row">
            <div className="col-xl-8 col-lg-9 m-auto">
              <div className="title-style-ten text-center">
                <h1 className="main-title font-recoleta fw-normal">
                  {data.heroTitle || 'Case Studies'}
                  <span className="position-relative d-inline-block ms-2">
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="underline"
                      width={220}
                      height={5}
                      className="shape-underline"
                    />
                  </span>
                </h1>
                <p className="hero-description">
                  {data.heroDescription || "Explore how we've helped leading brands transform their digital presence and achieve exceptional results."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED CASES GRID --- */}
      <div className="featured-cases pt-180 pb-150 lg-pt-120 lg-pb-120" style={{ background: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="title-style-ten text-center mb-5">
                <div className="sc-title">{data.featuredTagline || 'Our Work'}</div>
                <h2 className="main-title alt_main_title font-recoleta fw-normal tx-dark">
                  {data.featuredTitle || 'Success Stories'}
                  <span className="position-relative d-inline-block ms-2">
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={180}
                      height={5}
                      style={{ position: 'absolute', bottom: 0, left: 0, filter: 'invert(0)' }}
                    />
                  </span>
                </h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {allCaseStudies.map((study) => {
              const studyHeroUrl = study.heroImage?.url
                ? getStrapiMediaUrl(study.heroImage?.url)
                : '/images/placeholder.png';

              return (
                <div key={study.id} className="col-lg-4 col-md-6">
                  {/* FIX: Wrap the entire card in the Link.
                      Added 'd-block h-100 text-decoration-none' to maintain layout and remove blue links.
                  */}
                  <Link href={`/case-studies/${study.slug}`} className="d-block h-100 text-decoration-none card-link-wrapper">
                    <div className="featured-case-card">
                      <div className="case-image">
                        <Image
                          src={studyHeroUrl}
                          alt={study.title}
                          width={600}
                          height={400}
                          className="case-img"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="case-overlay">
                          <div className="case-category">{study.category}</div>
                          {study.metrics && (
                            <div className="case-metrics">
                              {Object.entries(study.metrics).map(([key, value], idx) => (
                                <div key={idx} className="metric-item">
                                  <span className="metric-value">{value}</span>
                                  <span className="metric-label">{key}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="case-content">
                        <div className="case-meta">
                          <span className="client-name">{study.client}</span>
                          <span className="industry">{study.industry}</span>
                        </div>
                        <h3 className="case-title">{study.title}</h3>
                        <p className="case-description">{study.description}</p>
                        <div className="case-tags">
                          {study.tags?.map((tag, i) => (
                            <span key={tag.id || i} className="tag">{tag.text}</span>
                          ))}
                        </div>
                        <div className="case-results">
                          <div className="result-highlight">
                            <span className="result-number">{study.results}</span>
                            <span className="result-label">Key Result</span>
                          </div>
                          {/* FIX: Changed from Link to span to prevent illegal nested links.
                                The parent Link handles the click now.
                            */}
                          <span className="case-link">
                            View Details
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="cta-section pt-150 pb-150 lg-pt-120 lg-pb-120" style={{ background: 'linear-gradient(135deg, #FF1292 0%, #e60d82 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 m-auto text-center">
              <h2 className="cta-title">
                {data.ctaTitle || 'Ready to Create Your Success Story?'}
              </h2>
              <p className="cta-description">
                {data.ctaDescription || "Let's discuss how we can help transform your brand and achieve exceptional results."}
              </p>
              <LetsTalkButton
                buttonText={data.ctaButtonText || "Start Your Project"}
                href={data.ctaButtonUrl || "/contact"}
              />
            </div>
          </div>
        </div>
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

        /* --- HERO STYLES --- */
        .case-studies-hero { 
            position: relative; 
            overflow: hidden; 
            height: 80vh; 
            min-height: 600px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }

        .hero-bg-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .hero-bg-fallback { width: 100%; height: 100%; background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); position: absolute; top: 0; left: 0; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1; }
        .position-relative { position: relative; z-index: 2; }

        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .main-title { color: white; margin-bottom: 20px; font-size: 3.5rem; line-height: 1.2; }
        .alt_main_title { color: black; }
        .hero-description { color: rgba(255, 255, 255, 0.7); font-size: 1.2rem; max-width: 600px; margin: 20px auto 0; line-height: 1.6; }
        
        .main-title .shape-underline { 
            filter: invert(1); 
            position: absolute; 
            bottom: -10px; 
            left: 0; 
            width: 100%; 
            height: auto; 
        }

        /* Card Styles */
        .card-link-wrapper:hover .featured-case-card { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
        .card-link-wrapper:hover .case-img { transform: scale(1.05); }
        .card-link-wrapper:hover .case-overlay { opacity: 1; }
        .card-link-wrapper:hover .case-link { color: #FF1292; transform: translateX(5px); }

        .featured-case-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; }
        .case-image { position: relative; height: 350px; overflow: hidden; }
        .case-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .case-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.9) 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 25px; opacity: 0; transition: opacity 0.3s ease; }
        .case-category { background: rgba(255, 18, 146, 0.9); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; width: fit-content; }
        .case-metrics { display: flex; gap: 25px; align-self: flex-end; }
        .metric-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .metric-value { color: white; font-weight: 600; font-size: 1.2rem; margin-bottom: 4px; }
        .metric-label { color: rgba(255, 255, 255, 0.8); font-size: 0.75rem; text-transform: capitalize; }
        .case-content { padding: 30px; flex-grow: 1; display: flex; flex-direction: column; }
        .case-meta { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .client-name { color: #FF1292; font-weight: 600; font-size: 0.95rem; }
        .industry { color: #666; font-size: 0.85rem; }
        .case-title { font-size: 1.4rem; color: #151937; margin-bottom: 15px; font-family: 'Recoleta', serif; font-weight: 600; line-height: 1.3; }
        .case-description { color: #666; line-height: 1.6; margin-bottom: 20px; flex-grow: 1; }
        .case-tags { display: flex; gap: 8px; margin-bottom: 25px; flex-wrap: wrap; }
        .tag { background: #f8f9fa; color: #151937; padding: 6px 12px; border-radius: 15px; font-size: 0.75rem; font-weight: 500; }
        .case-results { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .result-highlight { display: flex; flex-direction: column; }
        .result-number { color: #FF1292; font-size: 1.1rem; font-weight: 600; line-height: 1; }
        .result-label { color: #666; font-size: 0.8rem; margin-top: 4px; }
        .case-link { display: flex; align-items: center; gap: 8px; color: #151937; font-weight: 500; transition: all 0.3s ease; }
        
        .cta-title { color: white; font-size: 2.5rem; margin-bottom: 20px; font-family: 'Recoleta', serif; font-weight: 400; }
        .cta-description { color: rgba(255, 255, 255, 0.9); font-size: 1.2rem; margin-bottom: 40px; line-height: 1.6; }

        @media (max-width: 768px) {
          .case-studies-hero { height: 70vh; }
          .main-title { font-size: 2.5rem; }
          .hero-description { font-size: 1rem; }
          .case-image { height: 280px; }
          .case-title { font-size: 1.2rem; }
          .case-metrics { gap: 15px; }
          .case-results { flex-direction: column; gap: 15px; align-items: flex-start; }
          .metric-value { font-size: 1rem; }
          .cta-title { font-size: 2rem; }
          .cta-description { font-size: 1rem; }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const base = getStrapiApiUrl();
    const [casesRes, pageRes] = await Promise.all([
      fetch(`${base}/api/case-studies?populate=*`),
      fetch(`${base}/api/case-studies-page?populate=*`)
    ]);

    const casesJson = casesRes.ok ? await casesRes.json() : { data: [] };
    const allCaseStudies = casesJson.data || [];

    const pageJson = pageRes.ok ? await pageRes.json() : { data: null };
    const pageData = pageJson.data || null;

    return {
      props: {
        allCaseStudies,
        pageData
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { allCaseStudies: [], pageData: null } };
  }
}

export default CaseStudies;