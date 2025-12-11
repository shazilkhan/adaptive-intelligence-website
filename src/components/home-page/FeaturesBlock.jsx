import Link from "next/link";
import Image from "next/image";
import LetsTalkButton from "@/components/LetsTalkButton";

const FeaturesBlock = ({ featuresData }) => {
  // CORRECTED: The image URL path is now simpler to match your Strapi data.
  const mainImageUrl = featuresData?.whyUsMainImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featuresData.whyUsMainImage.url}`
    : "/images/assets/john-FlPc9-unsplash.jpg";
    
  const infoBox1IconUrl = featuresData?.whyUsInfoBox1Icon?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featuresData.whyUsInfoBox1Icon.url}`
    : "/images/logo/Plogo-34.png";

  const infoBox2Icon1Url = featuresData?.whyUsInfoBox2Icon1?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featuresData.whyUsInfoBox2Icon1.url}`
    : "/images/logo/Plogo-35.png";
    
  const infoBox2Icon2Url = featuresData?.whyUsInfoBox2Icon2?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${featuresData.whyUsInfoBox2Icon2.url}`
    : "/images/logo/Plogo-36.png";

  return (
    <>
      <div className="col-lg-5 col-md-10">
        <div className="block-style-six pe-xxl-5" data-aos="fade-right">
          <div className="title-style-ten">
            <div className="sc-title">{featuresData?.whyUsTagline || "WHY CHOOSE US"}</div>
            <h2 className="main-title font-recoleta fw-normal tx-dark">
              {featuresData?.whyUsTitle || "Get quality "}&nbsp;
              <span className="position-relative">
                {featuresData?.whyUsTitleHighlight || "Leads"}{" "}
                <Image src="/images/shape/shape_122.svg" alt="" width={199} height={5} />
              </span>
              {featuresData?.whyUsTitleEnd || " in single click."}
            </h2>
          </div>
          <p className="fs-20 mt-15 mb-45">
            {featuresData?.whyUsDescription || "Lorem ipsum dolor sit amet..."}
          </p>
          <div className="info mb-50">
            <div className="row">
              <div className="col-sm-6">
                <div className="icon mt-30">
                  <Image src={infoBox1IconUrl} alt="logo" className="lazy-img" width={43} height={43} />
                </div>
                <h4 className="tx-dark mt-20">{featuresData?.whyUsInfoBox1Title || "Secure & trusted..."}</h4>
              </div>
              <div className="col-sm-6">
                <div className="icon d-flex mt-30">
                  <Image src={infoBox2Icon1Url} alt="logo" className="lazy-img me-4" width={43} height={43} />
                </div>
                <h4 className="tx-dark mt-20">{featuresData?.whyUsInfoBox2Title || "Certified by AWP..."}</h4>
              </div>
            </div>
          </div>
          <LetsTalkButton buttonText={featuresData?.whyUsButtonText || "More Details?"} href={featuresData?.whyUsButtonUrl || "/contact"} />
        </div>
      </div>

      <div className="col-lg-7 col-md-9 m-auto">
        <div className="illustration-holder md-mt-60 position-relative">
          <Image 
            src={mainImageUrl} 
            alt={featuresData?.whyUsMainImage?.alternativeText || "media"} 
            className="lazy-img main-img ms-auto" 
            width={680} 
            height={648}
            // FIX: This style prevents stretching by maintaining aspect ratio
            style={{ width: '100%', height: 'auto' }} 
          />
          <div className="card-style d-flex flex-column justify-content-center align-items-center">
            <h4 className="m0">{featuresData?.whyUsImageCardStat || "70b+"}</h4>
            <p className="m0 fs-18 tx-dark">{featuresData?.whyUsImageCardLabel || "Created revenue"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesBlock;