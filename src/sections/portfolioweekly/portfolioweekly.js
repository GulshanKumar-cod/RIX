import React, { useState } from "react";
import styles from "../companylist/companylist.module.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { CompanyCarousel } from "@/components/companycarousel/companycarousel";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

const industries = [
  {
    rank: 1,
    name: "EV & Battery Tech",
    change: "+18%",
    patents: 13,
    tags: ["AI-driven optimization"],
    history: [5, 7, 9, 11, 13],
  },
  {
    rank: 2,
    name: "Autonomous Vehicles",
    change: "+44%",
    patents: 20,
    tags: ["Mobility AI", "Sensor Fusion"],
    history: [8, 10, 14, 18, 20],
  },
  {
    rank: 3,
    name: "AI for EV",
    change: "+44%",
    patents: 26,
    tags: ["Predictive BMS", "Anomaly detection"],
    history: [10, 13, 18, 22, 26],
  },
  {
    rank: 4,
    name: "Hydrogen Fuel Cells",
    change: "+36%",
    patents: 11,
    tags: ["Closed-loop", "Hydrometallurgy"],
    history: [4, 6, 7, 10, 11],
  },
  {
    rank: 5,
    name: "Lithium Recycling",
    change: "+30%",
    patents: 15,
    tags: ["Closed-loop", "Hydrometallurgy"],
    history: [6, 8, 12, 14, 15],
  },
  {
    rank: 6,
    name: "Hydrogen Fuel Cells",
    change: "-25%",
    patents: 11,
    tags: ["PEM stacks", "Green H2"],
    history: [12, 14, 13, 12, 11],
  },
];

const weeks = [
  "Aug 18 – Aug 24, 2025",
  "Aug 25 – Aug 31, 2025",
  "Sep 01 – Sep 07, 2025",
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

const PortfolioWeekly = () => {
  const [selectedWeek, setSelectedWeek] = useState(weeks[1]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    console.log("Refreshed data for:", selectedWeek);
  };

  return (
    <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>
          {/* Header */}
          <div className={styles.weeklyHeader}>
            <h3 className={styles.headingH3}>Weekly Trends</h3>

            <div className={styles.weeklyControls}>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className={styles.weeklySelect}
              >
                {weeks.map((week, i) => (
                  <option key={i} value={week}>
                    {week}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRefresh}
                className={styles.weeklyRefreshBtn}
              >
                Refresh
              </button>
            </div>
          </div>

           <hr className="mb-5" />

          <h4 className={styles.weeklySubheading}>Top Industries</h4>

          {/* Cards */}
          <div className={styles.weeklyGrid}>
            {industries.map((ind, idx) => {
              const chartData = {
                labels: ind.history.map((_, i) => `W${i + 1}`),
                datasets: [
                  {
                    data: ind.history,
                    borderColor: "#00bfff",
                    backgroundColor: "rgba(0,191,255,0.2)",
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                  },
                ],
              };

              const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false },
                },
                scales: {
                  x: { display: false },
                  y: { display: false },
                },
              };

              return (
                <div
                  key={idx + refreshKey}
                  style={{
                    background: "transparent",
                    border: "0.5px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "1.2rem",
                    color: "white",
                    fontFamily: "DM Sans, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  className={styles.industryCard}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: "14px", opacity: 0.7 }}>
                      #{ind.rank}
                    </span>
                    <span
                      style={{
                        color: ind.change.startsWith("+")
                          ? "#00ff88"
                          : "#ff4d4d",
                      }}
                    >
                      WoW {ind.change}
                    </span>
                  </div>

                  <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>
                    {ind.name}
                  </h4>

                  <p style={{ fontSize: "14px", opacity: 0.8 }}>
                    Active Companies: {ind.patents}
                  </p>

                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {ind.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#1e2a3a",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Chart.js mini line chart */}
                  <div style={{ marginTop: "1rem", height: "70px" }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>

                  <button
                    style={{
                      marginTop: "1rem",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "#1a2332",
                      color: "#00bfff",
                      border: "none",
                      cursor: "pointer",
                      alignSelf: "flex-end",
                    }}
                  >
                    View companies
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
            <h4 className={styles.weeklySubheading}>Top Companies</h4>
            <CompanyCarousel data={sampleData} heading="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWeekly;
