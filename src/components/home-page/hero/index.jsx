// src/components/home-page/hero.js
import React from 'react'; // Added React import
import { Suspense } from "react";
import HeroContent from "./HeroContent";
import Partners from "./Partners";
import Image from "next/image";

// --- Animation Styles ---
const backgroundAnimations = `
  @keyframes slowZoom {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes floatMove {
    0% { transform: translateY(0px) translateX(0px); }
    33% { transform: translateY(-10px) translateX(5px); }
    66% { transform: translateY(5px) translateX(-3px); }
    100% { transform: translateY(0px) translateX(0px); }
  }
  @keyframes subtleRotate {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(0.5deg) scale(1.02); }
    50% { transform: rotate(0deg) scale(1.05); }
    75% { transform: rotate(-0.5deg) scale(1.02); }
    100% { transform: rotate(0deg) scale(1); }
  }
  @keyframes parallaxMove {
    0% { transform: translateX(0%) translateY(0%); }
    25% { transform: translateX(-1%) translateY(-0.5%); }
    50% { transform: translateX(0%) translateY(-1%); }
    75% { transform: translateX(1%) translateY(-0.5%); }
    100% { transform: translateX(0%) translateY(0%); }
  }
  @keyframes orbitalFloat {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
    100% { transform: translateY(0px) rotate(360deg); }
  }
  @keyframes pulseScale {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
  }
  @keyframes gentleFloat {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  @keyframes slideUpDown {
    0% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-8px) translateX(3px); }
    50% { transform: translateY(0px) translateX(0px); }
    75% { transform: translateY(8px) translateX(-3px); }
    100% { transform: translateY(0px) translateX(0px); }
  }
  @keyframes rotateFloat {
    0% { transform: rotate(0deg) translateY(0px); }
    33% { transform: rotate(120deg) translateY(-10px); }
    66% { transform: rotate(240deg) translateY(5px); }
    100% { transform: rotate(360deg) translateY(0px); }
  }
  @keyframes bounceFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    25% { transform: translateY(-12px) scale(1.05); }
    50% { transform: translateY(-6px) scale(1.02); }
    75% { transform: translateY(-18px) scale(1.08); }
  }
  @keyframes slowSpin360 {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slowSpinWithFloat {
    0% { transform: rotate(0deg) translateY(0px); }
    25% { transform: rotate(90deg) translateY(-5px); }
    50% { transform: rotate(180deg) translateY(0px); }
    75% { transform: rotate(270deg) translateY(-5px); }
    100% { transform: rotate(360deg) translateY(0px); }
  }
  @keyframes reverseSpin360 {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @keyframes slowSpinWithPulse {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(90deg) scale(1.02); }
    50% { transform: rotate(180deg) scale(1.05); }
    75% { transform: rotate(270deg) scale(1.02); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes waveFloat {
    0% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-8px) translateX(4px); }
    50% { transform: translateY(-4px) translateX(8px); }
    75% { transform: translateY(-12px) translateX(4px); }
    100% { transform: translateY(0px) translateX(0px); }
  }
  @keyframes oceanWave {
    0% { transform: translateY(0px) scaleY(1); }
    50% { transform: translateY(-6px) scaleY(1.02); }
    100% { transform: translateY(0px) scaleY(1); }
  }
  @keyframes elasticPulse {
    0% { transform: scale(1); }
    30% { transform: scale(1.15); }
    60% { transform: scale(0.95); }
    80% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes rubberBand {
    0% { transform: scale(1); }
    30% { transform: scaleX(1.25) scaleY(0.75); }
    40% { transform: scaleX(0.75) scaleY(1.25); }
    50% { transform: scaleX(1.15) scaleY(0.85); }
    65% { transform: scaleX(0.95) scaleY(1.05); }
    75% { transform: scaleX(1.05) scaleY(0.95); }
    100% { transform: scale(1); }
  }
  @keyframes pendulumSwing {
    0% { transform: rotate(-15deg); }
    50% { transform: rotate(15deg); }
    100% { transform: rotate(-15deg); }
  }
  @keyframes gentleSwing {
    0%, 100% { transform: rotate(0deg) translateX(0px); }
    25% { transform: rotate(3deg) translateX(2px); }
    75% { transform: rotate(-3deg) translateX(-2px); }
  }
  @keyframes spiralIn {
    0% { transform: rotate(0deg) scale(1) translateX(0px); }
    50% { transform: rotate(180deg) scale(1.1) translateX(10px); }
    100% { transform: rotate(360deg) scale(1) translateX(0px); }
  }
  @keyframes figure8 {
    0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    25% { transform: translateX(8px) translateY(-4px) rotate(90deg); }
    50% { transform: translateX(0px) translateY(0px) rotate(180deg); }
    75% { transform: translateX(-8px) translateY(4px) rotate(270deg); }
    100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.08); opacity: 1; }
  }
  @keyframes organicFloat {
    0% { transform: translateY(0px) rotate(0deg) scale(1); }
    33% { transform: translateY(-8px) rotate(2deg) scale(1.02); }
    66% { transform: translateY(4px) rotate(-1deg) scale(0.98); }
    100% { transform: translateY(0px) rotate(0deg) scale(1); }
  }
  @keyframes wobble {
    0% { transform: translateX(0%) rotate(0deg); }
    15% { transform: translateX(-25%) rotate(-5deg); }
    30% { transform: translateX(20%) rotate(3deg); }
    45% { transform: translateX(-15%) rotate(-3deg); }
    60% { transform: translateX(10%) rotate(2deg); }
    75% { transform: translateX(-5%) rotate(-1deg); }
    100% { transform: translateX(0%) rotate(0deg); }
  }
  @keyframes jiggle {
    0%, 100% { transform: rotate(0deg); }
    10%, 30%, 50%, 70%, 90% { transform: rotate(-1deg); }
    20%, 40%, 60%, 80% { transform: rotate(1deg); }
  }
  @keyframes floatAndSpin {
    0% { transform: translateY(0px) rotate(0deg) scale(1); }
    25% { transform: translateY(-12px) rotate(90deg) scale(1.05); }
    50% { transform: translateY(-6px) rotate(180deg) scale(1.02); }
    75% { transform: translateY(-18px) rotate(270deg) scale(1.08); }
    100% { transform: translateY(0px) rotate(360deg) scale(1); }
  }
  @keyframes pulseSpin {
    0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
    50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
    100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
  }
`;

