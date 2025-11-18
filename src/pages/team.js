import React from 'react';
import Header from '@/components/header/Header';
import FooterWithSettings from "@/components/footer/FooterWithSettings";
import Image from "next/image";
import Head from 'next/head';

// --- getStaticProps ---
export async function getStaticProps() {
  let teamMembers = [];
  let pageData = null;

  try {
    // 1. Fetch Team Members
    const membersRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/team-members?populate[0]=headshot`);
    if (membersRes.ok) {
      const json = await membersRes.json();
      teamMembers = json.data || [];
    }

    // 2. Fetch Team Page Settings
    try {
        const pageRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/team-page?populate=*`);
        if (pageRes.ok) {
            const json = await pageRes.json();
            pageData = json.data || null;
        }
    } catch (e) {
        console.warn("Team Page Single Type not found:", e);
    }

  } catch (error) {
    console.error("❌ Error fetching team data:", error.message);
  }

  return {
    props: {
      teamMembers,
      pageData,
    },
    revalidate: 10,
  };
}

// --- Card Component ---
const TeamMemberCard = ({ member }) => {
  const imageUrl = member.headshot?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${member.headshot.url}`
    : '/images/placeholder-headshot.png'; 

  // --- FIX: SHOW FULL BIO ---
  // We prioritize bio_short. If missing, we use the full bio_long (cleaned of HTML tags).
  let displayBio = member.bio_short || '';
  if (!displayBio && member.bio_long) {
      // Simple regex to strip HTML tags if bio_long is Rich Text
      displayBio = member.bio_long.replace(/<[^>]*>?/gm, ''); 
  }

  return (
    <div className="team-card h-100 d-flex flex-column">
      <div className="team-headshot-wrapper">
        {/* --- FIX: IMAGE QUALITY --- */}
        <Image
          src={imageUrl}
          alt={`Headshot of ${member.name}`}
          width={500} // Increased resolution
          height={500} 
          className="team-headshot-img"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }} // Ensure it fills container
          unoptimized={true} // Optional: disables Next.js optimization if it's causing blur on Strapi images
        />
        {/* Optional Overlay */}
        <div className="headshot-overlay"></div>
      </div>
      <div className="team-info d-flex flex-column flex-grow-1">
        <h3 className="team-name font-recoleta">{member.name}</h3>
        <p className="team-title">{member.title}</p>
        
        {/* Display Full Bio */}
        <p className="team-bio-text flex-grow-1">{displayBio}</p>
        
        {member.linkedin_url && (
          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="linkedin-button mt-auto">
            <span>Connect</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </a>
        )}
      </div>
    </div>
  );
};


const TeamPage = ({ teamMembers, pageData }) => { 

  const executives = teamMembers?.filter(m => m.group === 'Executive') || [];
  const creatives = teamMembers?.filter(m => m.group === 'Creative') || [];

  // --- HERO LOGIC ---
  const heroType = pageData?.heroBackgroundType || 'Image';
  const heroVideoUrl = pageData?.heroBackgroundVideo?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundVideo.url}` 
    : null;
  const heroImageUrl = pageData?.heroBackgroundImage?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.heroBackgroundImage.url}` 
    : null;

  const hasMediaBackground = (heroType === 'Video' || heroType === 'Image');

  return (
    <>
      <Head>
        <title>Team | Adaptive Intelligence</title>
        <meta name="description" content="Meet the executive team and creatives behind Adaptive Intelligence." />
      </Head>

      <Header menuTextColor={hasMediaBackground ? "white" : "dark"} />

      {/* --- CINEMATIC HERO --- */}
      <div className="team-hero-section">
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
                        <h1 className="main-title font-recoleta fw-normal text-white">
                           {pageData?.heroTitle || "Meet the team behind Adaptive Intelligence"}
                        </h1>
                        <p className="text-lg text-white text-center lh-lg mt-25 md-mt-20" data-aos="fade-up">
                           {pageData?.heroDescription || "We’re a collective of strategists, technologists, and creatives who believe the world runs on great ideas and responsible execution."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- TEAM GRIDS --- */}
      <section className="team-grid-section pb-150 lg-pb-120 pt-150 lg-pt-120">
        <div className="container">
          {/* Executive Team */}
          {executives.length > 0 && (
            <div className="team-group mb-100 lg-mb-80">
              <h2 className="group-title text-center font-recoleta">Executive Team</h2>
              <div className="row g-4 justify-content-center mt-40">
                {executives.map(member => (
                  <div key={member.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 d-flex"> 
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creative & Strategy Team */}
          {creatives.length > 0 && (
            <div className="team-group">
              <h2 className="group-title text-center font-recoleta">Creative & Strategy</h2>
              <div className="row g-4 justify-content-center mt-40">
                {creatives.map(member => (
                  <div key={member.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 d-flex">
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          )}

           {(!teamMembers || teamMembers.length === 0) && ( 
               <p className="text-center fs-20">Team member information is currently unavailable.</p>
           )}
        </div>
      </section>

      <FooterWithSettings />

      <style jsx global>{`
        /* Base Hero Styles */
        .team-hero-section { 
            position: relative; 
            overflow: hidden; 
            height: 80vh; 
            min-height: 600px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: white; 
            text-align: center; 
            width: 100%;
        }
        .hero-bg-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-bg-media { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .hero-bg-fallback { 
            width: 100%; 
            height: 100%; 
            background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); 
            position: absolute; 
            top: 0; 
            left: 0; 
        }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 1; }
        .z-2 { z-index: 2; }
        .group-title { margin-bottom: 20px; font-size: 2.5rem; color: #151937; }

        /* Team Card Styles */
        .team-headshot-wrapper {
            width: 100%;
            aspect-ratio: 1 / 1; /* Forces square aspect ratio */
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .team-bio-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #666;
            margin-bottom: 20px;
        }

        /* Conditional Header Colors */
        ${hasMediaBackground ? `
            /* Force White Menu Links (When NOT fixed) */
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-link {
                color: white !important;
            }

            /* Force Pink Active/Hover Links (Overrides White) */
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.active .nav-link,
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.current-menu-item .nav-link,
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-item:hover .nav-link {
                color: #FF1292 !important;
            }

            /* "Let's Talk" Button: White Border/Text */
            body .theme-main-menu:not(.fixed) .lets-talk-btn {
                color: white !important;
                border-color: white !important;
                background: transparent !important;
            }

            /* "Let's Talk" Button Hover: Black Text, White Bg */
            body .theme-main-menu:not(.fixed) .lets-talk-btn:hover {
                color: black !important;
                background: white !important;
            }
        ` : ''}
      `}</style>
    </>
  );
};

export default TeamPage;