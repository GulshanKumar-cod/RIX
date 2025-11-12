import React, { useEffect, useState } from "react";
import { Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./insightsview.module.css";
import Footer from "../footer/footer";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);


const InsightsView = ({ company }) => {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);


  const colors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!company?.name) return;

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(company.name)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching insights data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [company]);

 // UPDATED SHARE FUNCTION
const handleShareInsights = async () => {
  try {
    const shareUrl = `${window.location.origin}/companylist?insights=${encodeURIComponent(company.name)}`;
    const textToShare = `Check out innovation insights for ${company.name} 🚀`;

    const shareData = {
      title: `Insights for ${company.name}`,
      text: textToShare,
      url: shareUrl,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${textToShare}: ${shareUrl}`);
      alert("Insights link copied to clipboard 📋");
    }
  } catch (err) {
    console.error("Error sharing insights:", err);
    alert("Unable to share insights.");
  }
};




 const handleDownloadReport = async () => {
  if (downloading) return; // Prevent double clicks
  setDownloading(true);

  try {
    const insightsElement = document.getElementById("insights-content");
    if (!insightsElement) {
      alert("Insights section not found. Please open the insights first.");
      setDownloading(false);
      return;
    }

    const iconButtons = insightsElement.querySelector(`.${styles.iconButtons}`);
    if (iconButtons) iconButtons.style.display = "none";

    // Small delay before rendering
    await new Promise((r) => setTimeout(r, 200));

    // Show loader
    const loader = document.createElement("div");
    loader.className = styles.loaderOverlay;
    loader.innerHTML = `
      <div class="${styles.loaderCircle}"></div>
      <p style="color:white;margin-top:10px;">Preparing your download...</p>
    `;
    document.body.appendChild(loader);

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

    const fileName = `${company.name}_Insights_Report.pdf`;
    pdf.save(fileName);

    alert(`${fileName} downloaded ✔️`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF report.");
  } finally {
    const loader = document.querySelector(`.${styles.loaderOverlay}`);
    if (loader) loader.remove();
    setDownloading(false);
  }
};


  if (!company) return null;
  if (loading)
    return <p className={styles.loadingText}>Loading Insights...</p>;
  if (!apiData)
    return <p className={styles.loadingText}>No insights available for this company.</p>;

  const summary = apiData.summary || {};
  const industries = apiData.top_industries || [];
  const trends = apiData.publication_trends || [];
  const inventors =
    apiData.inventor_analysis?.top_inventors?.slice(0, 10) || [];

  const industryData = industries.map((ind, idx) => ({
    rank: idx + 1,
    name: ind.industry,
    percentage: (
      (ind.count / (apiData.total_applications || 1)) *
      100
    ).toFixed(1),
  }));

  const lastFiveYears = trends.slice(-5);
  const maxCount = Math.max(...lastFiveYears.map((t) => t.count || 0), 1);

  const trendPoints = lastFiveYears.map((t, i) => {
    const x = 60 + i * 60;
    const y = 120 - ((t.count || 0) / maxCount) * 90;
    return { x, y, year: t.year, count: t.count || 0 };
  });

  // Fallback static technologies + people if none in API
  const techList = company.technologiesDeveloped || [];
  const peopleList =
    inventors.slice(0, 10).map((p) => ({
      name: p.inventor,
      focus: "Advanced Computing, AI Systems",
      patents: p.count,
    })) || [];

  return (
    <div id="insights-content">
      <div className={styles.insightsContainer}>
        {/* ===== Header ===== */}
        <div className={styles.headerSection}>
          <div className={styles.headerRow}>
            <h3 className={styles.companyName}>{company.name}</h3>
          <div className={styles.iconButtons}>
  {downloading ? (
    <div className={styles.loader}></div>
  ) : (
    <>
      <Share2
        aria-label="Share Insights"
        title="Share Insights"
        className={styles.actionIcon}
        onClick={handleShareInsights}
      />
      <Download
        aria-label="Download Report"
        title="Download PDF"
        className={styles.actionIcon}
        onClick={handleDownloadReport}
      />
    </>
  )}
</div>

          </div>
          <p className={styles.subtitle}>
            Innovation intelligence — industries, technologies & people.
          </p>
        </div>

        {/* ===== Executive Summary ===== */}
      <h3 className={styles.sectionTitle}>Executive Summary</h3>
<p className={styles.summaryText}>
  {company.name} recorded{" "}
  {summary.applications?.toLocaleString() || "—"} patent filings,
  contributed by{" "}
  {apiData.inventor_analysis?.total_inventors?.toLocaleString() || "—"}{" "}
  inventors across {summary.industries || "—"} industries and{" "}
  {summary.technologies || "—"} technology areas. 
  Innovation activity shows steady year-over-year trends, with key
  concentrations in {industryData[0]?.name} and growing focus in{" "}
  {industryData[1]?.name}. Emerging technologies such as{" "}
  {techList.slice(0, 3).map((t) => t.name).join(", ") || "—"} are shaping
  the current development landscape, while top innovators continue to drive
  contributions across multiple domains.
</p>


        {/* ===== Stats Section ===== */}
        <section className={styles.statsSection}>
          {[
            ["Innovations", summary.applications?.toLocaleString() || "—"],
            [
              "Inventors",
              apiData.inventor_analysis?.total_inventors?.toLocaleString() || "—",
            ],
            ["Industries", summary.industries || "—"],
            ["Technologies", summary.technologies || "—"],
          ].map(([label, val], i) => (
            <div className={styles.statsCard} key={i}>
              <h3 className={styles.statsValue}>{val}</h3>
              <p className={styles.statsLabel}>{label}</p>
            </div>
          ))}
        </section>

        {/* ===== Innovation Trends ===== */}
      <h3 className={styles.sectionTitle}>Innovation Trends</h3>
<div className={styles.chartWrapper}>
  <Line
    data={{
      labels: trendPoints.map((p) => p.year),
      datasets: [
        {
          label: "YoY Innovation Activity",
          data: trendPoints.map((p) => p.count),
          borderColor: "#00bfff",
          backgroundColor: "rgba(0, 191, 255, 0.2)",
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: "#007bff",
          pointBorderColor: "#fff",
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         x: {
      grid: { color: "rgba(255,255,255,0.1)" },
      ticks: {
        color: "#aaa",
        font: {
          size: 12, 
        },
      },
    },
        y: {
      beginAtZero: true,
      grid: { color: "rgba(255,255,255,0.1)" },
      ticks: {
        color: "#aaa",
        font: {
          size: 12, 
        },
        callback: (val) => `${val}`,
      },
    },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw} Published`,
          },
        },
      },
    }}
  />

  {/* Label below chart */}
  <div
    style={{
      marginTop: "10px",
      textAlign: "center",
      color: "#fff",
      fontSize: "11px",
      fontWeight: 500,
    }}
  >
    YoY Innovation Activity
  </div>
