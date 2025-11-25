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
    const membersRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/team-members?populate[0]=headshot`);
    if (membersRes.ok) {
      const json = await membersRes.json();
      teamMembers = json.data || [];
    }

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

// --- REDESIGNED PREMIUM CARD ---
const TeamMemberCard = ({ member }) => {
  const imageUrl = member.headshot?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${member.headshot.url}`
    : '/images/placeholder-headshot.png'; 

  let displayBio = member.bio_short || '';
  if (!displayBio && member.bio_long) {
      displayBio = member.bio_long.replace(/<[^>]*>?/gm, ''); 
  }

  return (
    <div className="team-card-premium h-100">
      {/* Decorative Top Highlight */}
      <div className="card-accent-line"></div>

      <div className="card-content">
        {/* Image Wrapper: Styled Circle */}
        <div className="headshot-frame mx-auto">
            <Image
            src={imageUrl}
            alt={`Headshot of ${member.name}`}
            width={180} 
            height={180} 
            className="headshot-img"
            unoptimized={true} 
            />
        </div>
        
        {/* Text Content */}
        <div className="text-center mt-4 d-flex flex-column flex-grow-1">
            <h3 className="member-name">{member.name}</h3>
            <div className="member-title-wrapper">
                <span className="member-title">{member.title}</span>
            </div>
            
            <div className="member-bio">
                <p>{displayBio}</p>
            </div>
            
            {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="connect-link mt-auto">
                <span>LinkedIn</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
            )}
        </div>
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

  const hasMediaBackground = (heroType === 'Video') || (heroType === 'Image');

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
      {/* Added md-pt-80 md-pb-80 for mobile spacing */}
      <section className="team-grid-section pb-150 lg-pb-120 pt-150 lg-pt-120 md-pt-80 md-pb-80" style={{ background: '#fcfcfc' }}>
        <div className="container">
          
          {/* Executive Team */}
          {executives.length > 0 && (
            // Added md-mb-60
            <div className="team-group mb-120 lg-mb-80 md-mb-60">
              <div className="text-center mb-60 md-mb-40">
                <div className="sc-title-pink">LEADERSHIP</div>
                <h2 className="group-title font-recoleta">Executive Team</h2>
              </div>
              <div className="row g-4 justify-content-center">
                {executives.map(member => (
                  <div key={member.id} className="col-lg-4 col-md-6 d-flex"> 
                    <TeamMemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creative & Strategy Team */}
          {creatives.length > 0 && (
            <div className="team-group">
              <div className="text-center mb-60 md-mb-40">
                  <div className="sc-title-pink">EXPERTS</div>
                  <h2 className="group-title font-recoleta">Creative & Strategy</h2>
              </div>
              <div className="row g-4 justify-content-center">
                {creatives.map(member => (
                  <div key={member.id} className="col-lg-4 col-md-6 d-flex">
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

        /* --- PREMIUM CARD STYLES --- */
        .sc-title-pink {
            color: #FF1292;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .group-title { margin-bottom: 20px; font-size: 3rem; color: #151937; }

        .team-card-premium {
            background: white;
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(0,0,0,0.04);
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
        }
        
        .team-card-premium:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 60px -15px rgba(255, 18, 146, 0.15);
            border-color: rgba(255, 18, 146, 0.2);
        }

        .card-accent-line {
            height: 6px;
            width: 100%;
            background: linear-gradient(90deg, #FF1292, #151937);
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .team-card-premium:hover .card-accent-line {
            opacity: 1;
        }

        .card-content {
            padding: 50px 35px;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .headshot-frame {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            padding: 8px;
            background: white;
            border: 1px solid #eee;
            box-shadow: 0 8px 20px rgba(0,0,0,0.06);
            margin-bottom: 25px;
            transition: all 0.3s ease;
        }
        
        .team-card-premium:hover .headshot-frame {
            border-color: #FF1292;
            transform: scale(1.02);
        }

        .headshot-img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .member-name {
            font-family: 'Recoleta', serif;
            font-size: 1.8rem;
            color: #151937;
            margin-bottom: 5px;
            line-height: 1.2;
        }

        .member-title-wrapper {
            margin-bottom: 20px;
        }

        .member-title {
            display: inline-block;
            font-size: 0.9rem;
            color: #FF1292;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(255, 18, 146, 0.05);
            padding: 6px 14px;
            border-radius: 30px;
        }

        .member-bio p {
            font-size: 1rem;
            line-height: 1.7;
            color: #555;
            font-weight: 400;
        }

        .connect-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 30px;
            font-weight: 600;
            color: #151937;
            text-decoration: none;
            border-bottom: 2px solid #eee;
            padding-bottom: 4px;
            transition: all 0.3s ease;
            align-self: center;
        }

        .connect-link:hover {
            color: #FF1292;
            border-color: #FF1292;
        }

        /* --- MOBILE OPTIMIZATION --- */
        @media (max-width: 768px) {
            .team-hero-section {
                height: auto;
                min-height: 500px;
                padding-top: 120px;
                padding-bottom: 80px;
            }
            .main-title {
                font-size: 2.5rem;
                line-height: 1.2;
            }
            .group-title {
                font-size: 2.2rem;
            }
            .card-content {
                padding: 35px 25px;
            }
        }

        /* Conditional Header Colors */
        ${hasMediaBackground ? `
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-link { color: white !important; }
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.active .nav-link,
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-item.current-menu-item .nav-link,
            body .theme-main-menu:not(.fixed) .navbar-nav .nav-item:hover .nav-link { color: #FF1292 !important; }
            body .theme-main-menu:not(.fixed) .lets-talk-btn { color: white !important; border-color: white !important; background: transparent !important; }
            body .theme-main-menu:not(.fixed) .lets-talk-btn:hover { color: black !important; background: white !important; }
        ` : ''}
      `}</style>
    </>
  );
};

export default TeamPage;