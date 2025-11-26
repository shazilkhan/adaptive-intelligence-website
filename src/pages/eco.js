import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";

// Icon mapping function for hub cards
const getHubIconByType = (iconType) => {
  const icons = {
    tools: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ),
    research: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    community: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  };
  
  return icons[iconType] || icons.tools;
};

const EcoPage = ({ treeCardStats, pageData }) => {
  if (!pageData) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // --- Hero Background Logic ---
  const heroType = pageData.heroBackgroundType || 'Image';
  
  const heroVideoUrl = pageData.heroBackgroundVideo?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundVideo.url}` 
    : null;

  const heroImageUrl = pageData.heroBackgroundImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundImage.url}`
    : 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80';

  const impactImageUrl = pageData.impactBackgroundImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.impactBackgroundImage.url}`
    : 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80';

  const noaaImageUrl = pageData.noaaImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.noaaImage.url}`
    : '/images/assets/environmental-impact.jpeg';

  return (
    <>
      <Header />

      {/* Section 1: Hero */}
      <section className="eco-hero">
        <div className="hero-background">
            {/* Conditional Render: Video or Image */}
            {heroType === 'Video' && heroVideoUrl ? (
                <video autoPlay loop muted playsInline className="hero-bg-media">
                    <source src={heroVideoUrl} type="video/mp4" />
                </video>
            ) : (
                <Image
                    src={heroImageUrl}
                    alt="Lush green landscape"
                    layout="fill"
                    objectFit="cover"
                    quality={80}
                    priority
                />
            )}
          <div className="hero-overlay" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto text-center">
              <h1 className="main-title">
                {pageData.heroTitle || 'Sustainability at Adaptive Intelligence'}
                <span className="position-relative d-inline-block">
                  <Image
                    src="/images/shape/shape_122.svg"
                    alt="underline"
                    width={400}
                    height={8}
                    style={{position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)' }}
                  />
                </span>
              </h1>
              <p className="hero-subtitle">
                {pageData.heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Living Resource Hub */}
      <section className="resource-hub-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div className="sc-title">{pageData.commitmentTagline || 'Our Commitment'}</div>
              <h2 className="section-title">{pageData.commitmentTitle}</h2>
              <p className="section-description">
                {pageData.commitmentDescription}
              </p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {pageData.hubCards?.map((card, index) => (
              <div key={card.id || index} className="col-md-6 col-lg-4">
                <div className="hub-card">
                  <div className="card-icon">
                    {getHubIconByType(card.iconType)}
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-text">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Impact By The Numbers (TreeCard) */}
      <section className="impact-section">
        <div className="impact-background">
          <Image
            src={impactImageUrl}
            alt="Forest canopy"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
          <div className="impact-overlay" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <Image 
                src="/images/logo/62fbf4327b17746206b87f63_white logo.svg" 
                alt="TreeCard Logo" 
                width={150} 
                height={50} 
                style={{ margin: '0 auto 20px auto' }} 
              />
              <h2 className="section-title text-white">{pageData.impactTitle}</h2>
              <p className="section-description text-white-70">
                {pageData.impactDescription}
              </p>
            </div>
          </div>
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.trees || 0).toLocaleString()}</div>
                <div className="stat-label">Trees Planted</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.acres || 0).toFixed(1)}</div>
                <div className="stat-label">Acres of Tree Coverage</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.carbon || 0).toLocaleString()}</div>
                <div className="stat-label">Tons of Carbon Absorbed</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-number">{(treeCardStats.bottles || 0).toLocaleString()}</div>
                <div className="stat-label">Plastic Bottles Removed</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center cta-container">
              <a 
                href={pageData.treeCardButtonUrl || 'https://www.treecard.org/#getcard'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="eco-button"
              >
                <span>{pageData.treeCardButtonText || 'Join TreeCard'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: NOAA Papers */}
      <section className="noaa-section pt-150 pb-150 lg-pt-120 lg-pb-120 md-pt-80 md-pb-80">
        <div className="container">
          <div className="row align-items-center">
            
            {/* Image Column: Added mb-50 for mobile separation */}
            <div className="col-lg-6 mb-50 lg-mb-0">
              <Image
                src={noaaImageUrl}
                alt="Environmental research documents"
                width={600}
                height={500}
                className="noaa-image"
                // FIX: width 100% + height auto prevents stretching
                style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'cover',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                }}
              />
            </div>

            {/* Text Column: Added ps-lg-5 for desktop spacing */}
            <div className="col-lg-6">
              <div className="ps-lg-5">
                <h2 className="section-title">{pageData.noaaTitle}</h2>
                <p className="mb-30">{pageData.noaaParagraph1}</p>
                <p className="mb-40">{pageData.noaaParagraph2}</p>
                <a 
                    href={pageData.noaaDownloadUrl || 'https://we.tl/t-v5QlQl4Kao'} 
                    className="download-button" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    {pageData.noaaDownloadButtonText || 'Download NOAA Papers'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ms-2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5: Community Connection */}
      <section className="community-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="section-title">{pageData.communityTitle}</h2>
              <p className="section-description">
                {pageData.communityDescription}
              </p>
              <p className="community-cta">
                {pageData.communityCtaText}
                <a href={`mailto:${pageData.communityEmail || 'eco@aii.agency'}`} className="email-link">
                  {pageData.communityEmail || 'eco@aii.agency'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterWithSettings />

      <style jsx>{`
        /* White Header Fix for This Page */
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-link) { color: white !important; }
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item:hover .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.active .nav-link),
        :global(body .theme-main-menu.white-vr:not(.fixed) .navbar .navbar-nav .nav-item.current-menu-item .nav-link) { color: #FF1292 !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn) { color: white !important; border-color: white !important; background: transparent !important; }
        :global(body .theme-main-menu:not(.fixed) .lets-talk-btn:hover) { color: black !important; background: white !important; }

        /* Common Section Styles */
        .sc-title { color: #FF1292; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .section-title { font-family: 'Recoleta', serif; font-weight: 400; color: #151937; margin-bottom: 20px; }
        .section-description { font-size: 1.1rem; color: #666; line-height: 1.7; max-width: 700px; margin-left: auto; margin-right: auto; }

        /* Section 1: Hero */
        .eco-hero { position: relative; height: 80vh; min-height: 600px; display: flex; align-items: center; color: white; text-align: center; }
        .hero-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); }
        
        /* Video Background Style */
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }

        .main-title { font-family: 'Recoleta', serif; font-size: 4rem; font-weight: 400; color: white; line-height: 1.2; }
        .hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.85); max-width: 800px; margin: 30px auto 0; line-height: 1.6; }
        
        /* Section 2: Resource Hub */
        .resource-hub-section { padding: 120px 0; background: #f8f9fa; }
        .hub-card { background: white; padding: 40px; border-radius: 12px; height: 100%; text-align: center; transition: all 0.3s ease; }
        .hub-card:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
        .card-icon { color: #FF1292; margin-bottom: 20px; }
        .card-title { font-family: 'Recoleta', serif; font-size: 1.5rem; color: #151937; margin-bottom: 15px; }
        .card-text { color: #666; line-height: 1.6; }

        /* Section 3: Impact Numbers */
        .impact-section { padding: 120px 0; position: relative; color: white; }
        .impact-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .impact-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(21, 25, 55, 0.85) 0%, rgba(255, 18, 146, 0.6) 100%); }
        .impact-section .section-title { color: white; }
        .text-white-70 { color: rgba(255,255,255,0.7); }
        .stat-card { background: rgba(255, 255, 255, 0.1); padding: 30px 20px; border-radius: 12px; backdrop-filter: blur(10px); height: 100%; }
        .stat-number { font-size: 3rem; font-weight: 600; line-height: 1; color: white; }
        .stat-label { font-size: 1rem; color: rgba(255, 255, 255, 0.8); margin-top: 10px; }
        .cta-container { margin-top: 60px; }
        
        .eco-button {
          background: white; color: black; border: 1px solid #ff1292; border-radius: 0; padding: 15px 30px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; font-weight: 500; cursor: pointer;
        }
        .eco-button:hover {
          background: #ff1292; border-color: #ff1292; color: white;
        }

        /* Section 4: NOAA Papers */
        .noaa-section { padding: 120px 0; background: white; }
        .noaa-image { border-radius: 12px; }
        .noaa-section p { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 20px; }
        .download-button { display: inline-flex; align-items: center; gap: 10px; background: #151937; color: white; padding: 16px 32px; text-decoration: none; font-weight: 500; margin-top: 20px; transition: all 0.3s ease; }
        .download-button:hover { background: #FF1292; transform: translateY(-2px); }

        /* Section 5: Community Connection */
        .community-section { padding: 120px 0; background: #f8f9fa; }
        .community-cta { font-size: 1.2rem; color: #151937; margin-top: 30px; }
        .email-link { color: #FF1292; text-decoration: none; font-weight: 600; margin-left: 8px; border-bottom: 2px solid transparent; transition: border-color 0.3s ease; }
        .email-link:hover { border-color: #FF1292; }

        /* Responsive Styles */
        @media (max-width: 991px) { .main-title { font-size: 3rem; } .noaa-image { margin-bottom: 40px; } }
        @media (max-width: 768px) { .eco-hero { height: 70vh; } .main-title { font-size: 2.2rem; } .hero-subtitle { font-size: 1.1rem; } .resource-hub-section, .impact-section, .noaa-section, .community-section { padding: 80px 0; } .section-title { font-size: 2rem; } .stat-card { margin-bottom: 20px; } .stat-number { font-size: 2.2rem; } }
      `}</style>
    </>
  );
};

