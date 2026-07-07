"use client";

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

/**
 * Non-compliant industry company cards.
 *
 * Desktop: static CSS grid (matches the desktop wireframe — up to 8 cards).
 * Mobile (< 768px): click-through carousel (one card at a time with arrows),
 * matching the mobile wireframe.
 *
 * `isMobile` starts false so the server renders the grid; it flips to the
 * carousel after mount if the viewport is narrow (SSR-safe, no hydration
 * mismatch because both branches share the same CompanyCard markup).
 */

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarRating = ({ score = 0 }) => {
  const n = Math.max(0, Math.min(5, Number(score) || 0));
  return (
    <div className="nc-stars" aria-label={`Adaptive score ${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`nc-star${i <= n ? ' filled' : ''}`}>★</span>
      ))}
    </div>
  );
};

const CompanyCard = ({ company }) => (
  <div className="nc-card">
    <h3 className="nc-card-name font-recoleta">{company.name}</h3>
    <p className="nc-card-desc">{company.description}</p>
    <div className="nc-card-footer">
      <div className="nc-card-score">
        <StarRating score={company.adaptiveScore} />
        <span className="nc-score-label">Adaptive Score</span>
      </div>
      {company.esgScoreUrl ? (
        <a
          className="nc-esg-link"
          href={company.esgScoreUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>ESG Score</span>
          <ArrowIcon />
        </a>
      ) : (
        <span className="nc-esg-link nc-esg-static">
          <span>ESG Score</span>
          <ArrowIcon />
        </span>
      )}
    </div>
  </div>
);

const IndustryCards = ({ companies = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!Array.isArray(companies) || companies.length === 0) return null;

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: companies.length > 1,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="nc-cards-wrap">
      {isMobile ? (
        <div className="nc-carousel">
          <Slider {...sliderSettings}>
            {companies.map((c, i) => (
              <div key={i} className="nc-slide">
                <CompanyCard company={c} />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="nc-grid">
          {companies.map((c, i) => (
            <CompanyCard key={i} company={c} />
          ))}
        </div>
      )}

      <style jsx>{`
        .nc-cards-wrap { width: 100%; }

        /* Desktop grid */
        .nc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1200px) and (min-width: 768px) {
          .nc-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .nc-slide { padding: 0 6px 10px; }
      `}</style>

      <style jsx global>{`
        .nc-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(21, 25, 55, 0.08);
          padding: 32px 24px 22px;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 260px;
          text-align: center;
        }
        .nc-card-name {
          font-size: 1.4rem;
          font-weight: 400;
          color: #151937;
          margin: 6px 0 18px;
        }
        .nc-card-desc {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.65;
          margin: 0 0 24px;
          flex-grow: 1;
        }
        .nc-card-footer {
          border-top: 1px solid #ececf1;
          padding-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        }
        .nc-card-score { display: flex; flex-direction: column; gap: 2px; }
        .nc-stars { display: flex; gap: 2px; font-size: 0.95rem; line-height: 1; }
        .nc-star { color: #d5d5dd; }
        .nc-star.filled { color: #ff1292; }
        .nc-score-label { font-size: 0.7rem; color: #999; }
        .nc-esg-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #151937;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .nc-esg-link:hover { color: #ff1292; }
        .nc-esg-static { cursor: default; }

        /* Mobile carousel arrows/dots */
        .nc-carousel { position: relative; padding: 0 34px; }
        .nc-carousel .slick-prev,
        .nc-carousel .slick-next {
          width: 30px; height: 30px; z-index: 2;
        }
        .nc-carousel .slick-prev { left: -4px; }
        .nc-carousel .slick-next { right: -4px; }
        .nc-carousel .slick-prev:before,
        .nc-carousel .slick-next:before {
          font-size: 30px; color: #151937; opacity: 0.55;
        }
        .nc-carousel .slick-dots li button:before { color: #ff1292; }
        .nc-carousel .slick-dots li.slick-active button:before { color: #ff1292; }
      `}</style>
    </div>
  );
};

export default IndustryCards;
