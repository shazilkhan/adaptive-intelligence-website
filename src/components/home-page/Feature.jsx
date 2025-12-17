import Link from "next/link";
import Image from "next/image";
import LetsTalkButton from "@/components/LetsTalkButton";

const Feature = ({ featureData }) => {
  // --- 1. Image Logic ---
  const imageUrl = featureData?.featureImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featureData.featureImage.url}`
    : null;

  const imageAlt = featureData?.featureImage?.alternativeText || "Feature Image";

  // --- 2. Text Fields ---
  const tagline = featureData?.featureTagline;
  const title = featureData?.featureTitle;
  const titleHighlight = featureData?.featureTitleHighlight;

  const description = featureData?.featureDescription;

  // --- 3. Dynamic Content Repeater ---
  const contentItems = featureData?.featureContent || [];

  // --- 4. CTA Fields ---
  const linkText = featureData?.featureLinkText;
  const buttonText = featureData?.featureButtonText;
  const buttonUrl = featureData?.featureButtonUrl || "#";

  if (!featureData) return null;

  return (
    <div
      className="fancy-feature-thirty position-relative mt-190 pb-140 lg-mt-100 lg-pb-120 md-mt-80 md-pb-80"
    >
      <div className="container">
        <div className="row align-items-start">

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
            {/* REVERTED: Kept the original spacing classes here */}
            <div className="block-style-four ps-xxl-5 ms-xxl-4">
              <div className="title-style-ten">
                <div className="sc-title" style={{ color: '#FF1292' }}>
                  {tagline}
                </div>

                {/* Applied responsive-title class */}
                <h2 className="main-title font-recoleta fw-normal tx-dark responsive-title">
                  {title}&nbsp;
                  <span className="position-relative d-inline">
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
                  <p
                    key={item.id}
                    className={`mb-4 ${item.isBold ? "fw-bold tx-dark" : ""}`}
                  >
                    {item.text}
                  </p>
                ))}
              </div>

              {/* CTA SECTION */}
              {/* CTA SECTION */}
              <div className="btn-eighteen position-relative d-inline-block tx-dark mt-30 lg-mt-30">
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
        /* Desktop size */
        .responsive-title {
            font-size: 3.4rem;
            line-height: 1.2;
        }

        /* Mobile size (Under 768px) */
        @media (max-width: 768px) {
            .responsive-title {
                font-size: 2.2rem; /* Reduced to fit mobile screens */
            }
            .shape-underline { 
                width: 100%; 
                height: auto; 
            }
        }
      `}</style>
    </div>
  );
};

export default Feature;