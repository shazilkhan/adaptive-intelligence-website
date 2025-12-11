import Link from "next/link";
import Image from "next/image";

const Feature = ({ featureData }) => {
  // --- 1. Image Logic ---
  const imageUrl = featureData?.featureImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featureData.featureImage.url}`
    : null; // No fallback image, so we know if it breaks
  
  const imageAlt = featureData?.featureImage?.alternativeText || "Feature Image";

  // --- 2. Text Fields (Must match Strapi API IDs) ---
  const tagline = featureData?.featureTagline;
  const title = featureData?.featureTitle;
  const titleHighlight = featureData?.featureTitleHighlight;
  
  // Optional lead-in paragraph
  const description = featureData?.featureDescription; 

  // --- 3. Dynamic Content Repeater (The Bold/Regular text) ---
  // Default to empty array so it doesn't crash if empty
  const contentItems = featureData?.featureContent || [];

  // --- 4. CTA Fields ---
  const linkText = featureData?.featureLinkText;
  const buttonText = featureData?.featureButtonText;
  const buttonUrl = featureData?.featureButtonUrl || "#";

  if (!featureData) return null; // Don't render if no data

  return (
    <div 
      className="fancy-feature-thirty position-relative mt-190 pb-140 lg-mt-100 lg-pb-120 md-mt-80 md-pb-80"
    >
      <div className="container">
        <div className="row align-items-center">
          
          {/* LEFT COLUMN: IMAGE */}
          <div className="col-lg-6 mb-40 mb-lg-0" data-aos="fade-right">
            <div className="image-wrapper position-relative">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  priority
                />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: TEXT */}
          <div className="col-lg-6 ms-auto" data-aos="fade-left">
            <div className="block-style-four ps-xxl-5 ms-xxl-4">
              <div className="title-style-ten">
                <div className="sc-title" style={{ color: '#FF1292' }}>
                    {tagline}
                </div>
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {title}{" "}
                  <span className="position-relative">
                    {titleHighlight}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="shape"
                      width={266}
                      height={7}
                      className="shape-underline"
                    />
                  </span>
                </h2>
              </div>

              {/* Optional Lead-in Description */}
              {description && (
                <p className="fs-20 pt-30 pb-10 md-pt-10">
                    {description}
                </p>
              )}

              {/* REPEATER CONTENT SECTION */}
              <div className="fs-20 pt-20 pb-30 lg-pb-10 content-repeater-wrapper">
                {contentItems.map((item) => (
                  <span 
                    key={item.id} 
                    className={item.isBold ? "fw-bold tx-dark" : ""}
                  >
                    {item.text}{" "}
                  </span>
                ))}
              </div>

              {/* CTA SECTION */}
              <div className="btn-eighteen position-relative d-inline-block tx-dark mt-50 lg-mt-30">
                {linkText}{" "}
                <Link 
                    href={buttonUrl} 
                    className="fw-500 tran3s"
                    style={{ fontSize: '1.25rem', padding: '15px 35px' }}
                >
                  {buttonText} <i className="bi bi-arrow-right ms-2" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 576px) {
            .shape-underline { width: 100%; height: auto; }
        }
      `}</style>
    </div>
  );
};

export default Feature;