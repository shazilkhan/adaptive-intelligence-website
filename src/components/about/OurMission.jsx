import Image from "next/image";
import React from "react";

const OurMission = ({ data }) => {
  if (!data) return null;

  const image1Url = data.missionImage1?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.missionImage1.url}`
    : '/images/media/img_97.jpg';

  const image2Url = data.missionImage2?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.missionImage2.url}`
    : '/images/media/img_98.jpg';

  const image3Url = data.missionImage3?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.missionImage3.url}`
    : '/images/media/img_99.jpg';

  const image4Url = data.missionImage4?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.missionImage4.url}`
    : '/images/media/img_100.jpg';

  // Helper function to highlight a word in the quote
  const highlightWord = (text, wordToHighlight) => {
    if (!wordToHighlight) return text;
    const parts = text.split(new RegExp(`(${wordToHighlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === wordToHighlight.toLowerCase() 
        ? <span key={i}>{part}</span> 
        : part
    );
  };

  return (
    <>
      <div className="row align-items-end">
        <div className="col-lg-5 col-md-6 order-md-last ms-auto">
          <div className="feedback-block-thirteen mb-50" data-aos="fade-left">
            <div className="icon rounded-circle d-flex align-items-center justify-content-center">
              <Image
                width={24}
                height={22}
                src="/images/icon/icon_42.svg"
                alt="icon"
              />
            </div>
            <p className="font-recoleta tx-dark mt-60 mb-65 lg-mt-40 lg-mb-40">
              {highlightWord(data.missionQuote, data.missionQuoteHighlight)}
            </p>
            <h6 className="tx-dark fs-20">
              - {data.missionAuthorName}.{" "}
              <span className="fs-18 fw-normal opacity-50">
                {data.missionAuthorTitle}
              </span>
            </h6>
          </div>
        </div>

        <div className="col-md-6 order-md-first" data-aos="fade-right">
          <div className="row align-items-end">
            <div className="col-sm-6">
              <div className="img-meta mb-50 lg-mb-40">
                <Image
                  width={312}
                  height={332}
                  style={{ objectFit: "cover" }}
                  src={image1Url}
                  alt="mission image 1"
                  className="lazy-img w-100"
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="img-meta position-relative mb-50 lg-mb-40">
                <Image
                  width={312}
                  height={403}
                  style={{ objectFit: "cover" }}
                  src={image2Url}
                  alt="mission image 2"
                  className="lazy-img w-100"
                />
                <div
                  className="rating d-flex flex-column align-items-center justify-content-center"
                  data-aos="fade-up"
                >
                  <div className="font-recoleta tx-dark rating-value">
                    {data.missionRating || '4.8'}
                  </div>
                  <div className="fs-18 tx-dark">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-end" data-aos="fade-up">
        <div className="col-sm-4">
          <div className="img-meta mb-50 lg-mb-40">
            <Image
              width={424}
              height={295}
              style={{ objectFit: "cover" }}
              src={image3Url}
              alt="mission image 3"
              className="lazy-img w-100"
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="img-meta position-relative">
            <Image
              width={648}
              height={436}
              style={{ objectFit: "cover" }}
              src={image4Url}
              alt="mission image 4"
              className="lazy-img w-100"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OurMission;