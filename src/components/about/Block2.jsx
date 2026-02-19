import Image from "next/image";
import React from "react";
import { getStrapiMediaUrl } from "@/utils/strapi";

const Block2 = ({ cards }) => {
  const items = cards || [];

  return (
    <>
      {items.map((card, index) => {
        const iconUrl = getStrapiMediaUrl(card.icon?.url) || "/images/icon/icon_175.svg";

        return (
          <div
            key={card.id || index}
            className="col-lg-4 col-sm-6"
            data-aos="fade-up"
            data-aos-delay={index * 100} // Dynamic delay for staggered animation
          >
            <div className="card-style-twentySix text-center mt-25">
              <div className="icon rounded-circle m-auto d-flex align-items-center justify-content-center">
                <Image
                  width={31}
                  height={30}
                  src={iconUrl}
                  alt={card.title}
                  className="lazy-img"
                />
              </div>
              <h5 className="tx-dark mt-40 lg-mt-30 mb-5">{card.title}</h5>
              <p className="fs-18">{card.description}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Block2;