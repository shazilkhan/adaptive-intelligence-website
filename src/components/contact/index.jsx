"use client";

import BlockContact5 from "@/components/contact/BlockContact5";
import React from "react";
import Image from 'next/image';

const ContactV4 = ({ settings }) => {
  return (
    <>
      <div className="contact-section-four pt-180 md-pt-150">
        <div className="container">
          <div className="row">
            <div className="col-xxl-7 col-lg-6 col-md-7 m-auto">
              <div
                className="title-style-fourteen text-center mb-100 lg-mb-50"
                data-aos="fade-up"
              >

                <h2 className="main-title font-recoleta fw-normal text-white">
                  Our{" "}
                  <span className="position-relative">
                    team <Image src="/images/shape/shape_186.svg" alt="icon" width={20} height={20} />
                  </span>
                  is here to help you.
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <BlockContact5 settings={settings} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactV4;