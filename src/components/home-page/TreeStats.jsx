"use client";

import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// --- 1. The Individual Counter Item (Exact Replica) ---
const CounterItem = ({ data }) => {
  const [isInView, setIsInView] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  if (inView && !isInView) {
    setIsInView(true);
  }

  return (
    <div className="counter-block-five text-center mt-40" data-aos="fade-up" ref={ref}>
      <div className="main-count font-recoleta fw-light">
        {isInView ? (
          <CountUp
            start={0}
            end={data.value}
            duration={2}
            separator=","
            decimals={data.decimals || 0} // Added decimals support for Acres
          />
        ) : (
          data.value
        )}
        {data.symbol}
      </div>
      <p className="fs-18 mb-15">{data.title}</p>
      <span
        className="d-block rounded-circle cicrle m-auto"
        style={{ background: data.color }}
      />
    </div>
  );
};

// --- 2. The Main Component ---
const TreeStats = () => {
  const [loading, setLoading] = useState(true);
  // Default fallback stats
  const [stats, setStats] = useState({
    trees: 0,
    acres: 0,
    carbon: 0,
    bottles: 0
  });

  // --- Fetch Logic (Ported from your getStaticProps) ---
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const sheetId = '1ICb8PWttvv0leKmfmJWXSGhXkZz5UAxChmFamV_bh1c';
        const sheetName = 'Total%20Footprint';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

        const response = await fetch(url);

        if (response.ok) {
          const csvText = await response.text();
          const rows = csvText.replace(/"/g, '').split('\n').filter(row => row.trim() !== '');

          if (rows.length >= 2) {
            // Updated Logic: Find the "TOTALS" row directly instead of summing manually.
            // This mirrors the logic in src/pages/eco.js for consistency
            for (let i = 1; i < rows.length; i++) {
              const rowText = rows[i].trim();
              if (rowText === '') continue;

              const columns = rowText.split(',');
              // Remove quotes and whitespace for comparison
              const firstCol = columns[0]?.replace(/"/g, '').trim().toUpperCase();

              if (firstCol === 'TOTALS') {
                // Found the TOTALS row!
                // Columns: 0=Name, 1=Trees, 2=Acres, 3=Carbon, 4=Bottles
                const trees = parseFloat(columns[1]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;
                const acres = parseFloat(columns[2]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;
                const carbon = parseFloat(columns[3]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;
                const bottles = parseFloat(columns[4]?.replace(/"/g, '').replace(/,/g, '').trim()) || 0;

                setStats({
                  trees: trees,
                  acres: parseFloat(acres.toFixed(1)),
                  carbon: carbon,
                  bottles: bottles
                });
                break; // Stop after finding TOTALS
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tree stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // --- Map Data to UI Items ---
  const items = [
    {
      id: 1,
      title: "Trees Planted",
      value: stats.trees,
      symbol: "",
      color: "#4CAf50", // Green
      decimals: 0
    },
    {
      id: 2,
      title: "Acres Restored",
      value: stats.acres,
      symbol: "",
      color: "#8BC34A", // Light Green
      decimals: 1
    },
    {
      id: 3,
      title: "Tons of CO2 Absorbed",
      value: stats.carbon,
      symbol: "",
      color: "#009688", // Teal
      decimals: 0
    },
    {
      id: 4,
      title: "Bottles Removed",
      value: stats.bottles,
      symbol: "",
      color: "#2196F3", // Blue
      decimals: 0
    },
  ];

  // Determine column size (standard logic from original component)
  const columnClass = items.length === 5
    ? "col-lg col-sm-6"
    : "col-lg-3 col-sm-6";

  if (loading) return null; // Or return a loader skeleton if you prefer

  return (
    <div className="row">
      {items.map((item) => (
        <div className={columnClass} key={item.id}>
          <CounterItem data={item} />
        </div>
      ))}
    </div>
  );
};

export default TreeStats;