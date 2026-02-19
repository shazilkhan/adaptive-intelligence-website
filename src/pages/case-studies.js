import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterContent from '@/components/footer/FooterContent';
import Subscribe from '@/components/footer/Subscribe';
import CopyrightFooter from '@/components/footer/CopyrightFooter';
import LetsTalkButton from '@/components/LetsTalkButton';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';
import SEO from '@/components/SEO';

const CaseStudies = ({ allCaseStudies }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(allCaseStudies.map(study => study.category).filter(Boolean))];

  const filteredCaseStudies = activeFilter === 'All'
    ? allCaseStudies
    : allCaseStudies.filter(study => study.category === activeFilter);

  const featuredCaseStudies = allCaseStudies.filter(study => study.featured);

  return (
    <>
      <SEO
        pageTitle="Case Studies"
        metaDescription="Explore how we've helped leading brands transform their digital presence and achieve exceptional results."
      />
      <Header menuTextColor="white" />

      <div className="case-studies-hero pt-200 pb-100 lg-pt-150 lg-pb-80" style={{ background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-9 m-auto">
              <div className="title-style-ten text-center">

                <h1 className="main-title font-recoleta fw-normal">
                  Case
                  <span className="position-relative">
                    {" "}
                    Studies
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={220}
                      height={5}
                      style={{ filter: 'invert(1)' }}
                    />
                  </span>
                </h1>
                <p className="hero-description">
                  Explore how we've helped leading brands transform their digital presence and achieve exceptional results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="featured-cases pt-180 pb-150 lg-pt-120 lg-pb-120" style={{ background: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="title-style-ten text-center mb-5">

                <h2 className="main-title alt_main_title font-recoleta fw-normal tx-dark">
                  Success
                  <span className="position-relative">
                    {" "}
                    Stories
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="icon shape"
                      width={180}
                      height={5}
                    />
                  </span>
                </h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {featuredCaseStudies.map((study) => {
              const heroImageUrl = getStrapiMediaUrl(study.heroImage?.url) || '/images/placeholder.png';

              return (
                <div key={study.id} className="col-lg-4 col-md-6">
                  <div className="featured-case-card">
                    <div className="case-image">
                      <Image
                        src={heroImageUrl}
                        alt={study.title}
                        width={600}
                        height={400}
                        className="case-img"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="case-overlay">
                        <div className="case-category">{study.category}</div>
                        {study.metrics &&
                          <div className="case-metrics">
                            {Object.entries(study.metrics).map(([key, value], idx) => (
                              <div key={idx} className="metric-item">
                                <span className="metric-value">{value}</span>
                                <span className="metric-label">{key}</span>
                              </div>
                            ))}
                          </div>
                        }
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
                        {study.tags?.map(tag => (
                          <span key={tag.id} className="tag">{tag.text}</span>
                        ))}
                      </div>
                      <div className="case-results">
                        <div className="result-highlight">
                          <span className="result-number">{study.results}</span>
                          <span className="result-label">Key Result</span>
                        </div>
                        <Link href={`/case-studies/${study.slug}`} className="case-link">
                          View Details
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="cta-section pt-150 pb-150 lg-pt-120 lg-pb-120" style={{ background: 'linear-gradient(135deg, #FF1292 0%, #e60d82 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 m-auto text-center">
              <h2 className="cta-title">
                Ready to Create Your Success Story?
              </h2>
              <p className="cta-description">
                Let's discuss how we can help transform your brand and achieve exceptional results.
              </p>
              <LetsTalkButton
                buttonText="Start Your Project"
                href="/contact"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-style-nine theme-basic-footer zn2 position-relative">
        <div className="bg-wrapper">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-2 footer-intro mb-40">
                <div className="logo">
                  <Link href="/">
                    <Image src="/images/logo/logo_06.svg" alt="logo" width={115} height={80} />
                  </Link>
                </div>
              </div>
              <FooterContent />
              <div className="col-lg-4 mb-30 form-widget">
                <h5 className="footer-title fw-normal">Newsletter</h5>
                <h6 className="pt-15 pb-20 text-white">Join our newsletter</h6>
                <Subscribe />
                <div className="fs-14 mt-10 text-white opacity-50">
                  We only send interesting and relevant emails.
                </div>
              </div>
            </div>
          </div>
        </div>
        <CopyrightFooter />
      </div>


      <style jsx>{`
        /* White Header Fix */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) {
          color: white !important;
        }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) {
          color: #FF1292 !important;
        }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) {
          color: white !important;
          border-color: white !important;
          background: transparent !important;
        }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) {
          color: black !important;
          background: white !important;
        }

        /* All other existing styles for this page */
        .case-studies-hero { position: relative; overflow: hidden; }
        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .main-title { color: white; margin-bottom: 20px; font-size: 3.5rem; line-height: 1.2; }
        .alt_main_title { color: black; }
        .hero-description { color: rgba(255, 255, 255, 0.7); font-size: 1.2rem; max-width: 600px; margin: 20px auto 0; line-height: 1.6; }
        .featured-case-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; }
        .featured-case-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
        .case-image { position: relative; height: 350px; overflow: hidden; }
        .case-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .featured-case-card:hover .case-img { transform: scale(1.05); }
        .case-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.9) 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 25px; opacity: 0; transition: opacity 0.3s ease; }
        .featured-case-card:hover .case-overlay { opacity: 1; }
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
        .case-link { display: flex; align-items: center; gap: 8px; color: #151937; text-decoration: none; font-weight: 500; transition: all 0.3s ease; }
        .case-link:hover { color: #FF1292; transform: translateX(5px); }
        .cta-title { color: white; font-size: 2.5rem; margin-bottom: 20px; font-family: 'Recoleta', serif; font-weight: 400; }
        .cta-description { color: rgba(255, 255, 255, 0.9); font-size: 1.2rem; margin-bottom: 40px; line-height: 1.6; }
        @media (max-width: 768px) {
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
  const { getStrapiApiUrl } = await import('@/utils/strapi');
  const apiUrl = `${getStrapiApiUrl()}/api/case-studies?populate=deep`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch case studies");
    const json = await res.json();
    const normalize = (item) => item?.attributes ? { id: item.id, ...item.attributes } : item;
    const allCaseStudies = (json.data || []).map(normalize);
    return { props: { allCaseStudies }, };
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return { props: { allCaseStudies: [] } };
  }
}

export default CaseStudies;