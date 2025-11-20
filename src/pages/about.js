import React from 'react';
import Link from "next/link";
import Image from "next/image";
import Header from '@/components/header/Header';
import OurMission from "@/components/about/OurMission";
import CounterSection from "@/components/home-page/Counter";
import LetsTalkButton from '@/components/LetsTalkButton';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import Faq from "@/components/home-page/Faq";

export const metadata = {
  title: "About Adaptive Intelligence | About Our Agency",
  description: "Learn about Adaptive Intelligence and why we're committed to sustainable, innovative marketing efforts.",
};

// ... getStaticProps remains exactly the same ...
export async function getStaticProps() {
  const fallbackData = { trees: 311, acres: 1.2, carbon: 328, bottles: 1674 };
  let finalStats = fallbackData;

  try {
    const sheetId = '1ICb8PWttvv0leKmfmJWXSGhXkZz5UAxChmFamV_bh1c';
    const sheetName = 'Total%20Footprint'; 
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    
    const response = await fetch(url);

    if (response.ok) {
      const csvText = await response.text();
      const rows = csvText.replace(/"/g, '').split('\n').filter(row => row.trim() !== '');

      if (rows.length >= 2) {
        let totalTrees = 0;
        let totalAcres = 0;
        let totalCarbon = 0;
        let totalBottles = 0;
        let processedRowCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const rowText = rows[i].trim();
          if (rowText === '') continue;

          const columns = rowText.split(',');
          if (columns.length >= 5 && columns[0]?.toLowerCase().trim() !== 'totals') {
            const trees = parseFloat(columns[1]?.trim().replace(/,/g, '')) || 0;
            const acres = parseFloat(columns[2]?.trim().replace(/,/g, '')) || 0;
            const carbon = parseFloat(columns[3]?.trim().replace(/,/g, '')) || 0;
            const bottles = parseFloat(columns[4]?.trim().replace(/,/g, '')) || 0;

            totalTrees += trees;
            totalAcres += acres;
            totalCarbon += carbon;
            totalBottles += bottles;
            processedRowCount++; 
          }
        }
        
        totalAcres = parseFloat(totalAcres.toFixed(1));

        if (processedRowCount > 0) {
             finalStats = { trees: totalTrees, acres: totalAcres, carbon: totalCarbon, bottles: totalBottles };
        }
      }
    }
  } catch (error) {
    console.error('Error during Google Sheet fetch/parse:', error.message);
  }

  // Fetch About Page data from Strapi
  let pageData = null;
  try {
    const pageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/about-page?populate=*`;
    const pageRes = await fetch(pageUrl);
    const pageJson = await pageRes.json();
    pageData = pageJson.data || null;
  } catch (error) {
    console.error("Error fetching about page data:", error);
  }

  return {
    props: {
      treeCardStats: finalStats,
      pageData
    },
  };
}

const About = ({ treeCardStats, pageData }) => {
  
  // --- 1. Extract Background Logic ---
  const heroType = pageData?.heroBackgroundType || 'Image';
  const heroVideoUrl = pageData?.heroBackgroundVideo?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundVideo.url}` 
    : null;
  const heroImageUrl = pageData?.heroBackgroundImage?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundImage.url}` 
    : null;

  // Determine if we have media (to toggle white text)
  const hasMedia = (heroType === 'Video' && heroVideoUrl) || heroImageUrl;

  // Fallback data for other sections
  const whoWeAreImageUrl = pageData?.whoWeAreImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whoWeAreImage.url}`
    : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      {/* --- Header: Dynamic Color based on Hero Media --- */}
      <Header menuTextColor={hasMedia ? "white" : "dark"} />

      {/* --- Hero Section: Custom Structure for Video/Centering --- */}
      <div className="about-hero-section">
        
        {/* Background Layer */}
        <div className="hero-bg-wrapper">
            {heroType === 'Video' && heroVideoUrl ? (
                <video autoPlay loop muted playsInline className="hero-bg-media">
                    <source src={heroVideoUrl} type="video/mp4" />
                </video>
            ) : heroImageUrl ? (
                <Image 
                    src={heroImageUrl}
                    alt="Hero Background"
                    fill
                    className="hero-bg-media"
                    style={{ objectFit: 'cover' }}
                    priority
                />
            ) : (
                // Fallback Gradient
                <div className="hero-bg-fallback" />
            )}
            {/* Overlay to ensure text readability */}
            <div className="hero-overlay" />
        </div>

        {/* Content Layer */}
        <div className="container position-relative z-2">
            <div className="row">
                <div className="col-xl-10 m-auto text-center">
                    <div className="title-style-fourteen" data-aos="fade-up">
                        <h2 className="main-title font-recoleta fw-normal text-white">
                            {pageData?.heroTitle || 'About Adaptive Intelligence'}
                            <span className="position-relative ms-2">
                                <Image
                                    width={302}
                                    height={9}
                                    src="/images/shape/shape_186.svg"
                                    alt="shape"
                                    style={{ filter: 'brightness(0) invert(1)' }} // Make shape white
                                />
                            </span>
                        </h2>
                        <p className="text-lg text-white text-center lh-lg mt-25 md-mt-20" data-aos="fade-up">
                            {pageData?.heroDescription || "We're in the business of growing your business. At Adaptive Intelligence, we believe creativity is the world's most valuable asset."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Counter Section */}
      <div className="wrapper mt-90 lg-mt-30">
        <div className="container">
          <CounterSection counterData={pageData?.counterItems} />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="fancy-feature-fiftyEight position-relative zn2 pt-120 md-pt-100" id="mission">
        <div className="container position-relative">
          <OurMission data={pageData} />
          <Image
            width={449}
            height={808}
            src="/images/shape/shape_187.svg"
            alt="shape"
            className="lazy-img shapes shape-one"
          />
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="fancy-feature-thirtyTwo mt-180 lg-mt-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="position-relative">
                <Image
                  width={600}
                  height={500}
                  src={whoWeAreImageUrl}
                  alt="Team collaboration"
                  className="lazy-img w-100"
                  style={{ borderRadius: '20px' }}
                />
                <div className="position-absolute" style={{ 
                  bottom: '30px', 
                  left: '30px', 
                  background: 'white', 
                  padding: '25px 30px', 
                  borderRadius: '15px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                  textAlign: 'center'
                }}>
                  <h4 className="m0 tx-dark font-recoleta" style={{ fontSize: '2rem', color: '#FF1292' }}>
                    {pageData?.whoWeAreBadgeNumber || '#1'}
                  </h4>
                  <p className="m0 fs-16 tx-dark" style={{ marginTop: '5px' }}>
                    {pageData?.whoWeAreBadgeText || 'Creative Agency'}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="ps-lg-5 mt-lg-0 mt-50">
                <div className="title-style-ten">
                  <div className="sc-title">{pageData?.whoWeAreTagline || 'WHO WE ARE'}</div>
                  <h2 className="main-title font-recoleta fw-normal tx-dark">
                    {pageData?.whoWeAreTitle || 'Creative Agency. Way of Thinking.'}
                    <span className="position-relative">
                      <Image
                        width={235}
                        height={9}
                        src="/images/shape/shape_188.svg"
                        alt="shape"
                      />
                    </span>
                  </h2>
                </div>
                <p className="text-lg tx-dark lh-lg mt-35 mb-25">
                  {pageData?.whoWeAreParagraph1}
                </p>
                <p className="text-lg tx-dark lh-lg mb-35">
                  {pageData?.whoWeAreParagraph2}
                </p>
                <p className="text-lg tx-dark lh-lg" style={{ fontWeight: '600' }}>
                  <strong>{pageData?.whoWeAreParagraph3}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Best Section */}
      <div className="fancy-feature-fiftyNine position-relative mt-140" data-aos="fade-up">
        <div className="container">
          <div className="title-style-ten text-center" data-aos="fade-up">
            <h2 className="main-title font-recoleta fw-normal tx-dark">
              {pageData?.whatWeDoTitle || 'What We Do Best'}
              <span className="position-relative">
                <Image
                  width={235} height={9}
                  src="/images/shape/shape_188.svg"
                  alt="shape"
                />
              </span>
            </h2>
          </div>
          
          <div className="card-wrapper pt-45 lg-pt-20 pb-55 lg-pb-30 mt-85 lg-mt-50">
            <div className="row justify-content-center">
              
              {/* --- Card 1 --- */}
              {pageData?.whatWeDoCard1_Title && (
                <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="0">
                  <div className="card-style-twentySix text-center mt-25">
                    <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                      <Image
                        width={45} height={45}
                        src={pageData.whatWeDoCard1_Icon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whatWeDoCard1_Icon.url}` : '/images/icon/icon_175.svg'}
                        alt={pageData.whatWeDoCard1_Title || 'Icon'} className="lazy-img"
                      />
                    </div>
                    <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard1_Title}</h5>
                    <p className="fs-18">{pageData.whatWeDoCard1_Description}</p>
                  </div>
                </div>
              )}

              {/* --- Card 2 --- */}
              {pageData?.whatWeDoCard2_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-style-twentySix text-center mt-25">
                     <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image
                          width={45} height={45}
                          src={pageData.whatWeDoCard2_Icon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whatWeDoCard2_Icon.url}` : '/images/icon/icon_175.svg'}
                          alt={pageData.whatWeDoCard2_Title || 'Icon'} className="lazy-img"
                        />
                     </div>
                     <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard2_Title}</h5>
                     <p className="fs-18">{pageData.whatWeDoCard2_Description}</p>
                    </div>
                  </div>
              )}

              {/* --- Card 3 --- */}
              {pageData?.whatWeDoCard3_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="200">
                    <div className="card-style-twentySix text-center mt-25">
                      <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image
                          width={45} height={45}
                          src={pageData.whatWeDoCard3_Icon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whatWeDoCard3_Icon.url}` : '/images/icon/icon_175.svg'}
                          alt={pageData.whatWeDoCard3_Title || 'Icon'} className="lazy-img"
                        />
                      </div>
                      <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard3_Title}</h5>
                      <p className="fs-18">{pageData.whatWeDoCard3_Description}</p>
                    </div>
                  </div>
              )}

              {/* --- Card 4 (New) --- */}
              {pageData?.whatWeDoCard4_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="300">
                    <div className="card-style-twentySix text-center mt-25">
                      <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image
                          width={45} height={45}
                          src={pageData.whatWeDoCard4_Icon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whatWeDoCard4_Icon.url}` : '/images/icon/icon_175.svg'}
                          alt={pageData.whatWeDoCard4_Title || 'Icon'} className="lazy-img"
                        />
                      </div>
                      <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard4_Title}</h5>
                      <p className="fs-18">{pageData.whatWeDoCard4_Description}</p>
                    </div>
                  </div>
              )}

              {/* --- Card 5 (New) --- */}
              {pageData?.whatWeDoCard5_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="400">
                    <div className="card-style-twentySix text-center mt-25">
                      <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image
                          width={45} height={45}
                          src={pageData.whatWeDoCard5_Icon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whatWeDoCard5_Icon.url}` : '/images/icon/icon_175.svg'}
                          alt={pageData.whatWeDoCard5_Title || 'Icon'} className="lazy-img"
                        />
                      </div>
                      <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard5_Title}</h5>
                      <p className="fs-18">{pageData.whatWeDoCard5_Description}</p>
                    </div>
                  </div>
              )}

              {/* --- Card 6 (New) --- */}
              {pageData?.whatWeDoCard6_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="500">
                    <div className="card-style-twentySix text-center mt-25">
                      <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image
                          width={45} height={45}
                          src={pageData.whatWeDoCard6_Icon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.whatWeDoCard6_Icon.url}` : '/images/icon/icon_175.svg'}
                          alt={pageData.whatWeDoCard6_Title || 'Icon'} className="lazy-img"
                        />
                      </div>
                      <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard6_Title}</h5>
                      <p className="fs-18">{pageData.whatWeDoCard6_Description}</p>
                    </div>
                  </div>
              )}

            </div>
          </div>

          <div className="row">
            <div className="col-xl-10 m-auto">
               <p className="text-lg tx-dark text-center lh-lg mt-25 md-mt-20" data-aos="fade-up">
                 {pageData?.whatWeDoDescription}
               </p>
            </div>
          </div>
        </div>
      </div>

    {/* Our Values Section */}
      <section className="values-section fancy-feature-thirtyTwo mt-140 lg-mt-120" id="vision">
        <div className="container">
         <div className="title-style-ten text-center" data-aos="fade-up">
           <div className="sc-title">{pageData?.valuesTagline || 'OUR VISION'}</div>
           <h2 className="main-title font-recoleta fw-normal tx-dark">
             {pageData?.valuesTitle || 'The Principles That Guide Us'}
             <span className="position-relative">
               <Image width={219} height={7} src="/images/shape/shape_132.svg" alt="shape"/>
             </span>
           </h2>
           {pageData?.valuesDescription && (
               <p className="text-lg tx-dark lh-lg mt-25 md-mt-20" data-aos="fade-up" data-aos-delay="100"> 
                 {pageData.valuesDescription}
               </p>
            )}
         </div>
         <div className="row gx-xxl-5 mt-60 lg-mt-40">
           {/* Value 1 */}
           {pageData?.value1_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="0">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column">
                 <div className="icon m-auto tran3s"> 
                   <Image
                     src={pageData.value1_Image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.value1_Image.url}` : '/images/icon/icon_175.svg'}
                     alt={pageData.value1_Title || 'Value icon'}
                     className="lazy-img" width={32} height={32}
                   />
                 </div>
                 <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value1_Title}</h4>
                 <p className="flex-grow-1">{pageData.value1_Description}</p>
               </div>
             </div>
           )}
           {/* Value 2 */}
           {pageData?.value2_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="100">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column">
                   <div className="icon m-auto tran3s">
                     <Image
                       src={pageData.value2_Image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.value2_Image.url}` : '/images/icon/icon_175.svg'}
                       alt={pageData.value2_Title || 'Value icon'}
                       className="lazy-img" width={32} height={32}
                     />
                   </div>
                   <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value2_Title}</h4>
                   <p className="flex-grow-1">{pageData.value2_Description}</p>
                </div>
             </div>
           )}
           {/* Value 3 */}
           {pageData?.value3_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="200">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column">
                   <div className="icon m-auto tran3s">
                     <Image
                       src={pageData.value3_Image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.value3_Image.url}` : '/images/icon/icon_175.svg'}
                       alt={pageData.value3_Title || 'Value icon'}
                       className="lazy-img" width={32} height={32}
                     />
                   </div>
                   <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value3_Title}</h4>
                   <p className="flex-grow-1">{pageData.value3_Description}</p>
                </div>
             </div>
           )}
           {/* Value 4 */}
           {pageData?.value4_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="300">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column">
                   <div className="icon m-auto tran3s">
                     <Image
                       src={pageData.value4_Image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.value4_Image.url}` : '/images/icon/icon_175.svg'}
                       alt={pageData.value4_Title || 'Value icon'}
                       className="lazy-img" width={32} height={32}
                     />
                   </div>
                   <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value4_Title}</h4>
                   <p className="flex-grow-1">{pageData.value4_Description}</p>
                </div>
             </div>
           )}
         </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="sustainability-section fancy-feature-thirtyTwo mt-140 lg-mt-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="title-style-ten">
                <div className="sc-title">{pageData?.sustainabilityTagline || 'OUR COMMITMENT'}</div>
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {pageData?.sustainabilityTitle || 'A Commitment to Sustainability.'}
                </h2>
              </div>
              <p className="text-lg tx-dark lh-lg mt-35 mb-45">
                {pageData?.sustainabilityDescription}
              </p>
              <LetsTalkButton 
                buttonText={pageData?.sustainabilityButtonText || 'Explore Our Eco Initiatives'} 
                href={pageData?.sustainabilityButtonUrl || '/eco'} 
              />
            </div>
            <div className="col-lg-6 col-md-8 ms-auto" data-aos="fade-left">
              <div className="row">
                <div className="col-6">
                  <div className="counter-block-three text-center mt-35">
                    <div className="main-count font-recoleta fw-bold tx-dark">{(treeCardStats?.trees || 311).toLocaleString()}</div>
                    <p>Trees Planted</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-block-three text-center mt-35">
                    <div className="main-count font-recoleta fw-bold tx-dark">{(treeCardStats?.acres || 1.2).toFixed(1)}</div>
                    <p>Acres Restored</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-block-three text-center mt-35">
                    <div className="main-count font-recoleta fw-bold tx-dark">{(treeCardStats?.carbon || 328).toLocaleString()}</div>
                    <p>Tons of CO2 Absorbed</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-block-three text-center mt-35">
                    <div className="main-count font-recoleta fw-bold tx-dark">{(treeCardStats?.bottles || 1674).toLocaleString()}</div>
                    <p>Bottles Removed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <div className="fancy-feature-thirtyThree mt-180 lg-mt-120">
        <div className="container">
          <div className="title-style-ten text-center" data-aos="fade-up">
            <div className="sc-title">FAQ</div>
            <h2 className="main-title font-recoleta fw-normal tx-dark">
              Questions &amp;{" "}
              <span className="position-relative">
                Answers{" "}
                <Image width={219} height={7} src="/images/shape/shape_132.svg" alt=""/>
              </span>
            </h2>
          </div>
          <div className="bg-wrapper position-relative mt-80 lg-mt-40" data-aos="fade-up">
            <Faq />
            <Image width={65} height={66} src="/images/shape/shape_133.svg" alt="shape" className="lazy-img shapes shape-one"/>
          </div>
        </div>
      </div>

     {/* Let's Talk Section */}
      <div className="fancy-short-banner-twelve position-relative zn2 pt-160 pb-150 lg-pt-120 lg-pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 m-auto text-center">
              <div className="title-style-ten" data-aos="fade-up">
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {pageData?.letsTalkTitle || "Let's Talk"}
                </h2>
              </div>
              <p className="text-lg mt-45 mb-30 lg-mb-30 lg-mt-40" data-aos="fade-up" data-aos-delay="100">
                {pageData?.letsTalkParagraph1}
              </p>
              <p className="text-lg mb-55 lg-mb-30" data-aos="fade-up" data-aos-delay="150">
                {pageData?.letsTalkParagraph2}
              </p>
              
              {/* Button Group */}
              <div 
                className="d-sm-flex align-items-center justify-content-center gap-3"
                data-aos="fade-up" 
                data-aos-delay="200"
              >
                {/* Button 1: Existing - Note: I restored 'targetPage' prop based on your snippet */}
                <LetsTalkButton 
                  buttonText={pageData?.letsTalkButtonText || "Let's Talk"} 
                  targetPage="/contact" 
                />

                {/* Button 2: New Pink Button */}
                {pageData?.letsTalkButtonText2 && (
                  <Link
                    href={pageData?.letsTalkButtonUrl2 || "/services"}
                    className="btn-pink-custom fw-500 tran3s d-inline-flex align-items-center justify-content-center"
                    style={{ minWidth: "180px" }}
                  >
                    {pageData?.letsTalkButtonText2}
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
        <div className="shapes shape-one" />

        {/* Forced Styles using standard CSS tag to ensure application */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Force padding on the existing button class */
          .btn-twentyOne {
            padding-top: 0.9rem !important;
            padding-bottom: 0.9rem !important;
          }
          /* Styling for the new Pink Button */
          .btn-pink-custom {
            background-color: #FF1292;
            border: 2px solid #FF1292;
            color: white !important;
            padding-top: 0.9rem !important;
            padding-bottom: 0.9rem !important;
          }
          /* Hover effect for Pink Button */
          .btn-pink-custom:hover {
            background-color: transparent !important;
            color: #FF1292 !important;
          }
        `}} />
      </div>

      <FooterWithSettings />

      <style jsx>{`
        /* White Header Fix */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        /* --- HERO STYLES --- */
        .about-hero-section { 
            position: relative; 
            overflow: hidden; 
            height: 80vh; 
            min-height: 600px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white; 
            text-align: center; 
        }
        .hero-bg-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .hero-bg-fallback { width: 100%; height: 100%; background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); position: absolute; top: 0; left: 0; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1; }
        .z-2 { z-index: 2; }


        /* --- VALUES SECTION --- */
        .values-section .card-style-fifteen {
            background: #F8F9FA;
            border-radius: 20px;
            padding: 35px;
            border: 1px solid #E5E5E5;
            transition: all 0.3s ease;
        }
        .values-section .card-style-fifteen:hover {
            border-color: #FF1292;
            box-shadow: 0 10px 30px rgba(0,0,0,0.07);
        }
        .values-section .icon {
            width: 60px; 
            height: 60px; 
            border-radius: 50%;
            display: flex; 
            justify-content: center;
            align-items: center;
            background: #FF1292;
            transition: background 0.3s ease;
        }
        .values-section .icon img {
            filter: brightness(0) invert(1);
            transition: filter 0.3s ease;
        }
        .values-section .card-style-fifteen:hover .icon {
            background: #FF1292; 
        }
        .values-section .card-style-fifteen:hover .icon img {
            filter: brightness(0) invert(1);
        }

        .sustainability-section .counter-block-three .main-count {
            font-size: 3rem;
            color: #FF1292;
        }
        .sustainability-section .counter-block-three p {
            font-size: 1.1rem;
            color: #151937;
        }
        .btn-twentyOne,
          .cta-btn-two {
            padding-top: 0.9rem !important;
            padding-bottom: 0.9rem !important;
          }
          .cta-btn-two {
            background-color: #FF1292;
            border: 2px solid #FF1292;
          }
          .cta-btn-two:hover {
            background-color: transparent;
            color: #FF1292 !important;
          }
      `}</style>
    </>
  )
};

export default About;