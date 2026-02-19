import Image from "next/image";
import { getStrapiMediaUrl } from "@/utils/strapi";

const SuccessStory = ({ successStoryData }) => {
  // Story 1 data
  const story1Image = getStrapiMediaUrl(successStoryData?.successStory1Image?.url) || "/images/assets/krakenimages-Y5bvRlcCx8k-unsplash.jpg";

  const story1ImageAlt = successStoryData?.successStory1Image?.alternativeText || "Customer story";
  const story1QuoteStart = successStoryData?.successStory1QuoteStart || "WordPress has been a great success—with";
  const story1QuoteHighlight = successStoryData?.successStory1QuoteHighlight || "WordPress VIP";
  const story1QuoteEnd = successStoryData?.successStory1QuoteEnd || "giving us that enterprise";
  const story1AuthorName = successStoryData?.successStory1AuthorName || "Eric D. Garcia";
  const story1AuthorCompany = successStoryData?.successStory1AuthorCompany || "";

  // Rating data
  const ratingValue = successStoryData?.successStoriesRatingValue || "4.8";
  const ratingLabel = successStoryData?.successStoriesRatingLabel || "Rating";

  // Story 2 data
  const story2AuthorName = successStoryData?.successStory2AuthorName || "Hasan Jannat.";
  const story2AuthorCompany = successStoryData?.successStory2AuthorCompany || "Pran inc.";
  const story2QuoteStart = successStoryData?.successStory2QuoteStart || "";
  const story2QuoteHighlight = successStoryData?.successStory2QuoteHighlight || "Conversation";
  const story2QuoteEnd = successStoryData?.successStory2QuoteEnd || "has been a great success with top assured quality.";

  // Customer count data
  const customerCount = successStoryData?.successStoriesCustomerCount || "32k";
  const customerLabel = successStoryData?.successStoriesCustomerLabel || "Customer";

  return (
    <>
      <div className="wrapper position-relative zn2 pt-70 pb-100 mt-90 md-mt-40">
        <div className="container">
          <div className="feedback-block-nine text-lg-end position-relative">
            <div className="row">
              <div
                className="col-xl-6 col-lg-7 order-lg-last"
                data-aos="fade-left"
              >
                <p className="mb-35 sucess-text">
                  "{story1QuoteStart} <span style={{ color: "#FF1292" }}>{story1QuoteHighlight}</span> {story1QuoteEnd}"
                </p>
                <h4 className="text-white fw-normal m0">
                  {story1AuthorName === "Eric Garcia" || story1AuthorName === "Eric D. Garcia" ? (
                    <a href="http://ericgarciafl.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      Eric D. Garcia
                    </a>
                  ) : (
                    story1AuthorName
                  )} <span className="opacity-75">{story1AuthorCompany}</span>
                </h4>
              </div>
              <div className="col-xl-6 col-lg-5 col-md-6 m-auto order-lg-first success-image">
                <Image
                  src={story1Image}
                  alt={story1ImageAlt}
                  className="lazy-img img-one md-mt-40"
                  data-aos="fade-up"
                  width={499}
                  height={631}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessStory;