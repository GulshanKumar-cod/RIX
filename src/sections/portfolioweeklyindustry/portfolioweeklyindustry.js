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

const PortfolioWeeklyIndustry = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedView, setSelectedView] = useState("weekly");

  return (
    <div>
      {/* <div className={styles.pagePadding}> */}
      {/* Header */}
      {/* <div className={styles.weeklyHeader}>
        <h3 className={styles.headingH3} style={{marginTop: "1rem", marginBottom: "0rem"}}>Weekly Trends</h3>

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
          <button onClick={handleRefresh} className={styles.weeklyRefreshBtn}>
            Refresh
          </button>
        </div>
      </div> */}

      {/* <h3 className={styles.headingH3}>Top Industries</h3> */}
      <hr className="mb-5" />

      {/* Filter Toggle for Weekly / Monthly */}
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
        <label
          htmlFor="dataToggle"
          style={{ color: "#fff", marginRight: "0.5rem", fontSize: "0.8rem" }}
        >
          View:
        </label>
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
            fontSize: "14px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Cards */}
      <div className={styles.weeklyGrid}>
        {industries.map((ind, idx) => {
          const chartData = {
            labels:
              selectedView === "weekly"
                ? ind.history.map((_, i) => `W${i + 1}`)
                : ind.history.map((_, i) => `M${i + 1}`),
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  #{ind.rank}
                </span>
                {/* <span
                  style={{
                    color: ind.change.startsWith("+") ? "#00ff88" : "#ff4d4d",
                  }}
                >
                  WoW {ind.change}
                </span> */}
              </div>

              <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>
                {ind.name}
              </h4>

              <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>
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
                      fontSize: "0.8rem",
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
    </div>
  );
};

export default PortfolioWeeklyIndustry;
