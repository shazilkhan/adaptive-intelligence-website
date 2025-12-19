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
          <p className="fs-20 mt-15 mb-20">
            {featuresData?.whyUsDescription || "Lorem ipsum dolor sit amet..."}
          </p>
          <p className="fs-20 mt-15 mb-20">
            {featuresData?.whyUsDescription2 || "Lorem ipsum dolor sit amet..."}
          </p>
          <div className="info mb-50">
            <div className="row">

              {/* --- Icon 1 --- */}
              <div className="col-sm-6">
                <div className="icon mt-30">
                  {/* REPLACE href WITH YOUR LINK */}
                  <Link href="https://maps.app.goo.gl/s72NXE1sEAZNWk4Y7" target="_blank" rel="noopener noreferrer">
                    <Image
                      src={infoBox1IconUrl}
                      alt="logo"
                      className="lazy-img"
                      width={120} height={60}
                      style={{ cursor: 'pointer' }} // Adds a hand cursor on hover
                    />
                  </Link>
                </div>
                <h4 className="tx-dark mt-20">{featuresData?.whyUsInfoBox1Title || "Secure & trusted..."}</h4>
              </div>

              {/* --- Icon 2 --- */}
              <div className="col-sm-6">
                <div className="icon d-flex mt-30">
                  {/* REPLACE href WITH YOUR LINK */}
                  <Link href="https://clutch.co/profile/adaptive-intelligence-international" target="_blank" rel="noopener noreferrer">
                    <Image
                      src={infoBox2Icon1Url}
                      alt="logo"
                      className="lazy-img me-4"
                      width={70} height={70}
                      style={{ cursor: 'pointer' }}
                    />
                  </Link>
                </div>
                <h4 className="tx-dark mt-20">{featuresData?.whyUsInfoBox2Title || "Certified by AWP..."}</h4>
              </div>

            </div>
          </div>
          <div className="letstalk-btnn d-flex justify-content-center">
            <LetsTalkButton buttonText={featuresData?.whyUsButtonText || "More Details?"} href={featuresData?.whyUsButtonUrl || "/contact"} size="large" />
          </div>
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
        </div>
      </div>
    </>
  );
};

export default FeaturesBlock;