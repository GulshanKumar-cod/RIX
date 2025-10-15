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
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  // 🔹 Smooth auto-scroll effect for Suggested Companies
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollTo({ left: 0, behavior: "auto" });
      } else {
        container.scrollLeft += 1.5; // 👈 same speed as CompanyCarousel
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    const startScroll = () => {
      animationRef.current = requestAnimationFrame(scroll);
    };

    const stopScroll = () => {
      cancelAnimationFrame(animationRef.current);
    };

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      cancelAnimationFrame(animationRef.current);
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, []);

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

     

      {/* 🏢 Suggested Companies*/}
      <div style={{ marginBottom: "3rem" }}>
        <h3 className={styles.headingH3}>Featured Companies</h3>

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "1rem",
            paddingBottom: "0.5rem",
            scrollBehavior: "smooth",
          }}
        >
          {suggestedCompanies.map((company, i) => (
            <div
              key={i}
              style={{
                minWidth: "220px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "1rem",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {company.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                    margin: "0 0 0.4rem 0",
                  }}
                >
                  {company.industry}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#6c757d",
                    margin: 0,
                  }}
                >
                  {company.patents.toLocaleString()} innovations
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.8rem",
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
                    padding: "4px 10px",
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    border: "none",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => handleAddCompany(company)}
                  style={{
                    padding: "4px 10px",
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    border: "none",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    color: "#fff",
                    cursor: "pointer",
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

      {/* 📈 Main Weekly Companies Carousel */}
      <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <h3 className={styles.headingH3}>Companies Feed</h3>
        <CompanyCarousel data={sampleData} heading="" />
      </div>
    </div>
  );
};

export default PortfolioWeeklyCompany;
