import React from "react";
import { Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./insightsview.module.css";
import Footer from "../footer/footer";

const InsightsView = ({ company }) => {
  // ✅ Always define hooks at the top
  const [tooltip, setTooltip] = React.useState(null);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  // Example colors for pie chart
  const colors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];

  // ✅ Only then check props
  if (!company) return null;

  // Example industry data
  const industryData = company.industryData || [
    { rank: 1, name: "AI & ML", percentage: 35 },
    { rank: 2, name: "Healthcare", percentage: 25 },
    { rank: 3, name: "Automotive", percentage: 20 },
    { rank: 4, name: "Energy", percentage: 10 },
    { rank: 5, name: "Other", percentage: 10 },
  ];

  // ✅ Helper values
  const year = new Date().getFullYear();

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

      // Hide icons before capture
      const iconButtons = insightsElement.querySelector(
        `.${styles.iconButtons}`
      );
      if (iconButtons) iconButtons.style.display = "none";

      await new Promise((r) => setTimeout(r, 100));

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

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      if (iconButtons) iconButtons.style.display = "flex";

      pdf.save(`${company.name}_Insights_Report.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF report.");
    }
  };

  // Precompute cumulative angles for pie slices
  const cumulativeAngles = industryData.reduce(
    (acc, slice, i) => {
      const prev = acc[i - 1] || 0;
      acc.push(prev + slice.percentage / 100);
      return acc;
    },
    [0]
  );

  return (
    <div id="insights-content">
      <div className={styles.insightsContainer}>
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
              <h3 className={styles.statsValue}>{val}</h3>
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

        {/* ===== Industry Distribution Section ===== */}
        <h3 className={styles.sectionTitle}>Industry Distribution</h3>
        <div className={styles.industrySection}>
          {/* Pie Chart */}
          <div className={styles.pieChartWrapper}>
            <svg
              viewBox="-60 -60 120 120"
              className={styles.pieChart}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {(() => {
                let cumulative = 0;
                return industryData.map((slice, i) => {
                  const startAngle = cumulative;
                  const sliceAngle = (slice.percentage / 100) * 2 * Math.PI;
                  cumulative += sliceAngle;

                  // Convert polar → Cartesian
                  const x1 = 50 * Math.cos(startAngle - Math.PI / 2);
                  const y1 = 50 * Math.sin(startAngle - Math.PI / 2);
                  const x2 =
                    50 * Math.cos(startAngle + sliceAngle - Math.PI / 2);
                  const y2 =
                    50 * Math.sin(startAngle + sliceAngle - Math.PI / 2);

                  const largeArc = slice.percentage > 50 ? 1 : 0;
                  const d = `M 0 0 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                  return (
                    <path
                      key={i}
                      d={d}
                      fill={colors[i % colors.length]}
                      style={{
                        opacity:
                          hoveredIndex === null || hoveredIndex === i ? 1 : 0.4,
                        transition: "opacity 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        const svgRect =
                          e.target.ownerSVGElement.getBoundingClientRect();
                        setTooltip({
                          name: slice.name,
                          value: slice.percentage,
                          x: e.clientX - svgRect.left,
                          y: e.clientY - svgRect.top,
                        });
                        setHoveredIndex(i);
                      }}
                    />
                  );
                });
              })()}
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                className={styles.tooltip}
                style={{
                  top: tooltip.y - 30,
                  left: tooltip.x + 15,
                }}
              >
                {tooltip.name}: {tooltip.value}%
              </div>
            )}
          </div>

          {/* Legends */}
          <div className={styles.legendWrapper}>
            {industryData.map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <span
                  className={styles.legendColor}
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className={styles.legendText}>
                  {item.name} — {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Industry Table */}
          <div className={styles.industryTableWrapper}>
            <table className={styles.industryTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Industry</th>
                  <th>Patent Share (%)</th>
                </tr>
              </thead>
              <tbody>
                {industryData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.rank}</td>
                    <td>{item.name}</td>
                    <td>{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Summary Paragraph ===== */}
        {/* <h3 className={styles.sectionTitle}>Summary</h3> */}
        <p className={styles.summaryText}>
          {company.name} demonstrates a well-diversified innovation strategy,
          with significant patent concentration in {industryData[0].name} and
          emerging interest in {industryData[1].name}. This balance across
          sectors reflects a proactive approach toward future technologies and
          market adaptability.
        </p>

       {/* ===== Technologies Developed Section ===== */}
{company.technologiesDeveloped && company.technologiesDeveloped.length > 0 && (
  <>
    <h3 className={styles.sectionTitle}>Technologies Developed</h3>
    <div className={styles.techSection}>
      {company.technologiesDeveloped.map((tech, i) => (
        <div key={i} className={styles.techCard}>
          <div className={styles.techHeader}>
            <h4 className={styles.techTitle}>{tech.name}</h4>
            <span
              className={`${styles.techChange} ${
                tech.trend === "up" ? styles.trendUp : styles.trendDown
              }`}
            >
              {tech.trend === "up" ? "↑" : "↓"} {tech.change}
            </span>
          </div>
          {tech.description && (
            <p className={styles.techDescription}>{tech.description}</p>
          )}
          <p className={styles.techPatents}>
            {tech.patents.toLocaleString()} patents
          </p>
        </div>
      ))}
    </div>

    {/* ===== Dynamic Technologies Summary ===== */}
    {(() => {
      const topTechs = company.technologiesDeveloped
        .slice(0, 3)
        .map((t) => t.name)
        .join(", ");
      const risingTechs = company.technologiesDeveloped
        .filter((t) => t.trend === "up")
        .map((t) => t.name)
        .slice(0, 2)
        .join(", ");

      const decliningTechs = company.technologiesDeveloped
        .filter((t) => t.trend === "down")
        .map((t) => t.name)
        .slice(0, 1)
        .join(", ");

      const summaryText = `
        Emerging focus areas include ${topTechs || "next-gen innovation clusters"}.
        Several previously dominant areas like ${decliningTechs || "traditional hardware"} 
        show stabilization, while ${risingTechs || "AI and connectivity"} technologies exhibit an upward trajectory.
      `;

      return (
        <div className={styles.techSummaryBox}>
          <p className={styles.techSummaryText}>
            {summaryText}
          </p>
        </div>
      );
    })()}
  </>
)}

      </div>

      <div className={styles.footer}>
        <span className={styles.footerLabel}>
          Incubig AI - RIX |{" "}
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
