import React from "react";
import { Share2,Download  } from 'lucide-react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./insightsview.module.css";
import Footer from "../footer/footer";

const InsightsView = ({ company }) => {
  if (!company) return null;

  // ✅ Share handler
  const handleShareInsights = async () => {
    const textToShare = `Insights for ${company.name}`;
    const shareData = {
      title: `Insights for ${company.name}`,
      text: textToShare,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(textToShare);
        alert(
          "Insights copied to clipboard (sharing not supported on this device)."
        );
      }
    } catch (err) {
      console.error("Error sharing insights:", err);
      alert("Unable to share insights.");
    }
  };

  // ✅ Download handler
const handleDownloadReport = async () => {
  try {
    const insightsElement = document.getElementById("insights-content");
    if (!insightsElement) {
      alert("Insights section not found. Please open the insights first.");
      return;
    }

    // ✅ Hide the icons temporarily
    const iconButtons = insightsElement.querySelector(`.${styles.iconButtons}`);
    if (iconButtons) iconButtons.style.display = "none";

    // Wait a tick to ensure DOM updates
    await new Promise((r) => setTimeout(r, 100));

    // Capture the element
    const canvas = await html2canvas(insightsElement, {
      scale: 2,
      backgroundColor: "#000",
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add remaining pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.setLineWidth(0);

    // ✅ Restore icons visibility
    if (iconButtons) iconButtons.style.display = "flex";

    pdf.save(`${company.name}_Insights_Report.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF report.");
  }
};


 const year = new Date().getFullYear();

  return (

    <div id="insights-content">
    
    <div  className={styles.insightsContainer}>
      {/* ===== Header ===== */}

      <div className={styles.headerSection}>
         <div className={styles.headerRow}>
        <h2 className={styles.companyName}>{company.name}</h2>
        <div className={styles.iconButtons}>
         <Share2
            title="Share Insights"
            className={styles.actionIcon}
            onClick={handleShareInsights}
          />
          <Download
            title="Download PDF"
            className={styles.actionIcon}
            onClick={handleDownloadReport}
          />
        </div>
      </div>
        <p className={styles.subtitle}>
          Innovation intelligence — industries, technologies, people &
          recommendations.
        </p>
      </div>

      {/* ===== Executive Summary ===== */}
      <h2 className={styles.sectionTitle}>Executive Summary</h2>
      <p className={styles.summaryText}>
        {company.name} remains a top global innovator with a strong inventor
        base. Over the last 12 months, {company.name} focused on{" "}
        {company.industry} and continues to lead in emerging technologies.
      </p>

      {/* ===== Stats Section ===== */}
      <section className={styles.statsSection}>
        {[
          ["Innovations", company.patents.toLocaleString()],
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
      <h3 className={styles.sectionTitle}>Innovation Trends</h3>
      <p className={styles.subtext}>
        Patent activity over the last six quarters.
      </p>

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

  <div className={styles.footer}>
      <span className={styles.footerLabel}>
        The Future of Research Intelligence - RIX |{" "}
        <a
          href="/"
          className="incubigHyper"
          target="_blank"
          rel="noopener noreferrer"
        >
          rix.incubig.org
        </a>{" "}
        © {year}
      </span>
    </div>

    </div>
  );
};

export default InsightsView;
