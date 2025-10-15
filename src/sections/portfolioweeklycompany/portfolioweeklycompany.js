import React, { useState, useRef, useEffect } from "react";
import styles from "../companylist/companylist.module.css";
import { CompanyCarousel } from "@/components/companycarousel/companycarousel";

const suggestedCompanies = [
  { name: "SpaceX", industry: "Aerospace", patents: 320 },
  { name: "BYD", industry: "EV Manufacturing", patents: 280 },
  { name: "Tata Motors", industry: "Automotive", patents: 190 },
  { name: "Apple", industry: "Consumer Electronics", patents: 540 },
  { name: "IBM", industry: "Quantum Computing", patents: 720 },
  { name: "Intel", industry: "Semiconductors", patents: 650 },
  { name: "Ford", industry: "Automotive", patents: 310 },
];

const sampleData = [
  {
    companyName: "Tesla",
    country: "USA",
    industry1: "EV & Battery Tech",
    industry2: "Autonomous Vehicles",
    technologiesCount: 120,
    topInventor: "Elon Musk",
  },
  {
    companyName: "Samsung",
    country: "South Korea",
    industry1: "Semiconductors",
    industry2: "Consumer Electronics",
    technologiesCount: 95,
    topInventor: "Kim Min-Soo",
  },
  {
    companyName: "Siemens",
    country: "Germany",
    industry1: "Industrial Automation",
    industry2: "Energy Tech",
    technologiesCount: 80,
    topInventor: "Johann Bauer",
  },
  {
    companyName: "Sony",
    country: "Japan",
    industry1: "Electronics",
    industry2: "Entertainment",
    technologiesCount: 65,
    topInventor: "Hiroshi Tanaka",
  },
  {
    companyName: "Nvidia",
    country: "USA",
    industry1: "AI & GPUs",
    industry2: "Autonomous Driving",
    technologiesCount: 110,
    topInventor: "Jensen Huang",
  },
  {
    companyName: "Ola Electric",
    country: "India",
    industry1: "EV Manufacturing",
    industry2: "Mobility Solutions",
    technologiesCount: 40,
    topInventor: "Bhavish Aggarwal",
  },
];

const PortfolioWeeklyCompany = () => {
  const [selectedView, setSelectedView] = useState("weekly");

  const handleAddCompany = (company) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("portfolioStartups")) || [];
      const isDuplicate = existing.some((c) => c.name === company.name);

      if (!isDuplicate) {
        const updated = [...existing, company];
        localStorage.setItem("portfolioStartups", JSON.stringify(updated));
        alert(`${company.name} added to portfolio.`);
      } else {
        alert(`${company.name} is already in your portfolio.`);
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  return (
    <div>
      <hr className="mb-5" />

      {/* Suggested Companies */}
      <div style={{ marginBottom: "3rem" }}>
        <h3 className={styles.headingH3}>Featured Companies</h3>

        <div className={styles.featuredContainer}>
            {suggestedCompanies.map((company, i) => (
              <div key={`${company.name}-${i}`} className={styles.industryCardCompany}>
                <div>
                  <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>
                    {company.name}
                  </h4>
                  <p
                    style={{
                      background: "#1e2a3a",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      marginTop: "0.8rem",
                      marginBottom: "0.8rem",
                      display: "flex",
                      width: "fit-content",
                      gap: "0.5rem",
                    }}
                  >
                    {company.industry}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#4da6ff",
                      textShadow: "0 0 3px #4da6ff",
                    }}
                  >
                    {company.patents.toLocaleString()} innovations
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <button
                    onClick={() =>
                      window.open(
                        `https://dyr.incubig.org/company-page/${encodeURIComponent(
                          company.name
                        )}/overview`,
                        "_blank"
                      )
                    }
                    style={{
                      color: "#fff",
                      cursor: "pointer",
                      background: "linear-gradient(90deg, #007bff, #00bfff)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 12px",
                      fontSize: ".8rem",
                      marginTop: "10px",
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAddCompany(company)}
                    style={{
                      color: "#fff",
                      cursor: "pointer",
                      background: "linear-gradient(90deg, #007bff, #00bfff)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 12px",
                      fontSize: ".8rem",
                      marginTop: "10px",
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 🔹 Toggle Dropdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <select
          id="dataToggle"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "#1a2332",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/*  Main Weekly Companies Carousel */}
      <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <h3 className={styles.headingH3}>Companies Feed</h3>
        <CompanyCarousel data={sampleData} heading="" />
      </div>
    </div>
  );
};

export default PortfolioWeeklyCompany;
