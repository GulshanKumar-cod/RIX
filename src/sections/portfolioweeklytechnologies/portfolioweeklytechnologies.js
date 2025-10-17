"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "../companylist/companylist.module.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PortfolioWeeklyTechnologies = ({ goToCompanyPage, handleAddCompany }) => {

  const [showFullTitle, setShowFullTitle] = useState(false);

  const fullTitle =
  "Adapted for proprietary or special purpose networking environments, e.g. medical networks, sensor networks, networks in a car or remote metering networks";

const maxWords = 8; // ✅ Change this to control how many words are shown

const truncatedTitle = fullTitle
  .split(" ")
  .slice(0, maxWords)
  .join(" ") + "...";

  // ✅ Trend data
  const trendData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Growth",
        data: [25, 35, 45, 55, 52, 58, 60, 64, 68, 72, 75, 78],
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "#007bff";
          const gradient = canvasCtx.createLinearGradient(
            chartArea.left,
            0,
            chartArea.right,
            0
          );
          gradient.addColorStop(0, "rgb(0, 123, 255)");
          gradient.addColorStop(1, "rgb(0, 191, 255)");
          return gradient;
        },
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
     x: {
      grid: { display: false },
      ticks: {
        display: false, 
        color: "rgba(180,180,200,0.6)",
        font: { size: 10 },
      },
    },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { display: false },
      },
    },
  };

  return (
    <div style={{ marginBottom: "5rem" }}>
      <hr className="mb-4" />

      <h3 className={styles.headingH3}>Technologies Feed</h3>

      <div
        style={{
          background: "transparent",
          color: "#fff",
          borderRadius: "16px",
          padding: "1rem",
          width: "100%",
          maxWidth: "420px",
          fontFamily: "Inter, sans-serif",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "2rem", 
        }}
      >
        {/* ===== TITLE ===== */}
     <h4
  style={{
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "1.5",
    margin: "0.5rem 0",
  }}
>
  {showFullTitle ? fullTitle : truncatedTitle}{" "}
  <span
    onClick={() => setShowFullTitle(!showFullTitle)}
    style={{
      color: "#00bfff",
      cursor: "pointer",
      fontSize: "0.8rem",
      marginLeft: "8px",
    }}
  >
    {showFullTitle ? "Read less" : "Read more"}
  </span>
</h4>

        <hr
          style={{ borderColor: "rgba(255,255,255,0.08)", margin: "1rem 0" }}
        />

        {/* ===== METRICS ===== */}
          <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
         <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#4da6ff",
                    textShadow: "0 0 3px #4da6ff",
                  }}
                >
                  Organizations: 147
                </p>
         <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#4da6ff",
                    textShadow: "0 0 3px #4da6ff",
                  }}
                >
                  Innovations: 892
                </p>
        {/* <Metric label="Organizations" value="147" />
        <Metric label="Innovations" value="892" /> */}
      </div>

        {/* ===== TREND BAR ===== */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.6rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <BarChart3 size={14} color="#00bfff" />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#a5b0d0",
                }}
              >
                12-Month Trend
              </span>
            </div>
            <span style={{ color: "#00bfff", fontSize: "0.8rem" }}>
              ↑ 34.5%
            </span>
          </div>

          <div style={{ height: "90px" }}>
            <Bar data={trendData} options={trendOptions} />
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className={styles.cardAction} style={{marginBottom: "1.5rem"}}>
          <button
            className={styles.viewButton}
            onClick={() => goToCompanyPage(item.name)}
          >
            Deep Dive
          </button>
          <button
            className={styles.addPortfolio}
            onClick={(e) => {
              e.stopPropagation();
              handleAddCompany(item);
            }}
          >
            + Add
          </button>
        </div>

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



    </div>
  );
};

export default PortfolioWeeklyTechnologies;

/* ===== Helper Components ===== */

const Metric = ({ label, value, highlight }) => (
  <div style={{ flex: 1 }}>
    <p
      style={{
        fontSize: "0.8rem",
        textTransform: "uppercase",
        color: "#94a3b8",
        marginBottom: "0.25rem",
      }}
    >
      {label}
    </p>
    <h3
      style={{
        fontSize: "1rem",
        fontWeight: 600,
        color: highlight ? "#4ade80" : "#fff",
      }}
    >
      {value}
    </h3>
  </div>
);

const SubButton = ({ icon, label }) => (
  <button
    style={{
      flex: 1,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#fff",
      borderRadius: "10px",
      padding: "0.6rem",
      fontSize: "0.8rem",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      cursor: "pointer",
    }}
  >
    {icon}
    {label}
  </button>
);
