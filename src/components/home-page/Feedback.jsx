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
                  <h6 className="fw-normal fs-20 d-inline-block fst-italic position-relative ps-4">
                    {authorName}, {authorTitle}
                  </h6>
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