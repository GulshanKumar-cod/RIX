import React from "react";
import { Line } from "react-chartjs-2";
import styles from "../companylist/companylist.module.css";

const OverviewTab = ({ selectedIndustry,activeTab, topCountries, topCompanies }) => {
  return (
    <>
      {/* Description */}
      <p
        style={{
          color: "#fff",
          margin: "0 0 1.5rem 0",
          lineHeight: "1.4",
        }}
         className={styles.statsLabel}
      >
      {selectedIndustry?.descriptionsByTab?.[activeTab] ??
    "No description available for this section."}
      </p>

      {/* Info Grid */}
      <section className={styles.statsSection}>
        {[
          {
            label: "Innovations",
            value: "1299",
          },
          {
            label: "Countries",
            value: "12",
          },
          {
            label: "Companies",
            value: "34",
          },
          {
            label: "Technologies",
            value: "70",
          },
        ].map((item, i) => (
          <div className={styles.statsCard} key={i}>
            <h3 className={styles.statsValue}>{item.value}</h3>
            <p className={styles.statsLabel}>{item.label}</p>
          </div>
        ))}
      </section>

      {/* 📈 YoY Innovation Activity Line Graph */}
      <div style={{ marginBottom: "2rem" }}>
        <h4
          style={{
            marginBottom: "1rem",
            fontSize: "0.8rem",
            color: "#00bfff",
          }}
        >
          YoY Innovation Activity
        </h4>
        <div style={{ height: "180px" }}>
          <Line
            data={{
              labels: [
                "2018",
                "2019",
                "2020",
                "2021",
                "2022",
                "2023",
                "2024",
              ],
              datasets: [
                {
                  data: [100, 30, 50, 170, 200, 230, 260],
                  borderColor: "#00bfff",
                  backgroundColor: "rgba(0,191,255,0.2)",
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 3,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  callbacks: {
                    label: (context) => {
                      const value = context.parsed.y;
                      return `Applications: ${value}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Year",
                    color: "#ccc",
                    font: { size: 12 },
                  },
                  ticks: {
                    color: "#aaa",
                  },
                  grid: { display: false },
                },
                y: {
                  title: {
                    display: false,
                  },
                  ticks: {
                    color: "#aaa",
                  },
                  grid: {
                    color: "#333",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className={styles.countryCompany}>
        {/* 🌍 Top Countries Section */}
        <div className={styles.countriesSection}>
          <h4 style={{ marginBottom: "0.8rem", fontSize: "0.8rem", color: "#00bfff" }}>
            Top Countries
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {topCountries.map((country, index) => (
              <div key={index} className={styles.dataRow}>
                <span>{country.name}</span>
                <span>{country.applications.toLocaleString()}</span>
                <span
                  style={{
                    color: country.increment.startsWith("+") ? "#00ff88" : "#ff4d4d",
                    fontWeight: 500,
                  }}
                >
                  {country.increment}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🏢 Leading Organizations Section */}
        <div className={styles.organizationsSection}>
          <h4 style={{ marginBottom: "0.8rem", fontSize: "0.8rem", color: "#00bfff" }}>
            Leading Organizations
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {topCompanies.map((company, index) => (
              <div key={index} className={styles.dataRow}>
                <span>{company.name}</span>
                <span>{company.applications.toLocaleString()}</span>
                <span
                  style={{
                    color: company.increment.startsWith("+") ? "#00ff88" : "#ff4d4d",
                    fontWeight: 500,
                  }}
                >
                  {company.increment}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;