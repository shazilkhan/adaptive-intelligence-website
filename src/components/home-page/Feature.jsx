import Link from "next/link";
import Image from "next/image";

const Feature = ({ featureData }) => {
  // Image Logic
  const imageUrl = featureData?.featureImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featureData.featureImage.url}`
    : "/images/assets/mathias-reding-YyIgIirt5A0-unsplash.jpg";
  
  const imageAlt = featureData?.featureImage?.alternativeText || "media";

  // Helper variables
  const tagline = featureData?.featureTagline || "Creative is Power.";
  const title = featureData?.featureTitle || "We’re in the business of growing your";
  const titleHighlight = featureData?.featureTitleHighlight || "Business.";
  const description = featureData?.featureDescription || "By harnessing resources...";
  const listItems = featureData?.featureListItems || [
    { id: 1, text: "Conversion-focused content." },
    { id: 2, text: "Highly emotive brand messaging." },
    { id: 3, text: "Launch and revitalize your company." },
  ];
  const linkText = featureData?.featureLinkText || "Want to learn more?";
  const buttonText = featureData?.featureButtonText || "Click here";
  const buttonUrl = featureData?.featureButtonUrl || "/about";

  return (
    <div className="fancy-feature-thirty position-relative mt-190 pb-140 lg-mt-100 lg-pb-120 md-p0">
      <div className="container">
        <div className="row align-items-center">
          
          {/* --- LEFT COLUMN: IMAGE --- */}
          {/*  */}
          <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
            <div className="image-wrapper position-relative">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  width={800}
                  height={600}
                  style={{ 
                    width: '100%', 
                    height: 'auto', // Prevents stretching
                    objectFit: 'cover'
                  }}
                  priority
                />
            </div>
          </div>

          {/* --- RIGHT COLUMN: TEXT --- */}
          <div className="col-lg-6 ms-auto" data-aos="fade-left">
            <div className="block-style-four ps-xxl-5 ms-xxl-4">
              <div className="title-style-ten">
                <div className="sc-title">{tagline}</div>
                <h2 className="main-title font-recoleta fw-normal tx-dark">
                  {title}{" "}
                  <span className="position-relative">
                    {titleHighlight}{" "}
                    <Image
                      src="/images/shape/shape_122.svg"
                      alt="shape"
                      width={266}
                      height={7}
                    />
                  </span>
                </h2>
              </div>
              <p className="fs-20 pt-30 pb-30 lg-pb-10 md-pt-10">
                {description}
              </p>
              <ul className="style-none list-item">
                {listItems.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
              <div className="btn-eighteen position-relative d-inline-block tx-dark mt-35 lg-mt-20">
                {linkText}{" "}
                <Link href={buttonUrl} className="fw-500 tran3s">
                  {buttonText} <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Feature;