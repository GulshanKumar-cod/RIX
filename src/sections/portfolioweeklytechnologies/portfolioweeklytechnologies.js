"use client";
import React, { useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PortfolioWeeklyTechnologies = ({ goToCompanyPage, handleAddCompany }) => {
  const [selectedView, setSelectedView] = useState("ForYou");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const technologyDataList = [
    {
      id: 1,
      title:
        "Adapted for proprietary networking environments such as medical networks or sensor-based systems",
      metrics: {
        organizations: 147,
        innovations: 892,
      },
      trend: {
        percent: "34.5%",
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
        values: [25, 35, 45, 55, 52, 58, 60, 64, 68, 72, 75, 78],
      },
      company: { name: "TechA" },
    },

    {
      id: 2,
      title:
        "For integrated circuit devices, e.g. power bus, number of leads",
      metrics: {
        organizations: 89,
        innovations: 420,
      },
      trend: {
        percent: "27.8%",
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
        values: [15, 20, 32, 40, 45, 50, 58, 60, 63, 65, 70, 75],
      },
      company: { name: "EdgeAI Labs" },
    },

    {
      id: 3,
      title:
        "Micro-electromechanical systems (MEMS) for inertial sensing or pressure detection",
      metrics: {
        organizations: 66,
        innovations: 301,
      },
      trend: {
        percent: "49.2%",
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
        values: [10, 18, 25, 35, 40, 48, 52, 58, 64, 70, 78, 85],
      },
      company: { name: "QuantumSecure" },
    },
  ];

  return (
    <div style={{ marginBottom: "5rem" }}>
      <hr className="mb-4" />

      {/* Header */}
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
        const maxWords = 8;
        const truncated =
          item.title.split(" ").slice(0, maxWords).join(" ") + "...";
        const showFull = expanded[item.id];
        const displayTitle = showFull ? item.title : truncated;

        // Chart data
        const trendData = {
          labels: item.trend.labels,
          datasets: [
            {
              label: "Monthly Growth",
              data: item.trend.values,
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
            x: { grid: { display: false }, ticks: { display: false } },
            y: {
              grid: { color: "rgba(255,255,255,0.05)" },
              ticks: { display: false },
            },
          },
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
            <h4
              style={{
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "1.5",
              }}
            >
              {displayTitle}{" "}
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
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "rgb(77, 166, 255)",
                  textShadow: "rgb(77, 166, 255) 0px 0px 3px",
                }}
              >
                Organizations: {item.metrics.organizations}
              </p>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "rgb(77, 166, 255)",
                  textShadow: "rgb(77, 166, 255) 0px 0px 3px",
                }}
              >
                Innovations: {item.metrics.innovations}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <BarChart3 size={14} color="#00bfff" />
                  <span style={{ fontSize: "0.8rem", color: "#a5b0d0" }}>
                    12-Month Trend
                  </span>
                </div>

                <span style={{ color: "#00bfff", fontSize: "0.8rem" }}>
                  ↑ {item.trend.percent}
                </span>
              </div>

              <div style={{ height: "90px" }}>
                <Bar data={trendData} options={trendOptions} />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div
              className={styles.cardAction}
              style={{ marginBottom: "1.5rem" }}
            >
              <button
                className={styles.viewButton}
                onClick={() => goToCompanyPage(item.company.name)}
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

            {/* ONE CLICK BUTTON */}
            <button
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
              1-Click Insight
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default PortfolioWeeklyTechnologies;
