import LetsTalkButton from "@/components/LetsTalkButton";

const HeroContent = ({ heroData }) => {
  return (
    <>
      <h1 className="hero-heading fw-normal text-white font-recoleta" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px', padding: '40px 20px', userSelect: 'none' }}>
        {heroData?.heroTitle || "Adaptive Intelligence"}{" "}
        <span className="position-relative curved-underline-span">
          {heroData?.heroHighlightedText || "Fueling Creative Innovation™"}
        </span>
      </h1>
      
      <p className="sub-text mt-20 mb-45 lg-mb-30" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px', padding: '40px 20px', userSelect: 'none' }}>
        {heroData?.heroSubtitleStart || ""}
        <b className="text-white"> {heroData?.heroSubtitleBold || ""} </b>
        {heroData?.heroSubtitleEnd || "through innovative strategies and crafting key messages that resonate clearly with a universal audience."}
      </p>
      
      <LetsTalkButton buttonText={heroData?.heroButtonText || "Start a project"} href="/contact" />
    </>
  );
};

export default HeroContent;