</div>


        {/* ===== Extra Stat Cards Below Chart ===== */}
        {/* <div className={styles.extraStatsSection}>
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
        </div> */}

        {/* ===== Industry Distribution Section ===== */}
        <h3 className={styles.sectionTitle}>Industry Distribution</h3>
        <div className={styles.industrySection}>
         <div className={styles.pieChartWrapper}>
  <Pie
    data={{
      labels: industryData.map((item) => item.name),
      datasets: [
        {
          label: "Industry Distribution",
          data: industryData.map((item) => parseFloat(item.percentage)),
          backgroundColor: colors,
          borderColor: "#000", // keeps consistent dark theme
          borderWidth: 0,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: {
        legend: {
          display: false, // we'll use your custom legend below
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) =>
              `${context.label}: ${context.formattedValue}%`,
          },
        },
      },
      layout: {
        padding: 0,
      },
    }}
  />
</div>


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
        <p className={styles.summaryText}>
          {company.name} demonstrates a well-diversified innovation strategy,
          with significant patent concentration in {industryData[0]?.name} and
          emerging interest in {industryData[1]?.name}. This balance across
          sectors reflects a proactive approach toward future technologies and
          market adaptability.
        </p>

        {/* ===== Technologies Developed Section ===== */}
       {techList.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>Technologies Developed</h3>
            <div className={styles.techSection}>
              {techList.map((tech, i) => (
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
                    <p className={styles.techDescription}>
                      {tech.description}
                    </p>
                  )}
                  <p className={styles.techPatents}>
                    {tech.patents.toLocaleString()} patents
                  </p>
                </div>
              ))}
            </div>
            {(() => {
              const topTechs = techList
                .slice(0, 3)
                .map((t) => t.name)
                .join(", ");
              const risingTechs = techList
                .filter((t) => t.trend === "up")
                .map((t) => t.name)
                .slice(0, 2)
                .join(", ");
              const decliningTechs = techList
                .filter((t) => t.trend === "down")
                .map((t) => t.name)
                .slice(0, 1)
                .join(", ");
              const summaryText = `
                Emerging focus areas include ${topTechs ||
                  "next-gen innovation clusters"}.
                Several previously dominant areas like ${
                  decliningTechs || "traditional hardware"
                } show stabilization, while ${
                risingTechs || "AI and connectivity"
              } technologies exhibit an upward trajectory.
              `;
              return (
                <div className={styles.techSummaryBox}>
                  <p className={styles.techSummaryText}>{summaryText}</p>
                </div>
              );
            })()}
          </>
        )}

        {/* ===== People & Innovators Section ===== */}
        {peopleList.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>People & Innovators</h3>
            <p className={styles.subtext}>
              Top inventors and their activity trends — focused on industries
              and innovation output.
            </p>
            <div className={styles.peopleSection}>
              <table className={styles.peopleTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Focus</th>
                    <th>Publications</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleList.map((p, i) => (
                    <tr key={i}>
                      <td className={styles.personName}>{p.name}</td>
                      <td className={styles.personFocus}>{p.focus}</td>
                      <td className={styles.personPatents}>
                        {p.patents}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