export async function getStaticProps() {
  const fallbackData = { trees: 311, acres: 1.2, carbon: 328, bottles: 1674 };
  let finalStats = { ...fallbackData };

  console.log("--- Starting getStaticProps for EcoPage ---");

  // Fetch TreeCard stats from Google Sheets
  try {
    const sheetId = '1ICb8PWttvv0leKmfmJWXSGhXkZz5UAxChmFamV_bh1c';
    const sheetName = 'Total%20Footprint';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    const response = await fetch(url);

    if (response.ok) {
      const csvText = await response.text();
      const rows = csvText.replace(/"/g, '').split('\n');

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
    console.error('❌ Error during Google Sheet fetch/parse:', error.message);
  }

  // --- Fetch Eco Page content from Strapi ---
  let strapiPageData = null;
  try {
    // populate=* handles top-level media
    const pageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/eco-page?populate=*`;
    const pageRes = await fetch(pageUrl);

    if (pageRes.ok) {
      const pageJson = await pageRes.json();
      // Handle Strapi v5 flat structure
      strapiPageData = pageJson.data || null;
    } 

  } catch (error) {
    console.error("❌ Error fetching/processing Strapi eco page data:", error.message);
  }

  return {
    props: {
      treeCardStats: finalStats,
      pageData: strapiPageData 
    },
    revalidate: 60,
  };
}

export default EcoPage;