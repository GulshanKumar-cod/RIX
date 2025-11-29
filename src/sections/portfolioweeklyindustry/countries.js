"use client";
import React from "react";
import { Globe2 } from "lucide-react";
import SimpleMap from "@/components/worldmap/worldmap";
import styles from "../companylist/companylist.module.css";

const CountriesTab = ({ selectedIndustry, activeTab}) => {
  // Sample summary data 
  const summary = {
    totalCountries: 72,
    topCountry: "USA",
    growth: "+18% YoY",
  };

  // Map data (ISO codes + patent values) 
  const mapData = [
    ["US", 28450],
    ["CN", 25300],
    ["DE", 19800],
    ["JP", 16400],
    ["KR", 12200],
  ];

  // Table data 
  const countryData = [
    {
      rank: 1,
      country: "USA",
      patents: "28,450",
      topCompanies: "Tesla, Ford, GM",
      hotTech: "EVs, ADAS",
    },
    {
      rank: 2,
      country: "China",
      patents: "25,300",
      topCompanies: "BYD, NIO, CATL",
      hotTech: "Batteries, Charging",
    },
    {
      rank: 3,
      country: "Germany",
      patents: "19,800",
      topCompanies: "BMW, Bosch",
      hotTech: "Autonomous",
    },
    {
      rank: 4,
      country: "Japan",
      patents: "16,400",
      topCompanies: "Toyota, Honda",
      hotTech: "Hydrogen Vehicles",
    },
    {
      rank: 5,
      country: "South Korea",
      patents: "12,200",
      topCompanies: "Hyundai, LG Chem",
      hotTech: "EV Components",
    },
  ];

  return (
    <div
      style={{
        background: "transparent",
        marginBottom: "5rem"
      }}
    >
      {/* HEADER */}
      <p
        style={{
          color: "#fff",
          marginBottom: "1.5rem",
        }}
         className={styles.statsLabel}
      >
        {selectedIndustry?.descriptionsByTab?.[activeTab] ??
    "No description available for this section."}
      </p>

     {/* SUMMARY BOXES  */}
<section className={styles.statsSection}>
  {[
    { label: "Active Countries", value: summary.totalCountries },
    { label: "Leading Country", value: summary.topCountry },
    { label: "Innovation Growth", value: summary.growth },
  ].map((item, index) => (
    <div className={styles.statsCard} key={index}>
      <h3 className={styles.statsValue}>{item.value}</h3>
      <p className={styles.statsLabel}>{item.label}</p>
    </div>
  ))}
</section>


      {/*  INTERACTIVE WORLD MAP */}
     <div
  style={{
    background: "transparent",
    borderRadius: "10px",
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "center",
  }}
>

     <SimpleMap
  data={mapData}
  color="#4a90e2"
  backgroundColor="transparent"
  borderColor="#ccc"
  label={`${selectedIndustry?.name || "Industry"} Innovation Density`}
/>

      </div>

      {/* TABLE */}
     <div style={{ overflowX: "auto", marginBottom: "1.5rem"}}>
        <h3 className={styles.headingH3} style={{marginBottom: "1rem"}}>Global Rankings</h3>
  <table
    className={styles.portfolioTable}
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "800px", 
    }}
  >
    <thead>
      <tr>
        <th style={thStyle}>Rank</th>
        <th style={thStyle}>Country</th>
        <th style={thStyle}>Patents (5Y)</th>
        <th style={thStyle}>Top Companies</th>
        <th style={thStyle}>Hot Technologies</th>
      </tr>
    </thead>
    <tbody>
      {countryData.map((row) => (
        <tr key={row.rank}>
          <td style={tdStyle}>{row.rank}</td>
          <td style={tdStyle}>{row.country}</td>
          <td style={tdStyle}>{row.patents}</td>
          <td style={tdStyle}>{row.topCompanies}</td>
          <td style={tdStyle}>{row.hotTech}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* INSIGHT TEXT */}
      <p
        className={styles.statsLabel} style={{fontWeight: "normal",lineHeight: "1.6", marginBottom: "1.5rem",}}
      >
        China and the U.S. dominate vehicle innovation, accounting for over 45%
        of patents. Growth is strongest in battery technology (especially
        solid-state) and connected vehicle software. India and Korea show rising
        innovation density, particularly in lightweight materials and smart
        mobility platforms.
      </p>

      {/* CTA BUTTON  */}
     <button
  style={{
    background: "linear-gradient(90deg, #007bff, #00bfff)",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
    maxWidth: "200px",     
    display: "block",
    margin: "0 auto",       
  }}
>
  1-Click Insight
</button>

    </div>
  );
};

export default CountriesTab;

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #444",
  color: "#aaa",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
};
