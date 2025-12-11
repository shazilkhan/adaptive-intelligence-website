"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import FooterContent from "@/components/footer/FooterContent";
import Subscribe from "@/components/footer/Subscribe";
import CopyrightFooter from "@/components/footer/CopyrightFooter";

const FooterWithSettings = () => {
  const { settings } = useSettings();

  return (
    <div className="footer-style-nine theme-basic-footer zn2 position-relative">
      <div className="bg-wrapper">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-2 footer-intro mb-40">
              <div className="logo">
                <Link href="/">
                  <Image
                    src={
                      settings?.logoFooter?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${settings.logoFooter.url}`
                        : "/images/logo/logo_06.svg"
                    }
                    alt="logo"
                    width={115}
                    height={80}
                  />
                </Link>
              </div>
            </div>
            <FooterContent />
            <div className="col-lg-4 mb-30 form-widget">
              <h5 className="footer-title fw-normal">Newsletter</h5>
              <h6 className="pt-15 pb-20 text-white">Join our newsletter</h6>
              <Subscribe />
              <div className="fs-14 mt-10 text-white opacity-50">
                We only send interesting and relevant emails.
              </div>
            </div>
          </div>
        </div>
      </div>
      <CopyrightFooter />

    </div>
  );
};

export default FooterWithSettings;