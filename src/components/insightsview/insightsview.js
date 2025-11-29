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

const InsightsView = ({ company, prefetchedData }) => {
  const [tooltip, setTooltip] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [technologies, setTechnologies] = useState([]);


  const colors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];
  const year = new Date().getFullYear();

  const processCpcDefinitions = async (data) => {
  const topIndustries = data.top_industries?.filter(i => i.cpc) || [];

  if (topIndustries.length === 0) {
    setTechnologies([]);
    return;
  }

  try {
    const resp = await fetch("https://api.incubig.org/analytics/cpc-definition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4"
      },
      body: JSON.stringify(topIndustries.map(i => i.cpc))
    });

    const cpcDefs = await resp.json();

   const mapped = topIndustries.map((ind, idx) => {
  const up = idx < 2;
  return {
    name: cpcDefs.find(c => c.cpc === ind.cpc)?.definition || ind.cpc,
    patents: ind.count,
    trend: up ? "up" : "down",
    change: up ? `${15 - idx * 3}%` : `${idx * 2}%`,
  };
});


    setTechnologies(mapped);
  } catch (err) {
    console.error("CPC processing failed:", err);
    setTechnologies([]);
  }
};


 useEffect(() => {
  if (!company?.name) return;

  const fetchInsights = async () => {
    setLoading(true);
    try {
      if (prefetchedData) {
        // Use prefetched data instantly
        setApiData(prefetchedData);
        await processCpcDefinitions(prefetchedData);
        return;
      }

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
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const data = await response.json();
      setApiData(data);
      await processCpcDefinitions(data); 
      // NEW: Fetch technologies from CPC codes 
const topIndustries = data.top_industries?.filter(i => i.cpc) || [];

if (topIndustries.length > 0) {
  try {
    const cpcResponse = await fetch("https://api.incubig.org/analytics/cpc-definition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4"
      },
      body: JSON.stringify(topIndustries.map(i => i.cpc))
    });

    const cpcDefs = await cpcResponse.json();

    const techMapped = topIndustries.map(ind => {
      const def = cpcDefs.find(d => d.cpc === ind.cpc);
      return {
        name: def?.definition || ind.cpc,  // full text technology name
        patents: ind.count,
        trend: "up",      // can calculate real trend later
        change: "—",      // placeholder
        cpc: ind.cpc
      };
    });

    setTechnologies(techMapped);
  } catch (err) {
    console.error("CPC definition fetch failed:", err);
  }
}

    } catch (error) {
      console.error("Error fetching insights data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchInsights();
}, [company, prefetchedData]);


  // UPDATED SHARE FUNCTION
  const handleShareInsights = async () => {
    try {
      const shareUrl = `${
        window.location.origin
      }/companylist?insights=${encodeURIComponent(company.name)}`;
      const textToShare = `Generated this Innovation Intelligence Report on RIX – Incubig — one click, and it pulled incredible insights.
Really impressive.
 ${company.name} 🚀`;

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
    if (downloading) return; // prevent double-clicks

    const fileName = `${company.name}_Insights_Report.pdf`;

    // Check if file already exists in localStorage
    const downloadedFiles =
      JSON.parse(localStorage.getItem("downloadedInsights")) || [];
    if (downloadedFiles.includes(fileName)) {
      alert(`${fileName} is already downloaded ✔️`);
      return;
    }

    // Show loader immediately
    setDownloading(true);

    // Let React paint the loader first before heavy processing
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const insightsElement = document.getElementById("insights-content");
      if (!insightsElement) {
        alert("Insights section not found. Please open the insights first.");
        setDownloading(false);
        return;
      }

      // Temporarily hide action buttons while capturing
      const iconButtons = insightsElement.querySelector(
        `.${styles.iconButtons}`
      );
      if (iconButtons) iconButtons.style.visibility = "hidden";

      // Capture screenshot of insights section
      const canvas = await html2canvas(insightsElement, {
        scale: 1.5,
        backgroundColor: "#000",
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      });

      //  Compress image quality to reduce file size
      const imgData = canvas.toDataURL("image/jpeg", 0.6);
      const pdf = new jsPDF("p", "pt", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      if (iconButtons) iconButtons.style.visibility = "visible";

      pdf.save(fileName);

      // Mark as downloaded
      downloadedFiles.push(fileName);
      localStorage.setItem(
        "downloadedInsights",
        JSON.stringify(downloadedFiles)
      );

      alert(`${fileName} downloaded successfully ✔️`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF report ❌");
    } finally {
      setDownloading(false);
    }
  };

  if (!company) return null;
  if (loading) return <p className={styles.loadingText}></p>;
  if (!apiData)
    return (
      <p className={styles.loadingText}>
        No insights available for this company.
      </p>
    );

  const summary = apiData.summary || {};
  const industries = apiData.top_industries || [];
  const trends = apiData.publication_trends || [];
  const inventors =
    apiData.inventor_analysis?.top_inventors?.slice(0, 10) || [];

  const industryData = industries.map((ind, idx) => ({
    rank: idx + 1,
    name: ind.industry,
    percentage: ((ind.count / (apiData.total_applications || 1)) * 100).toFixed(
      1
    ),
  }));

  const lastFiveYears = trends.slice(-5);
  const maxCount = Math.max(...lastFiveYears.map((t) => t.count || 0), 1);

  const trendPoints = lastFiveYears.map((t, i) => {
    const x = 60 + i * 60;
    const y = 120 - ((t.count || 0) / maxCount) * 90;
    return { x, y, year: t.year, count: t.count || 0 };
  });

  // Fallback static technologies + people if none in API
  const techList = technologies;   
  const peopleList =
    inventors.slice(0, 10).map((p) => ({
      name: p.inventor,
      focus: "Advanced Computing, AI Systems",
      patents: p.count,
    })) || [];

  return (
    <div id="insights-content">
      <div className={styles.insightsContainer}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div className={styles.headerRow}>
            <h3 className={styles.companyName}>{company.name}</h3>
            <div className={styles.iconButtons}>
              {downloading ? (
                <div
                  className={styles.downloadLoader}
                  title="Preparing PDF..."
                ></div>
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

        {/*Executive Summary */}
        <h3 className={styles.sectionTitle}>Executive Summary</h3>
        <div className={styles.summaryContainer}>
          {/* General Stats Paragraph */}
          <p className={styles.summaryParagraph}>
            {company.name} has recorded a total of{" "}
            <strong>{summary.applications?.toLocaleString() || "—"}</strong>{" "}
            innovations, contributed by{" "}
            <strong>
              {" "}
              {apiData.inventor_analysis?.total_inventors?.toLocaleString() ||
                "—"}
            </strong>{" "}
            inventors. These innovations span across{" "}
            <strong>{summary.industries || "—"}</strong> industries and{" "}
            <strong>{summary.technologies || "—"}</strong> technology domains.
          </p>

          {/*  Innovation Trends Paragraph */}
          {trendPoints.length > 0 &&
            (() => {
              const peak = trendPoints.reduce(
                (max, t) => (t.count > max.count ? t : max),
                trendPoints[0]
              );
              const firstYear = trendPoints[0]?.year;
              const lastYear = trendPoints[trendPoints.length - 1]?.year;
              const change = (
                ((trendPoints[trendPoints.length - 1].count -
                  trendPoints[0].count) /
                  (trendPoints[0].count || 1)) *
                100
              ).toFixed(1);
              return (
                <p className={styles.summaryParagraph}>
                  Innovation activity peaked in <strong>{peak.year}</strong>{" "}
                  with <strong>{peak.count.toLocaleString()}</strong> filings.
                  From <strong>{firstYear}</strong> to{" "}
                  <strong>{lastYear}</strong>, innovation volume has shown a{" "}
                  <strong>
                    {change > 0
                      ? `growth of ${change}%`
                      : `decline of ${Math.abs(change)}%`}
                  </strong>
                  , indicating {change > 0 ? "an accelerating" : "a moderating"}{" "}
                  trend in R&D engagement.
                </p>
              );
            })()}

          {/*  Industry Distribution Paragraph */}
          {industryData.length > 0 && (
            <p className={styles.summaryParagraph}>
              Industry-wise, {company.name} shows the highest innovation
              concentration in <strong>{industryData[0]?.name}</strong>,
              accounting for <strong>{industryData[0]?.percentage}%</strong> of
              total activity. The second-largest share is in{" "}
              <strong>{industryData[1]?.name}</strong>, representing{" "}
              <strong>{industryData[1]?.percentage}%</strong>. Together, these
              sectors define the company’s core innovation footprint.
            </p>
          )}

          {/*  Technologies Paragraph */}
          {techList.length > 0 && (
            <p className={styles.summaryParagraph}>
              Technologically, the company’s major focus areas include{" "}
              <strong>{techList[0]?.name}</strong> and{" "}
              <strong>{techList[1]?.name}</strong>. These domains represent
              emerging opportunities with measurable growth, reflecting the
              company’s commitment to forward-looking innovation pathways.
            </p>
          )}

          {/*  Innovators Paragraph (now includes top 2 names) */}
          {peopleList.length > 0 &&
            (() => {
              const top1 = peopleList[0]?.name;
              const top2 = peopleList[1]?.name;
              return (
                <p className={styles.summaryParagraph}>
                  The innovation landscape is powered by a strong team of
                  inventors, with <strong>{peopleList.length}</strong> key
                  contributors driving the majority of filings. Leading
                  contributors such as <strong>{top1}</strong> and{" "}
                  <strong>{top2}</strong> exemplify the company’s diverse
                  expertise.
                </p>
              );
            })()}
        </div>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          {[
            ["Innovations", summary.applications?.toLocaleString() || "—"],
            [
              "Inventors",
              apiData.inventor_analysis?.total_inventors?.toLocaleString() ||
                "—",
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

        {/*Innovation Trends */}
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

        {/*Extra Stat Cards Below Chart */}
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
                    data: industryData.map((item) =>
                      parseFloat(item.percentage)
                    ),
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
                  <th>Innovation Share (%)</th>
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
          with significant innovation concentration in {industryData[0]?.name}{" "}
          and emerging interest in {industryData[1]?.name}. This balance across
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
                    <p className={styles.techDescription}>{tech.description}</p>
                  )}
                  <p className={styles.techPatents}>
                    {tech.patents.toLocaleString()} innovations
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
                Emerging focus areas include ${
                  topTechs || "next-gen innovation clusters"
                }.
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
                      <td className={styles.personPatents}>{p.patents}</td>
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
