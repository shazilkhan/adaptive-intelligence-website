import LetsTalkButton from "@/components/LetsTalkButton";

const HeroContent = ({ heroData }) => {
  return (
    <>
      <h1 className="hero-heading fw-normal text-white font-recoleta text-backdrop">
        {heroData?.heroTitle || "Adaptive Intelligence"}{" "}
        <span className="position-relative curved-underline-span">
          {heroData?.heroHighlightedText || "Fueling Creative Innovation™"}
        </span>
      </h1>

      <p className="sub-text mt-20 mb-45 lg-mb-30 text-backdrop">
        {heroData?.heroSubtitleStart || ""}
        <b className="text-white"> {heroData?.heroSubtitleBold || ""} </b>
        {heroData?.heroSubtitleEnd || "through innovative strategies and crafting key messages that resonate clearly with a universal audience."}
      </p>

      <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
        {/* Button 1: Start Project (Typeform) */}
        <LetsTalkButton
          buttonText={heroData?.heroButtonText || "Start Project"}
          href={heroData?.heroButtonUrl || "https://smlof6a6801.typeform.com/to/dwEeKVkb"}
          size="large"
          className="custom-button hero-cta-btn"
        />

        {/* Button 2: Apply Now (Creatives) - Only shows if text is provided or defaults are desired */}
        {/* Button 2: Apply Now (Creatives) - Uses new "pink" variant for inverted styling */}
        <LetsTalkButton
          buttonText={heroData?.heroButtonText2 || "Apply Now"}
          href={heroData?.heroButtonUrl2 || "/creatives"}
          size="large"
          variant="pink"
          className="custom-button hero-cta-btn"
        />
      </div>

      <style jsx>{`
        /* Shared style for the dark background boxes */
        .text-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          padding: 40px 20px;
          user-select: none;
        }

        /* Ensure both buttons have the exact same width */
        :global(.hero-cta-btn) {
          min-width: 200px;
          justify-content: center;
        }

        .sub-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 24px;
          line-height: 1.6;
        }

        /* --- MOBILE OPTIMIZATION (Below 768px) --- */
        @media (max-width: 767px) {
          .hero-heading {
            font-size: 55px !important; /* Drastically smaller for mobile */
            line-height: 1.25 !important;
          }

          .sub-text {
            font-size: 22px !important; /* Readable reading size */
            line-height: 1.5 !important;
            margin-bottom: 30px !important;
          }

          .text-backdrop {
            padding: 20px 15px !important; /* Less padding on mobile so it fits */
          }
        }

        /* --- TABLET/LAPTOP OPTIMIZATION (768px to 1199px) --- */
        @media (min-width: 768px) and (max-width: 1199px) {
          .hero-heading {
            font-size: 65px !important; /* Medium size for tablets */
          }
          
          .sub-text {
            font-size: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default HeroContent;