// --- AnimatedShape Component ---
const AnimatedShape = ({ 
  src, 
  alt, 
  // Desktop positioning and sizing (1450px+)
  width, 
  height, 
  top, 
  left, 
  // Large Screen positioning and sizing (1200px - 1449px)
  largeWidth,
  largeHeight,
  largeTop,
  largeLeft,
  // Laptop positioning and sizing (992px - 1199px)
  laptopWidth,
  laptopHeight,
  laptopTop,
  laptopLeft,
  // Tablet positioning and sizing (768px - 991px)
  tabletWidth,
  tabletHeight,
  tabletTop,
  tabletLeft,
  // Mobile positioning and sizing (0px - 767px)
  mobileWidth,
  mobileHeight,
  mobileTop,
  mobileLeft,
  // Animation props
  animation = "floatMove", 
  duration = "12s", 
  delay = "0s", 
  opacity = 0.8,
  zIndex = 1,
  // Responsive visibility controls
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnLaptop = false,
  hideOnLarge = false,
  hideOnDesktop = false
}) => {

  const getResponsiveStyles = (deviceWidth, deviceHeight, deviceTop, deviceLeft) => {
    const baseStyle = {
      position: 'absolute',
      top: deviceTop !== undefined ? `${deviceTop}%` : `${top}%`,
      left: deviceLeft !== undefined ? `${deviceLeft}%` : `${left}%`,
      width: deviceWidth ? `${deviceWidth}px` : (width ? `${width}px` : 'auto'),
      height: deviceHeight ? `${deviceHeight}px` : (height ? `${height}px` : 'auto'),
      animation: animation ? `${animation} ${duration} ease-in-out infinite` : 'none',
      animationDelay: delay,
      opacity: opacity,
      pointerEvents: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      WebkitUserDrag: 'none',
      KhtmlUserDrag: 'none',
      MozUserDrag: 'none',
      OUserDrag: 'none',
      userDrag: 'none',
      zIndex: zIndex,
    };
    return baseStyle;
  };

  return (
    <>
      {/* Desktop version (1450px+) */}
      <img
        src={src}
        alt={alt}
        className={`d-none d-xxl-block${hideOnDesktop ? ' d-xxl-none' : ''}`}
        style={getResponsiveStyles()}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      />
      
      {/* Large Screen version (1200px - 1449px) */}
      <img
        src={src}
        alt={alt}
        className={`d-none d-xl-block d-xxl-none${hideOnLarge ? ' d-xl-none' : ''}`}
        style={getResponsiveStyles(
          largeWidth || (width ? width * 0.9 : undefined),
          largeHeight || (height ? height * 0.9 : undefined),
          largeTop,
          largeLeft
        )}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      />
      
      {/* Laptop version (992px - 1199px) */}
      <img
        src={src}
        alt={alt}
        className={`d-none d-lg-block d-xl-none${hideOnLaptop ? ' d-lg-none' : ''}`}
        style={getResponsiveStyles(
          laptopWidth || (width ? width * 0.75 : undefined),
          laptopHeight || (height ? height * 0.75 : undefined),
          laptopTop,
          laptopLeft
        )}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      />
      
      {/* Tablet version (768px - 991px) */}
      <img
        src={src}
        alt={alt}
        className={`d-none d-md-block d-lg-none${hideOnTablet ? ' d-md-none' : ''}`}
        style={getResponsiveStyles(
          tabletWidth || (width ? width * 0.6 : undefined),
          tabletHeight || (height ? height * 0.6 : undefined),
          tabletTop,
          tabletLeft
        )}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      />
      
      {/* Mobile version (0px - 767px) */}
      <img
        src={src}
        alt={alt}
        className={`d-block d-md-none${hideOnMobile ? ' d-none' : ''}`}
        style={getResponsiveStyles(
          mobileWidth || (width ? width * 0.4 : undefined),
          mobileHeight || (height ? height * 0.4 : undefined),
          mobileTop,
          mobileLeft
        )}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      />
    </>
  );
};


