"use client";

import React, { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import Slider from 'react-slick';
// slick-theme supplies the arrow/dot glyphs. Only core slick.css is loaded
// globally, and slick-theme is otherwise only pulled in on the homepage, so
// this route needs it explicitly for the mobile carousel arrows/dots to show.
import 'slick-carousel/slick/slick-theme.css';

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

const FlipIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 10.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" />
  </svg>
);

const DEFAULT_SCORE_INFO = 'Adaptive Intelligence conducts quarterly reviews and gives companies aggregate scores.';

const formatScoreDate = (value) => {
  if (!value) return 'Not yet provided';

  const parts = String(value).slice(0, 10).split('-');
  if (parts.length !== 3) return value;

  return `${parts[1]}/${parts[2]}/${parts[0]}`;
};

const StarRating = ({ score = 0, label = 'Adaptive score' }) => {
  const n = Math.max(0, Math.min(5, Number(score) || 0));
  return (
    <div className="nc-stars" aria-label={`${label} ${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`nc-star${i <= n ? ' filled' : ''}`}>★</span>
      ))}
    </div>
  );
};

const ScoreInfoModal = ({ company, onClose }) => {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="nc-score-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="nc-score-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className="nc-modal-close" onClick={onClose} aria-label="Close score information">
          ×
        </button>
        <h3 id={titleId} className="nc-score-modal-title font-recoleta">
          {company.scoreInfoTitle || 'Understanding Scores'}
        </h3>
        <p className="nc-score-modal-copy">
          {company.scoreInfoDescription || DEFAULT_SCORE_INFO}
        </p>
        <div className="nc-score-modal-divider" />
        <p className="nc-score-modal-date">
          <span>Score Last Updated:</span> {formatScoreDate(company.scoreLastUpdated)}
        </p>
      </div>
    </div>
    ,
    document.body
  );
};

const CompanyCard = ({ company }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const fallbackScore = company.adaptiveScore ?? 0;
  const scoreCriteria = [
    {
      label: 'Integrity & Transparency',
      score: company.integrityTransparencyScore ?? fallbackScore,
    },
    {
      label: 'Consumer Wellbeing',
      score: company.consumerWellbeingScore ?? fallbackScore,
    },
    {
      label: 'Ethical & Corporate Governance',
      score: company.ethicalCorporateGovernanceScore ?? fallbackScore,
    },
    {
      label: 'Lifecycle Environmental Impact',
      score: company.lifecycleEnvironmentalImpactScore ?? fallbackScore,
    },
  ];

  return (
    <div className={`nc-card${isFlipped ? ' is-flipped' : ''}`}>
      <div className="nc-card-inner">
        <article className="nc-card-face nc-card-front" aria-hidden={isFlipped}>
          <button
            type="button"
            className="nc-flip-button"
            onClick={() => setIsFlipped(true)}
            aria-label={`Show ${company.name} score criteria`}
            tabIndex={isFlipped ? -1 : 0}
          >
            <FlipIcon />
          </button>

          <h3 className="nc-card-name font-recoleta">{company.name}</h3>
          <p className="nc-card-desc">{company.description}</p>

          <div className="nc-card-footer">
            <div className="nc-card-score">
              <StarRating score={company.adaptiveScore} />
              <button
                type="button"
                className="nc-score-info-button"
                onClick={() => setShowScoreInfo(true)}
                aria-haspopup="dialog"
                tabIndex={isFlipped ? -1 : 0}
              >
                <span>Adaptive Score</span>
                <InfoIcon />
              </button>
            </div>
            {company.esgScoreUrl ? (
              <a
                className="nc-esg-link"
                href={company.esgScoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isFlipped ? -1 : 0}
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
        </article>

        <article className="nc-card-face nc-card-back" aria-hidden={!isFlipped}>
          <button
            type="button"
            className="nc-flip-button"
            onClick={() => setIsFlipped(false)}
            aria-label={`Show ${company.name} company information`}
            tabIndex={isFlipped ? 0 : -1}
          >
            <FlipIcon />
          </button>

          <h3 className="nc-criteria-title font-recoleta">Score Criteria</h3>
          <div className="nc-criteria-list">
            {scoreCriteria.map((criterion) => (
              <div className="nc-criterion" key={criterion.label}>
                <span className="nc-criterion-label">{criterion.label}</span>
                <StarRating score={criterion.score} label={criterion.label} />
              </div>
            ))}
          </div>
          <div className="nc-aggregate-score">
            <span className="nc-criterion-label">Aggregate Adaptive Score</span>
            <StarRating score={company.adaptiveScore} label="Aggregate Adaptive Score" />
          </div>
        </article>
      </div>

      {showScoreInfo && (
        <ScoreInfoModal company={company} onClose={() => setShowScoreInfo(false)} />
      )}
    </div>
  );
};

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
          <div className="nc-examples-label">Top 10 Examples</div>
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
          height: 100%;
          min-height: 430px;
          perspective: 1200px;
          text-align: center;
        }
        .nc-card-inner {
          display: grid;
          height: 100%;
          min-height: 430px;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .nc-card.is-flipped .nc-card-inner { transform: rotateY(180deg); }
        .nc-card-face {
          grid-area: 1 / 1;
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 430px;
          padding: 42px 24px 22px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 10px 40px rgba(21, 25, 55, 0.08);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .nc-card-back {
          justify-content: center;
          transform: rotateY(180deg);
        }
        .nc-flip-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 30px;
          height: 30px;
          border: 1.5px solid #ff1292;
          border-radius: 50%;
          background: #ffffff;
          color: #ff1292;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
        }
        .nc-flip-button:hover,
        .nc-flip-button:focus-visible {
          color: #ffffff;
          background: #ff1292;
          transform: translateX(2px);
          outline: none;
        }
        .nc-card-name {
          font-size: 1.6rem;
          font-weight: 400;
          color: #151937;
          margin: 6px 0 20px;
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
        .nc-score-info-button {
          border: 0;
          background: transparent;
          color: #ff1292;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 0 0;
          font-size: 0.7rem;
          line-height: 1;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .nc-score-info-button:hover,
        .nc-score-info-button:focus-visible {
          opacity: 0.72;
          outline: none;
        }
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

        /* Flip side */
        .nc-criteria-title {
          color: #151937;
          font-size: 1.75rem;
          font-weight: 400;
          margin: 0 0 22px;
        }
        .nc-criteria-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .nc-criterion,
        .nc-aggregate-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .nc-criterion-label {
          color: #151515;
          font-size: 0.9rem;
          line-height: 1.25;
        }
        .nc-aggregate-score {
          border-top: 1px solid #d8d8dd;
          margin-top: 22px;
          padding-top: 18px;
        }
        .nc-card-back .nc-stars { font-size: 1.15rem; gap: 5px; }

        /* Score information popup */
        .nc-score-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 11000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(21, 25, 55, 0.55);
          backdrop-filter: blur(5px);
        }
        .nc-score-modal {
          position: relative;
          width: min(100%, 520px);
          background: #ffffff;
          border-radius: 30px;
          box-shadow: 0 24px 80px rgba(21, 25, 55, 0.25);
          padding: 44px 40px 34px;
          text-align: center;
        }
        .nc-modal-close {
          position: absolute;
          top: 15px;
          right: 18px;
          border: 0;
          background: transparent;
          color: #151937;
          font-size: 1.8rem;
          line-height: 1;
          padding: 4px;
          cursor: pointer;
        }
        .nc-modal-close:hover,
        .nc-modal-close:focus-visible {
          color: #ff1292;
          outline: none;
        }
        .nc-score-modal-title {
          color: #151937;
          font-size: clamp(2rem, 5vw, 2.65rem);
          font-weight: 400;
          margin: 0 0 24px;
        }
        .nc-score-modal-copy,
        .nc-score-modal-date {
          color: #151515;
          font-size: 1rem;
          line-height: 1.55;
          margin: 0;
        }
        .nc-score-modal-divider {
          height: 1px;
          background: #d8d8dd;
          margin: 28px 0 20px;
        }
        .nc-score-modal-date span { font-weight: 500; }

        /* Mobile carousel arrows/dots */
        .nc-carousel { position: relative; padding: 0 34px; }
        .nc-examples-label { text-align: center; color: #ff1292; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; font-weight: 600; margin: 0 0 24px; }
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

        @media (max-width: 767px) {
          .nc-card,
          .nc-card-inner,
          .nc-card-face { min-height: 440px; }
          .nc-card-face { padding: 42px 20px 22px; border-radius: 24px; }
          .nc-criteria-list { gap: 17px; }
          .nc-score-modal { padding: 42px 24px 30px; border-radius: 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nc-card-inner { transition: none; }
        }
      `}</style>
    </div>
  );
};

export default IndustryCards;
