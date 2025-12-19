"use client";

import Image from "next/image";
import Link from "next/link";

const BlockContact5 = ({ settings }) => {
  const handleChat = (e) => {
    e.preventDefault();
    if (window.Intercom) {
      window.Intercom('show');
    } else if (window.Tawk_API) {
      window.Tawk_API.maximize();
    } else {
      alert("Please click the chat icon in the bottom right corner to start a chat.");
    }
  };

  const addressBlocks = [
    {
      icon: "/images/icon/icon_178.svg",
      title: settings?.addressTitle || "Address",
      content: settings?.address || "244 5th Ave Suite A269 Floor 2, New York, NY 10001",
      link: "#contact",
      delay: "100",
    },
    {
      icon: "/images/icon/icon_132.svg",
      title: "Chat",
      content: "Chat with our team",
      action: handleChat,
      delay: "200",
    },
    {
      icon: "/images/icon/phone-call.png",
      title: "Call",
      content: settings?.phoneNumber || "800.985.7395",
      link: `tel:${settings?.phoneNumber || "800.985.7395"}`,
      delay: "300",
    },
    {
      icon: "/images/icon/icon_179.svg",
      title: "Contact",
      content: "Send us a message",
      link: "#contact",
      delay: "400",
    },
  ];

  return (
    <>
      <style jsx global>{`
        /* 1. Base Icon Style */
        .address-block-two .icon {
          transition: all 0.3s ease;
          background: transparent;
          border: 1px solid #FFFFFF !important;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
        }

        /* 3. Hover Effect */
        .address-block-two:hover .icon {
          background: #FF1292 !important;
          border-color: #FF1292 !important;
        }

        .clickable-block {
          cursor: pointer;
          display: block;
          height: 100%;
          text-decoration: none; 
        }
        
        .title {
            margin-bottom: 15px;
            font-weight: 500;
        }
      `}</style>
      {addressBlocks.map((block, index) => (
        <div
          className="col-lg-3 col-md-6"
          key={index}
          data-aos="fade-up"
          data-aos-delay={block.delay}
        >
          {block.action ? (
            <div onClick={block.action} className="address-block-two text-center mb-40 clickable-block">
              <div className="icon border rounded-circle d-flex align-items-center justify-content-center m-auto">
                <Image
                  width={30}
                  height={30}
                  src={block.icon}
                  alt="icon"
                  style={{
                    color: 'transparent',
                    userSelect: 'none',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <h5 className="title text-white">{block.title}</h5>
              <p className="text-white">{block.content}</p>
            </div>
          ) : (
            <Link href={block.link || "#"} className="address-block-two text-center mb-40 clickable-block">
              <div className="icon border rounded-circle d-flex align-items-center justify-content-center m-auto">
                <Image
                  width={30}
                  height={30}
                  src={block.icon}
                  alt="icon"
                  style={{
                    color: 'transparent',
                    userSelect: 'none',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <h5 className="title text-white">{block.title}</h5>
              <p className="text-white">{block.content}</p>
            </Link>
          )}
        </div>
      ))}
    </>
  );
};

export default BlockContact5;