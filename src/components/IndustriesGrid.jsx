// src/components/IndustriesGrid.jsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { getStrapiApiUrl, getStrapiMediaUrl } from "@/utils/strapi";

const IndustriesGrid = () => {
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIndustries = async () => {
      setIsLoading(true);
      try {
        const apiUrl = `${getStrapiApiUrl()}/api/industries?populate=*&sort=order:asc`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch industries');
        const json = await res.json();

        const formattedIndustries = (json.data || []).map(item => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            name: attrs.name,
            description: attrs.description || "Strategic campaigns and content tailored for this industry.",
            imageUrl: getStrapiMediaUrl(attrs.image?.url) || '/images/icon/innovation.png'
          };
        });
        setIndustries(formattedIndustries);
      } catch (error) {
        console.error("Error fetching industries:", error);
        setIndustries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  if (isLoading) {
    return <p className="text-center text-white opacity-50">Loading industries...</p>;
  }

  if (industries.length === 0) return null;

  return (
    <>
      <div className="capabilities-grid-enhanced">
        {industries.map((industry) => (
          <div key={industry.id} className="capability-card-enhanced industry-card">

            {/* ICON (Centered Top) */}
            <div className="capability-icon">
              <Image
                src={industry.imageUrl}
                alt={`${industry.name} icon`}
                width={50}
                height={50}
              />
            </div>

            {/* CONTENT (Centered) */}
            <div className="capability-content text-center mt-4">
              <h4 className="text-white mb-3 font-recoleta fw-normal">{industry.name}</h4>
              <p className="text-white opacity-75 fs-16 lh-base mb-0">
                {industry.description}
              </p>
            </div>

          </div>
        ))}
      </div>

      <style jsx>{`
        /* --- GRID LAYOUT --- */
        .capabilities-grid-enhanced {
          display: grid;
          /* 4 Columns on Desktop */
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        /* --- CARD STYLE --- */
        .capability-card-enhanced {
          background: #1e2246; /* Slightly lighter than section bg */
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 40px 30px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .capability-card-enhanced:hover {
          background: #242954;
          transform: translateY(-5px);
          border-color: #FF1292;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        /* --- ICON CIRCLE --- */
        .capability-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px solid rgba(255, 18, 146, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }

        .capability-card-enhanced:hover .capability-icon {
           background: #FF1292;
           border-color: #FF1292;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 1200px) {
           .capabilities-grid-enhanced {
              grid-template-columns: repeat(3, 1fr); /* 3 cols on laptop */
           }
        }

        @media (max-width: 991px) {
           .capabilities-grid-enhanced {
              grid-template-columns: repeat(2, 1fr); /* 2 cols on tablet */
           }
        }

        @media (max-width: 576px) {
           .capabilities-grid-enhanced {
              grid-template-columns: 1fr; /* 1 col on mobile */
           }
           .capability-card-enhanced {
              padding: 30px 20px;
           }
        }
      `}</style>
    </>
  );
};

export default IndustriesGrid;