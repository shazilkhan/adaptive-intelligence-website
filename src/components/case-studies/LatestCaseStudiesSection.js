// components/case-studies/LatestCaseStudiesSection.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

const LatestCaseStudiesSection = () => {
  const [studies, setStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestStudies = async () => {
      try {
        const apiBase = getStrapiApiUrl();
        const res = await fetch(`${apiBase}/api/case-studies?populate=*&sort=publishedAt:desc&pagination[limit]=3`);
        if (!res.ok) throw new Error('Data could not be fetched.');
        
        const json = await res.json();
        setStudies(json.data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching case studies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestStudies();
  }, []);

  if (isLoading) return <div className="container pt-150 pb-150"><p>Loading latest work...</p></div>;
  if (error) return <div className="container pt-150 pb-150"><p>Could not load case studies.</p></div>;
  if (studies.length === 0) return null;

  return (
    <>
      <div className="latest-studies-section-wrapper pt-150 pb-150 lg-pt-120 lg-pb-120">
        <div className="container">
          <div className="section-header">
            <div className="title-style-ten">
              <div className="sc-title">Our Work</div>
              <h2 className="main-title font-recoleta fw-normal tx-dark">Featured Case Studies</h2>
            </div>
            <Link href="/case-studies" className="view-all-btn">
              View All Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="row g-4 mt-50 lg-mt-20">
            {studies.map((study) => {
              const heroImageUrl = getStrapiMediaUrl(study.heroImage?.url) || '/images/placeholder.png';

              return (
                <div key={study.id} className="col-lg-4 col-md-6">
                  <div className="featured-case-card">
                    <div className="case-image">
                      <Image src={heroImageUrl} alt={study.title || 'Case Study Image'} width={600} height={400} className="case-img" style={{ objectFit: 'cover' }} />
                      {/* Removed case-overlay here */}
                    </div>
                    <div className="case-content">
                      <div className="case-meta">
                        {study.client && <span className="client-name">{study.client}</span>}
                        {/* Moved category here, always visible */}
                        {study.category && <span className="case-category-visible">{study.category}</span>} 
                      </div>
                      <h3 className="case-title">{study.title}</h3>
                      <div className="case-results">
                        {study.results && (
                          <div className="result-highlight">
                            <span className="result-number">{study.results}</span>
                            <span className="result-label">Key Result</span>
                          </div>
                        )}
                        <Link href={`/case-studies/${study.slug}`} className="case-link">
                          View Details
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      <style jsx>{`
        /* Section Styles */
        .latest-studies-section-wrapper { background: #f8f9fa; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #e9ecef; padding-bottom: 30px; margin-bottom: 40px; }
        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 15px; }
        .main-title { font-size: 2.8rem; margin: 0; }
        .view-all-btn { display: flex; align-items: center; gap: 8px; color: #151937; text-decoration: none; font-weight: 500; transition: all 0.3s ease; flex-shrink: 0; }
        .view-all-btn:hover { color: #FF1292; transform: translateX(5px); }
        
        /* Card Styles */
        .featured-case-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; }
        .featured-case-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
        .case-image { position: relative; height: 300px; overflow: hidden; }
        .case-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .featured-case-card:hover .case-img { transform: scale(1.05); }
        /* Removed .case-overlay styles */
        
        .case-content { padding: 30px; flex-grow: 1; display: flex; flex-direction: column; }
        .case-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; } /* Added align-items and justify-content */
        .client-name { color: #666; font-size: 0.95rem; } /* Made client name less prominent */
        .case-category-visible { /* New style for the always visible category */
            background: rgba(255, 18, 146, 0.1); /* Lighter background */
            color: #FF1292; /* Pink text */
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.75rem;
            font-weight: 500;
            width: fit-content;
        }
        .case-title { font-size: 1.4rem; color: #151937; margin-bottom: 15px; font-family: 'Recoleta', serif; font-weight: 600; line-height: 1.3; flex-grow: 1; }
        .case-results { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #f0f0f0; }
        .result-highlight { display: flex; flex-direction: column; }
        .result-number { color: #FF1292; font-size: 1.1rem; font-weight: 600; line-height: 1; }
        .result-label { color: #666; font-size: 0.8rem; margin-top: 4px; }
        .case-link { display: flex; align-items: center; gap: 8px; color: #151937; text-decoration: none; font-weight: 500; transition: all 0.3s ease; }
        .case-link:hover { color: #FF1292; transform: translateX(5px); }

        @media (max-width: 768px) { 
          .section-header { flex-direction: column; align-items: center; text-align: center; gap: 20px; border: none; padding-bottom: 0; } 
          .main-title { font-size: 2.2rem; }
          .case-image { height: 280px; }
          .case-title { font-size: 1.2rem; }
          .case-meta { flex-direction: column; align-items: flex-start; gap: 8px; } /* Adjust for mobile */
        }
      `}</style>
    </>
  );
};

export default LatestCaseStudiesSection;