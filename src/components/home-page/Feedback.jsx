import Image from "next/image";
import React from "react";

const Feedback = ({ feedbackData }) => {
  const images = [
    {
      src: "/images/ChromeShapes/Shape_FatCylinder2.png",
      alt: "shape",
      className: "lazy-img shapes shape-one",
      width: 236,
      height: 200,
    },
    {
      src: "/images/ChromeShapes/Shape_JellyCube1.png",
      alt: "shape",
      className: "lazy-img shapes shape-two",
      width: 170,
      height: 150,
    },
    {
      src: "/images/ChromeShapes/Shape_Macaroni2.png",
      alt: "shape",
      className: "lazy-img shapes shape-three",
      width: 153,
      height: 100,
    },
    {
      src: "/images/ChromeShapes/Shape_Ring1.png",
      alt: "shape",
      className: "lazy-img shapes shape-four",
      width: 200,
      height: 225,
    },
  ];

  const avatarUrl = feedbackData?.feedbackAvatar?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${feedbackData.feedbackAvatar.url}`
    : "/images/team/adam.jpeg";

  const avatarAlt = feedbackData?.feedbackAvatar?.alternativeText || "Founder and CEO";
  const quoteStart = feedbackData?.feedbackQuoteStart || "Adaptive Intelligence is pushing the";
  const quoteHighlight = feedbackData?.feedbackQuoteHighlight || "boundaries";
  const quoteEnd = feedbackData?.feedbackQuoteEnd || "of creative norms, and our work showcases that.";
  const authorName = feedbackData?.feedbackAuthorName || "Adam Isaac Itkoff";
  const authorTitle = feedbackData?.feedbackAuthorTitle || "Founder and CEO";

  return (
    <div
      className="feedback-section-eight position-relative pt-200 pb-30 lg-pt-120"
      data-aos="fade-up"
    >
      <div className="container">
        <Image
          src={avatarUrl}
          alt={avatarAlt}
          className="feedback-avatar-image lazy-img m-auto rounded-circle"
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
        <div className="row">
          <div className="col-xxl-11 col-lg-10 col-md-9 m-auto">
            <div className="feedback_slider_eight">
              <div className="item">
                <div className="feedback-block-eight text-center">
                  <p className="font-recoleta tx-dark mt-60 mb-65 lg-mt-40 lg-mb-40 quote-text">
                    &quot;{quoteStart} <span style={{ color: "#FF1292" }}>{quoteHighlight}</span> {quoteEnd}&quot;
                  </p>

                  {/* Wrapped Container for Name + Button to share width */}
                  <div className="d-inline-flex flex-column align-items-stretch mt-4">
                    <h6 className="fw-normal fs-20 fst-italic position-relative ps-4 mb-3 text-start">
                      {authorName}, {authorTitle}
                    </h6>

                    {/* LinkedIn Badge - Styled to match "Connect with me on LinkedIn" reference */}
                    <a
                      href={feedbackData?.feedbackAuthorLinkedIn || "https://www.linkedin.com/company/adaptiveintelligenceinternational/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-badge d-flex align-items-center justify-content-center gap-3"
                      style={{
                        background: '#0077B5', // Official LinkedIn Blue
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '4px', // Slightly more square radius like the badge
                        textDecoration: 'none',
                        border: '1px solid #006097',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#006097';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0077B5';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Logo Box */}
                      <div style={{
                        background: 'white',
                        borderRadius: '2px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="fab fa-linkedin-in" style={{ fontSize: '22px', color: '#0077B5' }}></i>
                      </div>

                      {/* Stacked Text */}
                      <div className="d-flex flex-column align-items-start" style={{ lineHeight: '1.1' }}>
                        <span style={{ fontSize: '11px', fontWeight: '400', opacity: '0.9' }}>Connect with me on</span>
                        <span style={{ fontSize: '19px', fontWeight: '700', letterSpacing: '0.5px' }}>LinkedIn</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* --- MOBILE OVERRIDES ONLY (< 768px) --- */
        @media (max-width: 767px) {
            
            /* 1. Reduce the massive 200px padding from the theme */
            .feedback-section-eight {
                padding-top: 80px !important;
                padding-bottom: 50px !important;
                overflow: hidden; /* Ensures shapes don't cause horizontal scroll */
            }

            /* 2. Resize the Font Size Only (Keep font-family) */
            .quote-text {
                font-size: 40px !important; /* Readable size for mobile */
                line-height: 1.6 !important;
                margin-top: 30px !important;
                margin-bottom: 30px !important;
            }

            /* 3. Keep shapes but scale them down so they fit the small screen */
            :global(.shapes) {
                transform: scale(0.6); /* Make them 60% of original size */
                z-index: -1; /* Ensure they stay behind text */
            }
            
            /* Adjust individual positions if they block text (Optional) */
            :global(.shape-one) { top: 5% !important; left: -10% !important; }
            :global(.shape-two) { top: 10% !important; right: -5% !important; }
        }
      `}</style>
    </div>
  );
};

export default Feedback;