// --- HomePageContent Component ---
const HomePageContent = ({ heroData }) => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-6" data-aos="fade-left">
            <HeroContent heroData={heroData} />
          </div>
        </div>
      </div>
      <div className="partner-section-five position-relative mt-130 lg-mt-100">
        <div className="wrapper m-auto">
          <Partners />
        </div>
      </div>
    </>
  );
};


// --- Main Hero Component ---
const Hero = ({ isHomePage = false, children, heroData }) => {

  // --- Background Logic ---
  const backgroundType = heroData?.heroBackgroundType || 'Shapes';
  const bgImage = heroData?.heroBackgroundImage;
  const bgVideo = heroData?.heroBackgroundVideo;

  // Determine Image/Video URLs (Using simple .url for Strapi v5)
  const bgImageUrl = bgImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${bgImage.url}`
    : null;

  const bgVideoUrl = bgVideo?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${bgVideo.url}`
    : null;

  // --- ADDED CONSOLE LOGS FOR DEBUGGING ---
  console.log("Hero Component - isHomePage:", isHomePage);
  console.log("Hero Component - Received heroData:", heroData);
  console.log("Hero Component - Determined backgroundType:", backgroundType);
  console.log("Hero Component - Determined bgImageUrl:", bgImageUrl);
  console.log("Hero Component - Determined bgVideoUrl:", bgVideoUrl);
  // --- End Background Logic ---

  return (
    <>
      {/* Inject animation keyframes */}
      <style jsx>{backgroundAnimations}</style>

      <div
        className="hero-banner-nine position-relative zn2 pt-225 md-pt-150"
        style={{
          height: isHomePage ? "auto" : "80vh", // Eco-style height
          minHeight: '600px', // Min height
          backgroundColor: "white", // Fallback
          overflow: 'hidden', // Contain elements
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', 
          alignItems: 'center', // Vertically center content
          paddingBottom: isHomePage ? '100px' : '0' // Padding only for homepage
        }}
      >
        {/* --- Background Layer (Renders first, zIndex -1) --- */}
        {/* Option 1: Animated Shapes */}
        {backgroundType === 'Shapes' && (
          <div
            className="shapes-background-wrapper"
            style={{
              position: "absolute", inset: 0, zIndex: -1,
              pointerEvents: "none", userSelect: "none", WebkitUserSelect: "none",
              MozUserSelect: "none", msUserSelect: "none", WebkitUserDrag: "none",
              KhtmlUserDrag: "none", MozUserDrag: "none", OUserDrag: "none", userDrag: "none",
            }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onSelectStart={(e) => e.preventDefault()}
          >
            {/* --- Place ALL your <AnimatedShape> components here --- */}
            <AnimatedShape src="/images/ChromeShapes/shape-1-left.png" alt="Shape 1 Left" width={700} height={700} top={-10} left={-25} laptopWidth={600} laptopHeight={600} laptopTop={-8} laptopLeft={-30} tabletWidth={500} tabletHeight={500} tabletTop={-10} tabletLeft={-35} mobileWidth={0} mobileHeight={0} mobileTop={0} mobileLeft={-10} animation="floatMove" duration="30s" delay="0s" opacity={1} zIndex={5} hideOnMobile={true} />
            <AnimatedShape src="/images/ChromeShapes/shape-half-cirlce.png" alt="Shape Half Circle" width={329} height={531} top={-4} left={15} laptopWidth={265} laptopHeight={426} laptopTop={-2} laptopLeft={25} tabletWidth={200} tabletHeight={326} tabletTop={0} tabletLeft={20} mobileWidth={150} mobileHeight={245} mobileTop={5} mobileLeft={25} animation="" duration="30s" delay="0s" opacity={1} zIndex={2} hideOnMobile={true} />
            <AnimatedShape src="/images/ChromeShapes/shape-ring.png" alt="Shape Ring" width={390} height={500} top={60} left={10} laptopWidth={250} laptopHeight={350} laptopTop={50} laptopLeft={12} tabletWidth={250} tabletHeight={350} tabletTop={55} tabletLeft={10} mobileWidth={250} mobileHeight={350} mobileTop={-25} mobileLeft={25} animation="reverseSpin360" duration="45s" delay="4s" opacity={1} zIndex={2} hideOnMobile={false} />
            <AnimatedShape src="/images/ChromeShapes/shape-cylinder.png" alt="Shape Cylinder" width={232} height={237} top={35} left={33} laptopWidth={232} laptopHeight={237} laptopTop={32} laptopLeft={40} tabletWidth={232} tabletHeight={237} tabletTop={30} tabletLeft={40} mobileWidth={232} mobileHeight={237} mobileTop={20} mobileLeft={5} duration="25s" delay="1s" animation="slowSpinWithFloat" opacity={1} zIndex={5} hideOnMobile={false} />
            <AnimatedShape src="/images/ChromeShapes/Shape_Macaroni2.png" alt="Shape Macaroni 2" width={446} height={264} top={30} left={50} laptopWidth={300} laptopHeight={200} laptopTop={32} laptopLeft={62} tabletWidth={300} tabletHeight={200} tabletTop={55} tabletLeft={48} mobileWidth={180} mobileHeight={106} mobileTop={40} mobileLeft={45} duration="25s" delay="1s" animation="subtleRotate" opacity={1} zIndex={5} hideOnMobile={true} />
            <AnimatedShape src="/images/ChromeShapes/Shape_FatCylinder2.png" alt="Shape Fat Cylinder" width={573} height={447} top={60} left={40} laptopWidth={400} laptopHeight={347} laptopTop={55} laptopLeft={52} tabletWidth={300} tabletHeight={247} tabletTop={65} tabletLeft={58} mobileWidth={573} mobileHeight={447} mobileTop={50} mobileLeft={20} duration="8s" animation="subtleRotate" delay="6s" opacity={1} zIndex={2} hideOnMobile={false} />
            <AnimatedShape src="/images/ChromeShapes/Shape_Macaroni1.png" alt="Shape Macaroni 1" width={424} height={298} top={-8} left={65} laptopWidth={324} laptopHeight={228} laptopTop={-2} laptopLeft={72} tabletWidth={324} tabletHeight={228} tabletTop={-3} tabletLeft={68} mobileWidth={170} mobileHeight={119} mobileTop={25} mobileLeft={60} animation="waveFloat" duration="40s" delay="2s" opacity={1} zIndex={6} hideOnMobile={true} />
            <AnimatedShape src="/images/ChromeShapes/Shape_Ring4.png" alt="Shape Ring 4" width={285} height={330} top={45} left={80} laptopWidth={285} laptopHeight={330} laptopTop={47} laptopLeft={83} tabletWidth={200} tabletHeight={270} tabletTop={30} tabletLeft={80} mobileWidth={200} mobileHeight={270} mobileTop={20} mobileLeft={70} animation="slowSpinWithFloat" duration="35s" delay="5s" opacity={1} zIndex={1} hideOnMobile={false} />
          </div>
        )}

        {/* Option 2: Background Image */}
        {backgroundType === 'Image' && bgImageUrl && (
          <div className="media-background-wrapper" style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
            <Image
              src={bgImageUrl}
              alt="Hero Background"
              layout="fill"
              objectFit="cover"
              quality={85}
              priority
              onError={(e) => console.error(`Image load error: ${bgImageUrl}`, e.target.src)}
            />
            {/* Optional Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} /> {/* Adjusted overlay darkness */}
          </div>
        )}

        {/* Option 3: Background Video */}
        {backgroundType === 'Video' && bgVideoUrl && (
          <div className="media-background-wrapper" style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
            <video
              key={bgVideoUrl} // Force re-render if URL changes
              autoPlay
              loop
              muted
              playsInline // Important for mobile
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => console.error(`Video load error: ${bgVideoUrl}`, e.target.error)}
            >
              <source src={bgVideoUrl} type={heroData?.heroBackgroundVideo?.mime || 'video/mp4'} />
              Your browser does not support the video tag.
            </video>
            {/* Optional Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} /> {/* Adjusted overlay darkness */}
          </div>
        )}
        {/* --- End Background Rendering --- */}


        {/* --- Content Layer (On Top) --- */}
        <div style={{ zIndex: 1, width: '100%' }}>
          {isHomePage ? (
            // Homepage gets its specific layout
            <HomePageContent heroData={heroData} />
          ) : (
            // --- NEW CONDITIONAL LAYOUT FOR OTHER PAGES ---
            (backgroundType === 'Image' || backgroundType === 'Video') ? (
              // "ECO-STYLE" LAYOUT (for Image/Video)
              <div className="container">
                <div className="row">
                  <div className="col-lg-9 mx-auto text-center" data-aos="fade-up">
                    {/* Children are rendered directly, centered */}
                    {children}
                  </div>
                </div>
              </div>
            ) : (
              // "ORIGINAL" LAYOUT (for Shapes)
              <div className="container">
                <div className="row">
                  <div
                    className="col-lg-12 col-md-12"
                    data-aos="fade-left"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)", // Original dark box
                      borderRadius: "10px",
                      padding: "10px",
                      userSelect: "none",
                    }}
                  >
                    {children}
                  </div>
                </div>
              </div>
            )
            // --- END CONDITIONAL LAYOUT ---
          )}
        </div>
        {/* --- End Content Layer --- */}

      </div>
    </>
  );
};

export default Hero;