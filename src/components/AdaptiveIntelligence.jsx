import React from 'react';
import Image from 'next/image';

// Helper to safely get URLs (handles Strapi v4/v5 nesting)
const getUrl = (media) => {
    if (!media) return null;
    return media.url || media.attributes?.url || null;
};

const AdaptiveIntelligence = ({ data }) => {
    // Safety check
    if (!data) return null;

    // 1. Destructure with specific field names
    const title = data.adaptiveIntelligenceTitle || "Ad·ap·tive In·tel·li·gence";
    const videoUrl = getUrl(data.adaptiveIntelligenceBgVideo);
    const imageUrl = getUrl(data.adaptiveIntelligenceBgImage);
    const features = data.adaptiveIntelligenceFeatures || [];

    return (
        <section className="adaptive-intelligence-section position-relative">
            
            {/* --- Background Layer --- */}
            <div className="bg-layer">
                {videoUrl ? (
                    // Priority 1: Video
                    <video autoPlay muted loop playsInline className="bg-media">
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                ) : imageUrl ? (
                    // Priority 2: Image
                    <Image 
                        src={imageUrl} 
                        alt={title} 
                        fill 
                        className="bg-media object-fit-cover"
                        priority
                    />
                ) : (
                    // Priority 3: Fallback Grey
                    <div className="bg-media" style={{background: '#333'}}></div>
                )}
                {/* Dark Overlay Tint */}
                <div className="bg-overlay-tint"></div>
            </div>

            {/* --- Content Layer --- */}
            <div className="container position-relative z-2 h-100 d-flex align-items-center justify-content-center pt-150 pb-150 md-pt-100 md-pb-100">
                <div className="content-box text-center text-white" data-aos="fade-up">
                    
                    {/* Title */}
                    <h2 className="section-title font-recoleta fw-normal mb-40 lg-mb-30">
                        {title}
                    </h2>

                    {/* Numbered List */}
                    {features.length > 0 && (
                        <ol className="feature-ol mx-auto text-start d-inline-block">
                            {features.map((item, index) => (
                                <li key={index} className="text-lg lh-lg mb-3">
                                    {/* Handle 'text' or 'featureText' just in case */}
                                    {item.text || item.featureText || item.attributes?.text}
                                </li>
                            ))}
                        </ol>
                    )}

                </div>
            </div>

            <style jsx>{`
                .adaptive-intelligence-section {
                    min-height: 600px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }

                .bg-layer, .bg-overlay-tint {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                /* Video/Image Styling */
                :global(.bg-media) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    position: absolute;
                }

                /* Dark Tint (Adjust opacity to make text readable) */
                .bg-overlay-tint {
                    background: rgba(0, 0, 0, 0.4); 
                    z-index: 1;
                }

                /* Content Box (Frosted dark glass effect) */
                .content-box {
                    background: rgba(22, 22, 22, 0.85);
                    padding: 60px 80px;
                    max-width: 900px;
                    width: 100%;
                    backdrop-filter: blur(5px); /* Optional blur */
                }

                .section-title {
                    font-size: 48px;
                    letter-spacing: -0.5px;
                }

                /* Custom Numbered List */
                .feature-ol {
                    counter-reset: list-counter;
                    list-style: none;
                    padding-left: 20px;
                    margin: 0;
                }
                
                .feature-ol li {
                    position: relative;
                    padding-left: 35px;
                    opacity: 0.9;
                }

                .feature-ol li::before {
                    counter-increment: list-counter;
                    content: counter(list-counter) ".";
                    position: absolute;
                    left: 0;
                    top: 0;
                    font-weight: 600;
                    color: #FF1292; /* Pink Accent */
                }

                @media (max-width: 767px) {
                   .content-box { padding: 40px 20px; }
                   .section-title { font-size: 32px; }
                }
            `}</style>
        </section>
    );
};

export default AdaptiveIntelligence;