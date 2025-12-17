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

      <div className="letstalk-btnn d-flex justify-content-center"> <LetsTalkButton buttonText={heroData?.heroButtonText || "Start a project"} href="/contact" size="large" /> </div>

      <style jsx>{`
        /* Shared style for the dark background boxes */
        .text-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          padding: 40px 20px;
          user-select: none;
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