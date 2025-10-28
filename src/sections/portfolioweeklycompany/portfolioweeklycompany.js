import React, { useState, useEffect } from "react";
import styles from "../companylist/companylist.module.css";
import { CompanyCarousel } from "@/components/companycarousel/companycarousel";
import InsightsView from "@/components/insightsview/insightsview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const suggestedCompanies = [
  { name: "SpaceX", industry: "Aerospace", country: "USA", patents: 320,industries: 1150, technologies: 980,change: "+18%", },
  { name: "BYD", industry: "EV Manufacturing", country: "China", patents: 280, industries: 2316, technologies: 1500,change: "+44%" },
  { name: "Tata Motors", industry: "Automotive", country: "India", patents: 190, industries: 980, technologies: 760,change: "+36%", },
  { name: "Apple", industry: "Consumer Electronics", country: "USA", patents: 540, industries: 7652,technologies: 6300, change: "+12%" },
  { name: "IBM", industry: "Quantum Computing", country: "USA", patents: 720,industries: 8900, technologies: 7500,change: "+8%" },
  { name: "Intel", industry: "Semiconductors", country: "USA", patents: 650, industries: 4320, technologies: 3900,change: "+15%" },
  { name: "Ford", industry: "Automotive", country: "USA", patents: 310, industries: 2100, technologies: 1800,change: "+20%" },
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
  const [showInsights, setShowInsights] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("Fetching innovation activity data...");


  // Simulate progress bar before showing insights
 useEffect(() => {
  if (isLoading) {
    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        let next = prev + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          setIsLoading(false);
          next = 100;
        }

        // 🔹 Update message based on progress stage
        if (next < 25) {
          setProgressMessage("Fetching innovation activity data...");
        } else if (next < 50) {
          setProgressMessage("Analyzing industries and emerging technologies...");
        } else if (next < 75) {
          setProgressMessage("Processing inventor networks...");
        } else {
          setProgressMessage("Generating intelligence report...");
        }

        return next;
      });
    }, 60);

    return () => clearInterval(progressInterval);
  }
}, [isLoading]);


  // Add company to portfolio
  const handleAddCompany = (company) => {
    try {
      const existing = JSON.parse(localStorage.getItem("portfolioStartups")) || [];
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
      <hr className="mb-4" />

      {/* Suggested Companies */}
      <div style={{ marginBottom: "3rem" }}>
        <h3 className={styles.headingH3}>Featured Companies</h3>

        <div className={styles.featuredContainer}>
          {suggestedCompanies.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className={styles.industryCardCompany}
            >
              <div>
                 <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>
                  {company.name}
                </h4>
                  <span
                    style={{
                      color: company.change.startsWith("+") ? "#00ff88" : "#ff4d4d",
                       margin: "0.5rem 0", fontSize: "18px" 
                    }}
                  >
                    {company.change}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    margin: "0.8rem 0",
                  }}
                >
                  <span
                    style={{
                      background: "#2c3e50",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      color: "#fff",
                    }}
                  >
                    {company.country || "N/A"}
                  </span>
                  <span
                    style={{
                      background: "#1e2a3a",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      color: "#fff",
                    }}
                  >
                    {company.industry}
                  </span>
                </div>

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

              {/* Buttons Row */}
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

              {/* 1-Click Insights Button */}
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    setCurrentCompany(company);
                    setShowInsights(true);
                    setIsLoading(true);
                    setProgress(0);
                  }}
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: ".8rem",
                  }}
                >
                  1-Click Insights
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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h3 className={styles.headingH3}>Companies Feed</h3>

        <select
          id="dataToggle"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Main Weekly Companies Carousel */}
      <div style={{ marginTop: "0rem", marginBottom: "3rem" }}>
        <CompanyCarousel data={sampleData} heading="" />
      </div>

      {/* Insights Popup Modal  */}
         {showInsights && currentCompany && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#000",
              color: "#fff",
              border: "1px solid #4da6ff",
              boxShadow: "0 0 12px rgba(77, 166, 255, .3)",
              borderRadius: "10px",
              padding: "20px",
              width: "90%",
              maxWidth: "900px",
              height: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowInsights(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#4da6ff",
              }}
            >
              ×
            </button>

            {/* Loading / Insights */}
            <div style={{ marginTop: "40px", textAlign: "center", fontSize: "0.8rem" }}>
              {isLoading ? (
                <div>
                 <p style={{ marginBottom: "10px", color: "#fff", fontSize: "0.8rem" }}>
  {progressMessage}
</p>
                  <div
                    style={{
                      height: "10px",
                      width: "100%",
                      background: "#1a1a1a",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #007bff, #00bfff)",
                        transition: "width 0.2s ease",
                      }}
                    ></div>
                  </div>
                  <p style={{ marginTop: "5px", fontSize: "0.75rem", color: "#4da6ff" }}>
                    {progress}%
                  </p>
                </div>
              ) : (
                <InsightsView company={currentCompany} />
              )}
            </div>

            {/* Actions */}
            {/* {!isLoading && (
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <button
                  onClick={handleShareInsights}
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: ".8rem",
                  }}
                >
                  Share
                </button>
                <button
                  onClick={handleDownloadReport}
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontSize: ".8rem",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWeeklyCompany;
