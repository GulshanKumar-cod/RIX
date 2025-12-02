"use client";
import React, { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
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
import InsightsView from "@/components/insightsview/insightsview";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PortfolioWeeklyTechnologies = ({ goToCompanyPage, handleAddCompany }) => {
  const [selectedView, setSelectedView] = useState("ForYou");
  const [expanded, setExpanded] = useState({});

  // ADDED FOR 1-CLICK INSIGHTS
  const [showInsights, setShowInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState(
    "Fetching innovation activity data..."
  );
  const [currentCompany, setCurrentCompany] = useState(null);
  const [prefetchedInsights, setPrefetchedInsights] = useState(null);
  const [currentFeedItem, setCurrentFeedItem] = useState(null);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // FETCH INSIGHTS API
  const fetchCompanyInsights = async (companyName) => {
    try {
      const response = await fetch(
        `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(
          companyName
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4",
          },
        }
      );

      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (err) {
      console.error("Insights fetch error:", err);
      return null;
    }
  };

  //  PROGRESS MESSAGE UPDATE
  const updateMessage = (value) => {
    if (value < 25)
      setProgressMessage("Fetching innovation activity data...");
    else if (value < 50)
      setProgressMessage("Analyzing industries and emerging technologies...");
    else if (value < 75)
      setProgressMessage("Processing inventor networks...");
    else setProgressMessage("Generating intelligence report...");
  };

  //  1-CLICK INSIGHTS HANDLER
  const handleOneClickInsights = async (company, feedItem) => {
    setCurrentCompany(company);
     setCurrentFeedItem(feedItem);
    setShowInsights(true);
    setIsLoading(true);
    setProgress(0);

    let progressValue = 0;
    let fetchDone = false;

    const dataPromise = fetchCompanyInsights(company.name);

    // API Watcher
    (async () => {
      const result = await dataPromise;
      setPrefetchedInsights(result);
      fetchDone = true;
    })();

    // Progress animation
    const interval = setInterval(() => {
      if (progressValue < 90) {
        progressValue += 1.2;
      } else if (fetchDone) {
        progressValue += 2;
      }

      updateMessage(progressValue);
      setProgress(Math.round(progressValue));

      if (progressValue >= 100) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 80);
  };

  // SAMPLE DATA
const technologyDataList = [
  {
  id: 1,
  title:
    "Adapted for proprietary or special purpose networking environments, e.g. medical networks, sensor networks, networks in a car or remote metering networks",

  // ==========================
  // REQUIRED FOR INSIGHTSVIEW
  // ==========================
  name:
    "Adapted for proprietary or special purpose networking environments",
  industry: "Networking Systems",
  country: "Global",

  patents: 2020,
  industries: 14,
  technologies: 42,
  inventors: 1184,
  change: "+12%",
  trend: "up",

  technologiesDeveloped: [
    {
      name: "Low-power sensor mesh networking",
      patents: 648,
      change: "+11%",
      trend: "up"
    },
    {
      name: "In-vehicle communication buses (CAN, LIN, FlexRay)",
      patents: 442,
      change: "+6%",
      trend: "up"
    },
    {
      name: "Medical telemetry communication systems",
      patents: 380,
      change: "-3%",
      trend: "down"
    }
  ],

  summary: {
    applications: 2020,
    industries: 14,
    technologies: 42
  },

  publication_trends: Array.from({ length: 12 }, (_, i) => ({
    year: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    count: [25, 35, 45, 55, 52, 58, 60, 64, 68, 72, 75, 78][i]
  })),

  // FIXED TREND OBJECT FOR GRAPH
  trendGraph: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    values: [25, 35, 45, 55, 52, 58, 60, 64, 68, 72, 75, 78],
    percent: "+12%"
  },

  top_industries: [
    { industry: "Automotive Electronics", count: 612, cpc: "H04W" },
    { industry: "Healthcare Monitoring", count: 502, cpc: "A61B" },
    { industry: "Smart Metering & Utilities", count: 338, cpc: "G01D" }
  ],

  inventor_analysis: {
    total_inventors: 1184,
    top_inventors: [
      { inventor: "Zhou Wei", count: 54 },
      { inventor: "Martin Keller", count: 43 },
      { inventor: "Satoshi Yamamoto", count: 41 },
      { inventor: "Priya Nair", count: 38 }
    ]
  },

  metrics: { organizations: 861, innovations: 2020 },

  company: { name: "Intel corporation" }
},


  // ===== TECHNOLOGY 2 =====
  {
  id: 2,
  title:
    "Constructional details or arrangements of charging converters specially adapted for charging electric vehicles",

  name:
    "Constructional details of EV charging converters",
  industry: "Electric Mobility",
  country: "Global",

  patents: 378,
  industries: 9,
  technologies: 21,
  inventors: 284,
  change: "+7%",
  trend: "up",

  technologiesDeveloped: [
    {
      name: "High-efficiency GaN EV chargers",
      patents: 155,
      change: "+13%",
      trend: "up"
    },
    {
      name: "Bidirectional vehicle-to-grid (V2G) power systems",
      patents: 102,
      change: "+5%",
      trend: "up"
    },
    {
      name: "Thermal-adaptive charging safety modules",
      patents: 68,
      change: "-4%",
      trend: "down"
    }
  ],

  summary: {
    applications: 378,
    industries: 9,
    technologies: 21
  },

  publication_trends: Array.from({ length: 12 }, (_, i) => ({
    year: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    count: [15, 20, 32, 40, 45, 50, 58, 60, 63, 65, 70, 75][i]
  })),

  trendGraph: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    values: [15, 20, 32, 40, 45, 50, 58, 60, 63, 65, 70, 75],
    percent: "+7%"
  },

  top_industries: [
    { industry: "Electric Vehicles", count: 264, cpc: "H02J" },
    { industry: "Battery Manufacturing", count: 88, cpc: "H01M" },
    { industry: "Smart Grids", count: 46, cpc: "Y04S" }
  ],

  inventor_analysis: {
    total_inventors: 284,
    top_inventors: [
      { inventor: "Charles Wong", count: 26 },
      { inventor: "Liu Cheng", count: 21 },
      { inventor: "Alicia Fernandes", count: 19 }
    ]
  },

  metrics: { organizations: 148, innovations: 378 },

  company: { name: "Toyota jidosha kabushiki kaisha" }
},


  // ===== TECHNOLOGY 3 =====
 {
  id: 3,
  title:
    "Details of, or accessories for, apparatus for measuring steady or quasi-steady pressure of a fluent medium...",

  name: "Pressure sensing & fluid monitoring instruments",
  industry: "Industrial Sensors",
  country: "Global",

  patents: 450,
  industries: 17,
  technologies: 33,
  inventors: 502,
  change: "+9%",
  trend: "up",

  technologiesDeveloped: [
    {
      name: "Micro-electromechanical pressure sensors (MEMS)",
      patents: 212,
      change: "+14%",
      trend: "up"
    },
    {
      name: "High-temperature industrial pressure systems",
      patents: 140,
      change: "+6%",
      trend: "up"
    },
    {
      name: "Fluid dynamic monitoring systems",
      patents: 98,
      change: "-5%",
      trend: "down"
    }
  ],

  summary: {
    applications: 450,
    industries: 17,
    technologies: 33
  },

  publication_trends: Array.from({ length: 12 }, (_, i) => ({
    year: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    count: [10, 18, 25, 35, 40, 48, 52, 58, 64, 70, 78, 85][i]
  })),

  trendGraph: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    values: [10, 18, 25, 35, 40, 48, 52, 58, 64, 70, 78, 85],
    percent: "+9%"
  },

  top_industries: [
    { industry: "Industrial Automation", count: 188, cpc: "G01L" },
    { industry: "Oil & Gas Monitoring", count: 142, cpc: "E21B" },
    { industry: "Aerospace Systems", count: 120, cpc: "B64D" }
  ],

  inventor_analysis: {
    total_inventors: 502,
    top_inventors: [
      { inventor: "Hiro Tanaka", count: 48 },
      { inventor: "Emily Peterson", count: 37 },
      { inventor: "Victor Santos", count: 33 },
      { inventor: "Anna-Yu Roberts", count: 29 }
    ]
  },

  metrics: { organizations: 258, innovations: 450 },

  company: { name: "Robert bosch gmbh" }
}

];



  return (
    <div style={{ marginBottom: "5rem" }}>
      <hr className="mb-4" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <h3 className={styles.headingH3} style={{ marginTop: "0px" }}>
          Technologies Feed
        </h3>

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
          <option value="ForYou">For You</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* CARD LIST */}
      <div className={styles.featuredContainer}>
      {technologyDataList.map((item) => {
  const truncated =
    item.title.split(" ").slice(0, 8).join(" ") + "...";

  const showFull = expanded[item.id];

  // 🟡 FIX: Define the data source securely
  // We check if 'trendGraph' exists (where your labels/values are), otherwise try 'trend'
  const graphSource = item.trendGraph || item.trend || {};
  
  // Safely extract arrays (default to empty if missing to prevent crash)
  const chartLabels = graphSource.labels || [];
  const chartValues = graphSource.values || [];
  const chartPercent = graphSource.percent || item.change || "+0%";

  const trendData = {
    labels: chartLabels, // Use safe variable
    datasets: [
      {
        label: "Monthly Growth",
        data: chartValues, // Use safe variable
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "#007bff";
          const g = c.createLinearGradient(
            chartArea.left,
            0,
            chartArea.right,
            0
          );
          g.addColorStop(0, "rgb(0,123,255)");
          g.addColorStop(1, "rgb(0,191,255)");
          return g;
        },
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  return (
    <div
      key={item.id}
      style={{
        background: "transparent",
        color: "#fff",
        borderRadius: "16px",
        padding: "1rem",
        width: "100%",
        maxWidth: "420px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginBottom: "2rem",
      }}
    >
      {/* TITLE */}
      <h4 style={{ fontSize: "18px", fontWeight: 600 }}>
        {showFull ? item.title : truncated}{" "}
        <span
          onClick={() => toggleExpand(item.id)}
          style={{
            color: "#00bfff",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {showFull ? "Read less" : "Read more"}
        </span>
      </h4>

      <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* METRICS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "#4da6ff" }}>
          Organizations: {item.metrics?.organizations || 0}
        </p>
        <p style={{ fontSize: "0.8rem", color: "#4da6ff" }}>
          Innovations: {item.metrics?.innovations || 0}
        </p>
      </div>

      {/* TREND */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.6rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <BarChart3 size={14} color="#00bfff" />
            <span style={{ fontSize: "0.8rem", color: "#a5b0d0" }}>
              12-Month Trend
            </span>
          </div>

          <span style={{ color: "#00bfff", fontSize: "0.8rem" }}>
            ↑ {chartPercent}
          </span>
        </div>

        <div style={{ height: "90px" }}>
           {/* Only render chart if we actually have data */}
           {chartValues.length > 0 ? (
             <Bar data={trendData} options={{ responsive: true, maintainAspectRatio: false }} />
           ) : (
             <p style={{fontSize: "0.7rem", color: "#555", textAlign: "center", marginTop: "30px"}}>No trend data available</p>
           )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className={styles.cardAction} style={{ marginBottom: "1.5rem" }}>
        <button
          className={styles.viewButton}
          onClick={() => goToCompanyPage(item.company?.name || "")}
        >
          Deep Dive
        </button>

        <button
          className={styles.addPortfolio}
          onClick={(e) => {
            e.stopPropagation();
            handleAddCompany(item.company);
          }}
        >
          + Add
        </button>
      </div>

      {/* 1-CLICK INSIGHTS BUTTON */}
      <button
        onClick={() => handleOneClickInsights(item.company, item)}
        style={{
          background: "linear-gradient(90deg, #007bff, #00bfff)",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1.25rem",
          borderRadius: "8px",
          fontSize: "0.8rem",
          width: "100%",
          maxWidth: "200px",
          margin: "0 auto",
          display: "block",
        }}
      >
        1-Click Insights
      </button>
    </div>
  );
})}
      </div>

      {/* INSIGHTS MODAL */}
      {showInsights && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
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
              width: "90%",
              maxWidth: "900px",
              height: "80vh",
              overflowY: "auto",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            {/* CLOSE */}
            <button
              onClick={() => setShowInsights(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                color: "#4da6ff",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <div style={{ marginTop: "40px", textAlign: "center", fontSize: "0.8rem" }}>
              {isLoading ? (
                <div>
                  <p style={{ marginBottom: "10px" }}>{progressMessage}</p>

                  <div
                    style={{
                      height: "10px",
                      background: "#1a1a1a",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #007bff, #00bfff)",
                        transition: "width 0.2s",
                      }}
                    />
                  </div>

                  <p style={{ marginTop: "5px", color: "#4da6ff" }}>
                    {progress}%
                  </p>
                </div>
              ) : (
                <InsightsView
                  company={currentCompany}
                  prefetchedData={prefetchedInsights}
                   feedItem={currentFeedItem}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWeeklyTechnologies;
