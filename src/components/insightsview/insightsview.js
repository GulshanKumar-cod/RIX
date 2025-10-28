import React from "react";
import styles from "./insightsview.module.css";

const InsightsView = ({ company }) => {
  return (
    <div className={styles.insightsContainer}>
      {/* ===== Header ===== */}
      <div className={styles.headerSection}>
        <h1 className={styles.companyName}>{company.name}</h1>
        <p className={styles.subtitle}>
          C-level innovation intelligence — industries, technologies, people & recommendations
        </p>
      </div>

      {/* ===== Executive Summary ===== */}
      <h2 className={styles.sectionTitle}>Executive Summary</h2>
      <p className={styles.summaryText}>
        {company.name} remains a top global innovator with a strong inventor base.
        Over the last 12 months, {company.name} focused on{" "}
        {company.industry} and continues to lead in emerging technologies.
      </p>

      {/* ===== Stats Section ===== */}
      <section className={styles.statsSection}>
        {[
          ["Patents Filed", company.patents.toLocaleString()],
          ["Inventors", Math.floor(company.patents / 1.3).toLocaleString()],
          ["Industries", company.industries],
          ["Technologies", company.technologies],
        ].map(([label, val], i) => (
          <div className={styles.statsCard} key={i}>
            <h3
              className={styles.statsValue}
              style={{
                color:
                  label === "Country"
                    ? "#fff"
                    : label === "Top Industry"
                    ? "#fff"
                    : "#fff",
              }}
            >
              {val}
            </h3>
            <p className={styles.statsLabel}>{label}</p>
          </div>
        ))}
      </section>

      {/* ===== Filing Trends ===== */}
      <h3 className={styles.sectionTitle}>Filing Trends</h3>
      <p className={styles.subtext}>Patent activity over the last six quarters.</p>

      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 300 100" width="100%" height="80">
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            points="10,70 60,50 110,60 160,40 210,30 260,20"
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#007bff" />
              <stop offset="100%" stopColor="#00bfff" />
            </linearGradient>
          </defs>
          {[10, 60, 110, 160, 210, 260].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={[70, 50, 60, 40, 30, 20][i]}
              r="3"
              fill="url(#lineGradient)"
            />
          ))}
        </svg>
      </div>

      {/* ===== Extra Stat Cards Below Chart ===== */}
      <div className={styles.extraStatsSection}>
        <div className={styles.extraStatCard}>
          <h4 className={styles.extraStatValue}>+9.4%</h4>
          <p className={styles.extraStatLabel}>5y CAGR</p>
        </div>
        <div className={styles.extraStatCard}>
          <h4 className={styles.extraStatValue}>12,619</h4>
          <p className={styles.extraStatLabel}>2023 Filings</p>
        </div>
        <div className={styles.extraStatCard}>
          <h4 className={styles.extraStatValue}>AI Signal Opt +45%</h4>
          <p className={styles.extraStatLabel}>Top Tech Growth</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
