import React from 'react';
import Link from "next/link";
import Image from "next/image";
import Header from '@/components/header/Header';
import OurMission from "@/components/about/OurMission";
import CounterSection from "@/components/home-page/Counter";
import LetsTalkButton from '@/components/LetsTalkButton';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import Faq from "@/components/home-page/Faq";
import AdaptiveIntelligence from '@/components/AdaptiveIntelligence';
import OurValues from '@/components/OurValues';
import { useState, useEffect } from 'react';
import { getStrapiApiUrl, getStrapiMediaUrl } from '@/utils/strapi';

import SEO from '@/components/SEO';

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

  let pageData = null;
  try {
    const { getStrapiApiUrl } = await import('@/utils/strapi');
    const pageUrl = `${getStrapiApiUrl()}/api/about-page?populate=*`;
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

  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const API_URL = getStrapiApiUrl();
        const res = await fetch(`${API_URL}/api/values?populate=*&sort=order:asc`);
        const json = await res.json();

        // Safety check: Ensure json.data exists and is an array
        if (json && Array.isArray(json.data)) {
          setValues(json.data);
        } else {
          console.warn("Strapi returned unexpected Values format:", json);
        }
      } catch (error) {
        console.error("Failed to fetch values:", error);
      }
    };
    fetchValues();
  }, []);

  const heroType = pageData?.heroBackgroundType || 'Image';
  const heroVideoUrl = pageData?.heroBackgroundVideo?.url
    ? getStrapiMediaUrl(pageData.heroBackgroundVideo?.url)
    : null;
  const heroImageUrl = pageData?.heroBackgroundImage?.url
    ? getStrapiMediaUrl(pageData.heroBackgroundImage?.url)
    : null;

  const hasMedia = (heroType === 'Video' && heroVideoUrl) || heroImageUrl;

  const whoWeAreImageUrl = pageData?.whoWeAreImage?.url
    ? getStrapiMediaUrl(pageData.whoWeAreImage?.url)
    : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <SEO
        pageTitle={pageData?.pageTitle || "About"}
        metaDescription={pageData?.metaDescription || "Learn about Adaptive Intelligence and why we're committed to sustainable, innovative marketing efforts."}
        ogImage={pageData?.pagePreviewImage}
      />
      <Header menuTextColor={hasMedia ? "white" : "dark"} />

      {/* --- Hero Section --- */}
      <div className="about-hero-section">

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
            <div className="hero-bg-fallback" />
          )}
          <div className="hero-overlay" />
        </div>

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
                      style={{ filter: 'brightness(0) invert(1)' }}
                      className="hero-shape"
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

      {/* Counter Section 
      <div className="wrapper mt-90 lg-mt-30 md-mt-40">
        <div className="container">
          <CounterSection counterData={pageData?.counterItems} />
        </div>
      </div>
  
      {/* Our Mission Section 
      {/* Added md-pt-80 for mobile spacing 
      <div className="fancy-feature-fiftyEight position-relative zn2 pt-120 lg-pt-100 md-pt-80" id="mission">
        <div className="container position-relative">
          <OurMission data={pageData} />
        </div>
      </div>

      {/* Who We Are Section 
      {/* Added md-mt-80 *
      <section className="fancy-feature-thirtyTwo mt-180 lg-mt-120 md-mt-80">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-50 lg-mb-0" data-aos="fade-right">
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
              <div className="ps-lg-5">
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
                        className="shape-svg"
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
      */}

      {/* --- Who We Are Section (Redesigned) --- */}
      <div className="who-we-are-section position-relative pt-180 pb-180 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80" style={{ background: 'white' }}>
        <div className="container">
          <div className="row align-items-center">

            {/* 1. TEXT COLUMN (Left) */}
            <div className="col-lg-6 order-lg-1 mb-50 lg-mb-0" data-aos="fade-right">
              <div className="text-content-wrapper pe-xxl-5 me-xxl-4">

                {/* Pink Tagline */}
                <div className="text-uppercase fw-bold mb-20" style={{ color: '#FF1292', letterSpacing: '1px', fontSize: '13px' }}>
                  {pageData?.whoWeAreTagline || 'INNOVATIVE AND SUSTAINABLE'}
                </div>

                {/* Title */}
                <h2 className="main-title font-recoleta fw-normal tx-dark mb-40 lg-mb-30">
                  {pageData?.whoWeAreTitle || 'Who We Are'}
                </h2>

                {/* Paragraphs */}
                <p className="text-lg tx-dark lh-lg mb-30" style={{ opacity: 0.9 }}>
                  {pageData?.whoWeAreParagraph1}
                </p>
                <p className="text-lg tx-dark lh-lg mb-40 lg-mb-30" style={{ opacity: 0.9 }}>
                  {pageData?.whoWeAreParagraph2}
                </p>
                <p className="text-lg tx-dark lh-lg mb-40 lg-mb-30" style={{ opacity: 0.9 }}>
                  {pageData?.whoWeAreParagraph3}
                </p>

                {/* Reusable Component Button */}
                <div className="mt-40 lg-mt-30 d-flex justify-content-center">
                  <LetsTalkButton
                    text="View Our Services"
                    href="/services"
                  />
                </div>

              </div>
            </div>

            {/* 2. IMAGE COLUMN (Right) */}
            <div className="col-lg-6 order-lg-2" data-aos="fade-left">
              <div className="image-wrapper position-relative ms-lg-5">
                {/* Ensure whoWeAreImageUrl is defined before rendering */}
                {whoWeAreImageUrl && (
                  <Image
                    width={800}
                    height={900}
                    src={whoWeAreImageUrl}
                    alt={pageData?.whoWeAreTitle || "Who We Are"}
                    className="w-100 h-auto"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* --- Adaptive Intelligence Section (Aligned) --- */}
      {/* ============================================== */}
      {(() => {
        const title = pageData?.adaptiveIntelligenceTitle || "Ad·ap·tive In·tel·li·gence";
        const features = pageData?.adaptiveIntelligenceFeatures || [];

        const rawVideo = pageData?.adaptiveIntelligenceBgVideo?.data?.attributes?.url || pageData?.adaptiveIntelligenceBgVideo?.url;
        const videoUrl = getStrapiMediaUrl(rawVideo);

        const rawImage = pageData?.adaptiveIntelligenceBgImage?.data?.attributes?.url || pageData?.adaptiveIntelligenceBgImage?.url;
        const imageUrl = getStrapiMediaUrl(rawImage);

        return (
          <div className="adaptive-section">

            {/* Background Layer */}
            <div className="bg-layer">
              {videoUrl ? (
                <video autoPlay muted loop playsInline className="bg-media">
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Background"
                  fill
                  className="bg-media"
                  priority
                />
              ) : (
                // Fallback if nothing uploaded
                <div className="bg-media" style={{ background: '#121212' }}></div>
              )}

              <div className="bg-overlay"></div>
            </div>

            {/* Content Box */}
            <div className="content-box" data-aos="fade-up">
              <h2 className="section-title font-recoleta text-white">
                {title}
              </h2>

              {features.length > 0 && (
                <ol className="custom-numbered-list text-white">
                  {features.map((item, index) => (
                    <li key={index}>
                      {item.text || item.attributes?.text}
                    </li>
                  ))}
                </ol>
              )}
            </div>

          </div>
        );
      })()}

      {/* What We Do Best Section
      {/* Added md-mt-80 *
      <div className="fancy-feature-fiftyNine position-relative mt-140 lg-mt-100 md-mt-80" data-aos="fade-up">
        <div className="container">
          <div className="title-style-ten text-center" data-aos="fade-up">
            <h2 className="main-title font-recoleta fw-normal tx-dark">
              {pageData?.whatWeDoTitle || 'What We Do Best'}
              <span className="position-relative">
                <Image
                  width={235} height={9}
                  src="/images/shape/shape_188.svg"
                  alt="shape"
                  className="shape-svg"
                />
              </span>
            </h2>
          </div>
          
          <div className="card-wrapper pt-45 lg-pt-20 pb-55 lg-pb-30 mt-85 lg-mt-50 md-mt-40">
            <div className="row justify-content-center g-4">
              {/* Cards Rendering Logic - Kept same logic but added 'g-4' to row for spacing 
              {pageData?.whatWeDoCard1_Title && (
                <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="0">
                  <div className="card-style-twentySix text-center h-100">
                    <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                      <Image
                        width={45} height={45}
                        src={getStrapiMediaUrl(pageData.whatWeDoCard1_Icon?.url) || '/images/icon/icon_175.svg'}
                        alt={pageData.whatWeDoCard1_Title || 'Icon'} className="lazy-img"
                      />
                    </div>
                    <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard1_Title}</h5>
                    <p className="fs-18">{pageData.whatWeDoCard1_Description}</p>
                  </div>
                </div>
              )}
              {/* ... (Repeat for other cards, keeping structure same but ensuring columns have spacing) ... */}
      {/* Simplified for brevity, assume cards 2-6 follow same pattern *
               {pageData?.whatWeDoCard2_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-style-twentySix text-center h-100">
                      <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image width={45} height={45} src={getStrapiMediaUrl(pageData.whatWeDoCard2_Icon?.url) || '/images/icon/icon_175.svg'} alt="Icon" className="lazy-img" />
                      </div>
                      <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard2_Title}</h5>
                      <p className="fs-18">{pageData.whatWeDoCard2_Description}</p>
                    </div>
                  </div>
              )}
               {pageData?.whatWeDoCard3_Title && (
                  <div className="col-lg-4 col-sm-6" data-aos="fade-up" data-aos-delay="200">
                    <div className="card-style-twentySix text-center h-100">
                      <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                        <Image width={45} height={45} src={getStrapiMediaUrl(pageData.whatWeDoCard3_Icon?.url) || '/images/icon/icon_175.svg'} alt="Icon" className="lazy-img" />
                      </div>
                      <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{pageData.whatWeDoCard3_Title}</h5>
                      <p className="fs-18">{pageData.whatWeDoCard3_Description}</p>
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
      </div> */}

      {/* ============================================== */}
      {/* --- Our Values & Mission Section (Final) --- */}
      {/* ============================================== */}
      <div className="our-values-section position-relative pt-120 pb-120 md-pt-80 md-pb-80">
        <div className="container">

          {/* 1. MISSION SECTION (Top) */}
          <div className="row justify-content-center mb-80 lg-mb-60">
            <div className="col-lg-8 text-center" data-aos="fade-up">

              {/* Mission Label */}
              {/* Mission Label */}
              <div className="mission-heading fw-normal text-white display-4 mb-20 font-recoleta" style={{ borderBottom: '2px solid #FF1292', display: 'inline-block', paddingBottom: '5px' }}>
                {pageData?.valuesSectionMissionHeading || "Our Mission"}
              </div>

              {/* Mission Text */}
              <h3 className="text-white fw-normal lh-base mt-20 mb-0" style={{ fontSize: '24px', opacity: 0.95 }}>
                {pageData?.valuesSectionDescription || "We're expanding into new markets, developing proprietary creative technology, and committing to measurable environmental action."}
              </h3>

            </div>
          </div>

          {/* 2. VALUES INTRO (Middle) */}
          <div className="row justify-content-center mb-50">
            <div className="col-lg-8 text-center" data-aos="fade-up">

              {/* Values Main Title */}
              <h2 className="font-recoleta fw-normal text-white display-4 mb-20">
                <span style={{ borderBottom: '2px solid #FF1292', display: 'inline-block', paddingBottom: '5px' }}>
                  {pageData?.valuesSectionMainHeading || "Values"}
                </span>
              </h2>

              {/* Values Main Description (NEW) */}
              <p className="text-lg text-white opacity-75 lh-lg mb-0">
                {pageData?.valuesSectionMainDescription}
              </p>

            </div>
          </div>

          {/* 3. VALUES GRID (Bottom) */}
          <div className="row justify-content-center g-4">

            {values.length === 0 && (
              <div className="text-center text-white opacity-25 py-5">Loading values...</div>
            )}

            {values.map((item, index) => {
              const data = item.attributes || item;
              if (!data) return null;

              const API_URL = getStrapiApiUrl();

              const rawIcon = data.icon?.data?.attributes?.url || data.icon?.url;
              const iconUrl = rawIcon ? (rawIcon.startsWith('http') ? rawIcon : `${API_URL}${rawIcon}`) : null;

              return (
                <div
                  key={item.id || index}
                  className="col-lg-10"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="value-card">

                    {/* Icon */}
                    <div className="value-icon-wrapper">
                      {iconUrl && (
                        <Image
                          src={iconUrl}
                          width={35} height={35}
                          alt={data.title}
                          className="w-100 h-100 object-fit-contain"
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="text-content">
                      <h4 className="value-title font-recoleta">
                        {data.title}
                      </h4>
                      <p className="value-desc">
                        {data.description}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>


      <style jsx>{`
        .value-card {
            padding: 30px;
            border-radius: 20px;
            border: 1px solid transparent; /* Match industries base border logic */
            transition: all 0.3s ease;
        }

        /* Hover Effect - Matching IndustriesGrid */
        .value-card:hover {
            background: #242954; 
            border-color: #FF1292;
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/*
    {/* Our Values Section *
      <section className="values-section fancy-feature-thirtyTwo mt-140 lg-mt-120 md-mt-80" id="vision">
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
         <div className="row gx-xxl-5 mt-60 lg-mt-40 g-4">
           {/* Value 1 *
           {pageData?.value1_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="0">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column w-100">
                 <div className="icon m-auto tran3s"> 
                   <Image
                     src={getStrapiMediaUrl(pageData.value1_Image?.url) || '/images/icon/icon_175.svg'}
                     alt={pageData.value1_Title || 'Value icon'}
                     className="lazy-img" width={32} height={32}
                   />
                 </div>
                 <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value1_Title}</h4>
                 <p className="flex-grow-1">{pageData.value1_Description}</p>
               </div>
             </div>
           )}
           {/* Value 2 *
           {pageData?.value2_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="100">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column w-100">
                   <div className="icon m-auto tran3s">
                     <Image
                       src={getStrapiMediaUrl(pageData.value2_Image?.url) || '/images/icon/icon_175.svg'}
                       alt={pageData.value2_Title || 'Value icon'}
                       className="lazy-img" width={32} height={32}
                     />
                   </div>
                   <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value2_Title}</h4>
                   <p className="flex-grow-1">{pageData.value2_Description}</p>
                </div>
             </div>
           )}
           {/* Value 3 *
           {pageData?.value3_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="200">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column w-100">
                   <div className="icon m-auto tran3s">
                     <Image
                       src={getStrapiMediaUrl(pageData.value3_Image?.url) || '/images/icon/icon_175.svg'}
                       alt={pageData.value3_Title || 'Value icon'}
                       className="lazy-img" width={32} height={32}
                     />
                   </div>
                   <h4 className="fw-bold tx-dark mt-35 mb-20">{pageData.value3_Title}</h4>
                   <p className="flex-grow-1">{pageData.value3_Description}</p>
                </div>
             </div>
           )}
           {/* Value 4 *
           {pageData?.value4_Title && (
             <div className="col-md-6 col-lg-3 d-flex" data-aos="fade-up" data-aos-delay="300">
               <div className="card-style-fifteen tran3s text-center h-100 d-flex flex-column w-100">
                   <div className="icon m-auto tran3s">
                     <Image
                       src={getStrapiMediaUrl(pageData.value4_Image?.url) || '/images/icon/icon_175.svg'}
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
      </section> */}

      {/* Sustainability Section */}
      <section className="sustainability-section fancy-feature-thirtyTwo mt-140 lg-mt-120 md-mt-80 mb-140 lg-mb-120 md-mb-80 ">
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
              <div className="d-flex justify-content-center">
                <LetsTalkButton
                  buttonText={pageData?.sustainabilityButtonText || 'Explore Our Eco Initiatives'}
                  href={pageData?.sustainabilityButtonUrl || '/eco'}
                />
              </div>
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

      {/* ============================================== */}
      {/* --- CTA Section (Direct Implementation) --- */}
      {/* ============================================== */}
      {(() => {
        // 1. Data Source (Uses existing pageData or defaults)
        // This means if you add fields like 'ctaBgTitle' to your About Page later, 
        // it will pick them up automatically without changing the query.
        const ctaData = pageData || {};

        // 2. Text Logic
        const title = ctaData.ctaBgTitle || ctaData.ctaTitle || "Feeling Inspired Yet?";
        const subtitle = ctaData.ctaBgSubtitle || ctaData.ctaSubtitle || "We're only a click away.";
        const btnText = ctaData.ctaBgBtnText || ctaData.ctaBtnText || "Schedule a Marketing Audit";
        const btnUrl = ctaData.ctaBgBtnUrl || ctaData.ctaBtnUrl || "/contact";

        // 3. Smart Image Logic (Handles Strapi v4/v5 & Local Fallbacks)
        const getBgUrl = (obj) => {
          if (!obj) return null;
          const imgField = obj.ctaBgImage || obj['cta-bg']; // Checks both naming conventions
          if (!imgField) return null;

          // Deep checks for various Strapi formats
          return imgField.data?.attributes?.url || imgField.url || imgField.data?.url || null;
        };

        const rawUrl = getBgUrl(ctaData);
        const fullUrl = rawUrl
          ? getStrapiMediaUrl(rawUrl)
          : null;

        return (
          <div className="cta-hardcoded-wrapper">

            {/* Background Image Container */}
            <div className="bg-image-holder">
              {fullUrl ? (
                <Image
                  src={fullUrl}
                  alt="Background"
                  fill
                  className="cta-cover-image"
                  sizes="100vw"
                  priority
                />
              ) : (
                // Fallback Purple Background if no image uploaded
                <div className="fallback-bg"></div>
              )}

              {/* The Purple/Pink Gradient Overlay */}
              <div className="overlay"></div>
            </div>

            <div className="container position-relative z-2">
              <div className="row">
                <div className="col-lg-10 m-auto text-center">

                  <h2 className="main-title" data-aos="fade-up">
                    {title}
                  </h2>

                  <p className="subtitle" data-aos="fade-up" data-aos-delay="100">
                    {subtitle}
                  </p>

                  <div className="btn-holder" data-aos="fade-up" data-aos-delay="200">
                    <div className="d-inline-block">
                      {/* Ensure LetsTalkButton is imported at top of file */}
                      <LetsTalkButton
                        buttonText={btnText}
                        href={btnUrl}
                        showIcon={false}
                        className="custom-cta-button"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })()}



      <FooterWithSettings />

      <style jsx>{`
        /* Header Fix */
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

        /* --- MOBILE OPTIMIZATION --- */
        @media (max-width: 768px) {
            .about-hero-section {
                height: auto;
                min-height: 500px;
                padding-top: 120px;
                padding-bottom: 80px;
            }
            .shape-svg { width: 150px; height: auto; }
        }
      `}</style>
    </>
  )
};

export default About;