"use client";

import React, { useEffect, useState } from "react";
import { Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./insightsview.module.css";
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
  BarElement,
  Filler,
} from "chart.js";
import SimpleMap from "../worldmap/worldmap";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Filler
);

// --- UPDATED TABLE STYLES ---
const thStyle = {
  textAlign: "left",
  padding: "8px 4px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  color: "#a5b0d0",
  fontSize: "0.8rem",
  fontWeight: "600",
  whiteSpace: "normal",
  verticalAlign: "bottom"
};

const tdStyle = {
  textAlign: "left",
  padding: "8px 4px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "0.8rem",
  verticalAlign: "middle"
};

const InsightsView = ({ company, prefetchedData, feedItem }) => {
  // Data states
  const [apiData, setApiData] = useState(null); // company API data
  const [techApi, setTechApi] = useState(null); // technology API data
  const [loading, setLoading] = useState(true); // company loading
  const [loadingTech, setLoadingTech] = useState(false); // technology loading
  const [downloading, setDownloading] = useState(false);
  const [technologies, setTechnologies] = useState([]);

  const isTechMode = Boolean(feedItem);
  const colors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];
  const year = new Date().getFullYear();

  // Hardcoded API key as requested
  const API_KEY = "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4";

  const toNum = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // --- MOCK DATA FOR NEW SECTIONS ---
 // === MAP + COUNTRY TABLE — USE API DATA WHEN IN TECHNOLOGY MODE ===
let mapData = [];
let countryTableData = [];

if (isTechMode && techApi?.country_analysis?.top_countries) {
  // Map data expects: [ [countryCode, count], ... ]
  mapData = techApi.country_analysis.top_countries.map(c => [c.country, c.count]);

  // Convert API into table format with rank + share %
  const total = techApi.country_analysis.top_countries
    .reduce((sum, c) => sum + (c.count || 0), 0) || 1;

  countryTableData = techApi.country_analysis.top_countries.map((c, idx) => {
    const pct = ((c.count / total) * 100).toFixed(1) + "%";
    return {
      rank: idx + 1,
      country: c.country,
      share: pct,
      count: c.count
    };
  });
} else {
  // fallback to avoid breakage (if API fails)
  mapData = [["US", 0]];
  countryTableData = [];
}


  const topOrgsData = [
    { rank: 1, name: "Samsung Electronics", count: 14500, growth: "+12.4%" },
    { rank: 2, name: "Huawei Technologies", count: 12300, growth: "+18.1%" },
    { rank: 3, name: "IBM Corporation", count: 9800, growth: "-2.5%" },
    { rank: 4, name: "Qualcomm", count: 8500, growth: "+8.9%" },
    { rank: 5, name: "Canon", count: 7200, growth: "+4.1%" }
  ];

  // --- HELPER: CPC definitions processor (company mode)
  const processCpcDefinitions = async (data) => {
    const topIndustries = data.top_industries?.filter((i) => i.cpc) || [];
    if (topIndustries.length === 0) {
      setTechnologies([]);
      return;
    }
    try {
      const resp = await fetch("https://api.incubig.org/analytics/cpc-definition", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify(topIndustries.map((i) => i.cpc)),
      });
      const cpcDefs = await resp.json();
      const mapped = topIndustries.map((ind, idx) => {
        const up = idx < 2;
        return {
          name: cpcDefs.find((c) => c.cpc === ind.cpc)?.definition || ind.cpc,
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

  // --- EFFECT: fetch company insights (only when not tech mode) ---
  useEffect(() => {
    // If we're in tech mode, skip company fetch here.
    if (isTechMode) {
      setLoading(false);
      return;
    }

    if (!company?.name) {
      setLoading(false);
      if (prefetchedData) {
        setApiData(prefetchedData);
        processCpcDefinitions(prefetchedData).catch(() => {});
      }
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      try {
        if (prefetchedData) {
          setApiData(prefetchedData);
          await processCpcDefinitions(prefetchedData);
          return;
        }
        const response = await fetch(
          `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(company.name)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
          }
        );
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        const data = await response.json();
        setApiData(data);
        await processCpcDefinitions(data);

        const topIndustries = data.top_industries?.filter((i) => i.cpc) || [];
        if (topIndustries.length > 0) {
          try {
            const cpcResponse = await fetch("https://api.incubig.org/analytics/cpc-definition", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
              body: JSON.stringify(topIndustries.map((i) => i.cpc)),
            });
            const cpcDefs = await cpcResponse.json();
            const techMapped = topIndustries.map((ind) => {
              const def = cpcDefs.find((d) => d.cpc === ind.cpc);
              return { name: def?.definition || ind.cpc, patents: ind.count, trend: "up", change: "—", cpc: ind.cpc };
            });
            setTechnologies(techMapped);
          } catch (err) { console.error("CPC definition fetch failed:", err); }
        }
      } catch (error) { console.error("Error fetching insights data:", error); } 
      finally { setLoading(false); }
    };
    fetchInsights();
  }, [company, prefetchedData, isTechMode]);

  // --- EFFECT: fetch technology insights when in tech mode ---
  useEffect(() => {
    if (!isTechMode) return;

    // Primary CPC should be present on feedItem (you provided primary_cpc in technologyDataList)
    const cpc = feedItem?.primary_cpc;
    if (!cpc) {
      // no cpc — we'll just rely on feedFallback (sample values)
      setTechApi(null);
      setLoadingTech(false);
      return;
    }

    const fetchTech = async () => {
      setLoadingTech(true);
      try {
        const url = `https://api.incubig.org/analytics/technology-analysis?cpc=${encodeURIComponent(cpc)}`;
        const resp = await fetch(url, {
          headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        });

        if (!resp.ok) {
          // preserve existing behavior but log
          console.error("Technology API returned non-OK:", resp.status);
          const text = await resp.text().catch(() => null);
          console.error("Tech API response text:", text);
          setTechApi(null);
          setLoadingTech(false);
          return;
        }

        const data = await resp.json();
        // store technology API response
        setTechApi(data);
      } catch (err) {
        console.error("TECH API ERROR:", err);
        setTechApi(null);
      } finally {
        setLoadingTech(false);
      }
    };

    fetchTech();
  }, [isTechMode, feedItem?.primary_cpc]);

  // --- Share handler (fixed for tech mode) ---
  const handleShareInsights = async () => {
    try {
      const shareTargetName = isTechMode 
        ? (feedItem?.title || feedItem?.name || "Technology Report")
        : (company?.name || "Insights Report");
      const shareUrl = isTechMode
        ? `${window.location.origin}/technology?insights=${encodeURIComponent(shareTargetName)}`
        : `${window.location.origin}/companylist?insights=${encodeURIComponent(shareTargetName)}`;
      const textToShare = `Generated this Innovation Intelligence Report on RIX – Incubig. ${shareTargetName} 🚀`;
      const shareData = { title: `Insights for ${shareTargetName}`, text: textToShare, url: shareUrl };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${textToShare}: ${shareUrl}`);
        alert("Insights link copied to clipboard 📋");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to share insights.");
    }
  };

  // --- Download handler (unchanged) ---
  const handleDownloadReport = async () => {
    if (downloading) return;
    const fileName = isTechMode
      ? `${(feedItem?.title || feedItem?.name || "technology").replace(/[^\w\- ]+/g, "")}_Technology_Report.pdf`
      : `${(company?.name || "insights").replace(/[^\w\- ]+/g, "")}_Report.pdf`;

    setDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      const insightsElement = document.getElementById("insights-content");
      if (!insightsElement) { alert("Insights section not found."); setDownloading(false); return; }
      const iconButtons = insightsElement.querySelector(`.${styles.iconButtons}`);
      if (iconButtons) iconButtons.style.visibility = "hidden";
      const canvas = await html2canvas(insightsElement, { scale: 1.5, backgroundColor: "#000", useCORS: true, scrollX: 0, scrollY: -window.scrollY });
      const imgData = canvas.toDataURL("image/jpeg", 0.6);
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) { position = heightLeft - imgHeight; pdf.addPage(); pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight); heightLeft -= pageHeight; }
      if (iconButtons) iconButtons.style.visibility = "visible";
      pdf.save(fileName);
      alert(`${fileName} downloaded successfully ✔️`);
    } catch (error) { console.error("PDF generation failed:", error); alert("Failed to generate PDF report ❌"); } 
    finally { setDownloading(false); }
  };

  // --- Feed fallback (same as before) ---
  const feedFallback = feedItem ? {
    summary: {
      applications: feedItem.metrics?.innovations ?? feedItem.patents ?? feedItem.summary?.applications ?? 0,
      industries: feedItem.industriesCount ?? feedItem.summary?.industries ?? 0,
      technologies: feedItem.technologiesCount ?? feedItem.summary?.technologies ?? 0,
      totalCountries: 15,
      topCountry: "USA",
      growth: feedItem.trend?.percent || "+12%",
      totalOrganizations: feedItem.metrics?.organizations ?? 120,
    },
    publication_trends: (feedItem.trendGraph?.labels ? (feedItem.trendGraph.labels || []).map((lab, i) => ({ year: lab, count: (feedItem.trendGraph.values && feedItem.trendGraph.values[i]) ?? 0 })) : null) || feedItem.publication_trends || [],
    top_industries: feedItem.top_industries || [],
    inventor_analysis: {
      total_inventors: feedItem.inventor_analysis?.total_inventors ?? feedItem.inventors ?? 0,
      top_inventors: feedItem.inventor_analysis?.top_inventors || [],
    },
    technologies: feedItem.relatedTechnologies || feedItem.technologiesDeveloped || [],
  } : null;

  // effectiveData should be the appropriate dataset
  const effectiveData = isTechMode ? (techApi || feedFallback) : (apiData || feedFallback || null);

  if (!effectiveData && !company && !feedItem) { return null; }

  // For tech mode, map techApi to fields expected by UI
  const publication_trends = isTechMode
    ? (techApi?.publication_trends || techApi?.application_trends || feedFallback?.publication_trends || [])
    : (effectiveData?.publication_trends || []);

  const trends = (publication_trends && Array.isArray(publication_trends) && publication_trends.map((t) => ({ year: t.year, count: toNum(t.count, 0) }))) || [];
  const lastFiveYears = trends.slice(-5);
  const maxCount = Math.max(...lastFiveYears.map((t) => t.count || 0), 1);
  const trendPoints = lastFiveYears.map((t, i) => ({ x: 60 + i * 60, y: 120 - ((t.count || 0) / maxCount) * 90, year: t.year, count: t.count || 0 }));

  const industriesArr = isTechMode
    ? (feedItem.top_industries || [])
    : (effectiveData?.top_industries || []);

  let industryData = [];
  if (isTechMode && techApi?.total_applications) {
    const totalApps = toNum(techApi.total_applications, 1);
    industryData = industriesArr.map((ind, idx) => ({ rank: idx + 1, name: ind.industry || ind.name || "Unknown", percentage: (((toNum(ind.count, 0) / totalApps) * 100) || 0).toFixed(1) }));
  } else {
    const sum = industriesArr.reduce((s, it) => s + toNum(it.count, 0), 0) || 1;
    industryData = industriesArr.map((ind, idx) => ({ rank: idx + 1, name: ind.industry || ind.name || "Unknown", percentage: ((toNum(ind.count, 0) / sum) * 100).toFixed(1) }));
  }

  const techList = (technologies && technologies.length > 0) ? technologies
    : (isTechMode
        ? [
            {
              name: feedItem?.title || feedItem?.name,
              patents: techApi?.total_applications || feedItem.metrics?.innovations || 0,
              trend: feedItem?.trend?.percent ? "up" : "—",
              change: feedItem?.trend?.percent || "—",
            },
          ]
        : (effectiveData?.technologies?.length > 0 ? effectiveData.technologies : (feedItem ? [{ name: feedItem.title || feedItem.name, patents: feedItem.metrics?.innovations ?? 0, trend: "up", change: feedItem.trend?.percent ?? "—" }] : []))
      );

  const peopleList = (isTechMode
    ? (techApi?.inventor_analysis?.top_inventors || []).slice(0, 10).map((p) => ({ name: p.inventor || p.name || "Unknown", focus: p.focus || "Technology Research", patents: p.count || p.patents || 0 }))
    : (effectiveData?.inventor_analysis?.top_inventors || []).slice(0, 10).map((p) => ({ name: p.inventor || p.name || "Unknown", focus: p.focus || "Advanced Computing, AI Systems", patents: p.count || p.patents || 0 }))
  ) || [];

  const summary = isTechMode
    ? {
        applications: techApi?.total_applications ?? feedFallback?.summary?.applications ?? 0,
        industries: feedFallback?.summary?.industries ?? feedItem?.industries ?? 0, // sample
        technologies: feedFallback?.summary?.technologies ?? feedItem?.technologies ?? 0, // sample
        totalCountries: techApi?.country_analysis?.total_countries ?? techApi?.country_analysis?.top_countries?.length ?? feedFallback?.summary?.totalCountries ?? 0,
        topCountry: feedItem?.topCountry || feedFallback?.summary?.topCountry || "—",
        growth: feedItem?.trend?.percent || feedFallback?.summary?.growth || "+12%",
        totalOrganizations: techApi?.assignee_analysis?.total_assignees ?? feedFallback?.summary?.totalOrganizations ?? 0
      }
    : (effectiveData?.summary || {});

  if (loading && company?.name) return <p className={styles.loadingText}>Loading insights…</p>;
  if (isTechMode && loadingTech) return <p className={styles.loadingText}>Loading technology insights…</p>;

  // --- STATS CONFIGURATION ---
  const statsToRender = isTechMode 
    ? [
        ["Total Innovations", summary.applications?.toLocaleString() || "—"],
        ["YoY Innovation Growth", summary.growth || "+12%"],
        ["Active Countries", summary.totalCountries || 15],
        ["Active Organizations", summary.totalOrganizations || 120],
        ["Active Inventors", (techApi?.inventor_analysis?.total_inventors?.toLocaleString() || "—")],
        ["Impacted Industries", summary.industries || "—"]
      ]
    : [
        ["Innovations", summary.applications?.toLocaleString() || "—"],
        ["Inventors", effectiveData?.inventor_analysis?.total_inventors?.toLocaleString() || "—"],
        ["Industries", summary.industries || "—"],
        ["Technologies", summary.technologies || "—"]
      ];

  // ---------------------------------------------------------------------
  // RENDER UI (kept structure and content from your original component)
  // ---------------------------------------------------------------------
  return (
    <div id="insights-content">
      <div className={styles.insightsContainer}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div className={styles.headerRow}>
            <h3 className={styles.companyName}>
              {isTechMode ? feedItem?.title || feedItem?.name : company?.name}
            </h3>
            <div className={styles.iconButtons}>
              {downloading ? ( <div className={styles.downloadLoader} title="Preparing PDF..." /> ) : (
                <>
                  <Share2 aria-label="Share Insights" title="Share Insights" className={styles.actionIcon} onClick={handleShareInsights} />
                  <Download aria-label="Download Report" title="Download PDF" className={styles.actionIcon} onClick={handleDownloadReport} />
                </>
              )}
            </div>
          </div>
          <p className={styles.subtitle}>
            {isTechMode ? "Technology intelligence — organizations, trends & people." : "Innovation intelligence — industries, technologies & people."}
          </p>
        </div>

        {/* Executive Summary */}
        <h3 className={styles.sectionTitle}>{isTechMode ? "Technology Overview" : "Executive Summary"}</h3>
        <div className={styles.summaryContainer}>
          <p className={styles.summaryParagraph}>
            {isTechMode ? (
              <>
                <strong>{feedItem?.title || feedItem?.name}</strong> has recorded{" "}
                <strong>{summary.applications?.toLocaleString() || "—"}</strong>{" "}
                innovations across <strong>{summary.industries || "—"}</strong>{" "}
                industries. This technology shows active contribution from{" "}
                <strong>{(techApi?.inventor_analysis?.total_inventors?.toLocaleString() || "—")}</strong>{" "}
                inventors globally.
              </>
            ) : (
              <>
                {company?.name} has recorded a total of{" "}
                <strong>{summary.applications?.toLocaleString() || "—"}</strong>{" "}
                innovations, contributed by{" "}
                <strong>{effectiveData?.inventor_analysis?.total_inventors?.toLocaleString() || "—"}</strong>{" "}
                inventors.
              </>
            )}
          </p>
          {trendPoints.length > 0 && (() => {
            const peak = trendPoints.reduce((max, t) => (t.count > max.count ? t : max), trendPoints[0]);
            const firstYear = trendPoints[0]?.year;
            const lastYear = trendPoints[trendPoints.length - 1]?.year;
            const change = (((trendPoints[trendPoints.length - 1].count - trendPoints[0].count) / (trendPoints[0].count || 1)) * 100).toFixed(1);
            return (
              <p className={styles.summaryParagraph}>
                Innovation activity peaked in <strong>{peak.year}</strong> with <strong>{peak.count.toLocaleString()}</strong> filings. From <strong>{firstYear}</strong> to <strong>{lastYear}</strong>, innovation volume has shown a <strong>{change > 0 ? `growth of ${change}%` : `decline of ${Math.abs(change)}%`}</strong>.
              </p>
            );
          })()}
        </div>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          {statsToRender.map(([label, val], i) => (
            <div className={styles.statsCard} key={i}>
              <h3 className={styles.statsValue}>{val}</h3>
              <p className={styles.statsLabel}>{label}</p>
            </div>
          ))}
        </section>

        {/* Innovation Trends Chart */}
        <h3 className={styles.sectionTitle}>Innovation Trends</h3>
        <div className={styles.chartWrapper}>
          <Line
            data={{
              labels: trendPoints.map((p) => p.year),
              datasets: [{
                label: isTechMode ? "Technology Trend Over Time" : "YoY Innovation Activity",
                data: trendPoints.map((p) => p.count),
                borderColor: "#00bfff",
                backgroundColor: "rgba(0, 191, 255, 0.2)",
                fill: false, tension: 0.3, pointRadius: 4, pointHoverRadius: 5, pointBackgroundColor: "#007bff", pointBorderColor: "#fff",
              }],
            }}
            options={{
              responsive: true, maintainAspectRatio: false,
              scales: { x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#aaa", font: { size: 12 } } }, y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#aaa", font: { size: 12 }, callback: (val) => `${val}` } } },
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw} Published` } } },
            }}
          />
          <div style={{ marginTop: 10, textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 500 }}>
            {isTechMode ? "Technology Trend Over Time" : "YoY Innovation Activity"}
          </div>
        </div>

        {/* NEW SECTIONS: ONLY SHOWN IF isTechMode IS TRUE */}
        {isTechMode && (
          <div style={{ background: "transparent", marginTop: "5rem", marginBottom: "3rem" }}>
            <h3 className={styles.sectionTitle}>Global Reach & Markets</h3>
            
            {/* Map Summary */}
            <p style={{ color: "#fff", marginBottom: "1.5rem" }} className={styles.summaryParagraph}>
              {feedItem?.description || "High innovation density observed in North American and Asian markets."}
            </p>

            {/* Interactive Map */}
            <div style={{ background: "transparent", borderRadius: "10px", marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
              <SimpleMap
                data={mapData}
                color="#4a90e2"
                backgroundColor="transparent"
                borderColor="#ccc"
                label="Global Innovation Map"
              />
            </div>

            {/* Global Rankings Table */}
            <div style={{ overflowX: "auto", marginBottom: "3rem"}}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: "1rem", color:"#fff" }}>Global Rankings</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Rank</th>
                    <th style={thStyle}>Country</th>
                    <th style={thStyle}>Global Share (%)</th>
                        <th style={thStyle}>Innovations</th>
                  </tr>
                </thead>
                <tbody>
                  {countryTableData.map((row) => (
                    <tr key={row.rank}>
                      <td style={tdStyle}>{row.rank}</td>
                      <td style={tdStyle}>{row.country}</td>
                      <td style={tdStyle}>{row.share}</td>
                       <td style={tdStyle}>{row.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leading Organizations Table (UPDATED COLUMNS) */}
            <div style={{ overflowX: "auto", marginBottom: "1.5rem"}}>
               <h3 className={styles.sectionTitle}>Leading Organizations</h3>
               <p className={styles.subtext} style={{marginBottom: "1rem"}}>Top organizations driving innovation in this domain.</p>
               <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Rank</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Innovations</th>
                    {/* <th style={thStyle}>Growth (%)</th> */}
                  </tr>
                </thead>
                <tbody>
                  {(techApi?.assignee_analysis?.top_assignees || topOrgsData).slice(0,5).map((org, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {org.assignee || org.name}
                        </div>
                      </td>
                      <td style={tdStyle}>{(org.count || org.count === 0) ? (org.count).toLocaleString() : (org.count || org.count === 0)}</td>
                      {/* <td style={tdStyle}>
                        <span style={{ color: (org.growth && org.growth.startsWith('+')) ? '#4da6ff' : '#ff4d4d' }}>
                           {org.growth || "—"}
                        </span>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Industry Distribution */}
        <h3 className={styles.sectionTitle}>Industries impacted by the technology</h3>
        <div className={styles.industrySection}>
          <div className={styles.pieChartWrapper}>
            <Pie
              data={{
                labels: industryData.map((item) => item.name),
                datasets: [{
                  label: "Industry Distribution",
                  data: industryData.map((item) => parseFloat(item.percentage)),
                  backgroundColor: colors,
                  borderColor: "#000",
                  borderWidth: 0,
                }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true, callbacks: { label: (context) => `${context.label}: ${context.formattedValue}%` } } } }}
            />
          </div>
          <div className={styles.legendWrapper}>
            {industryData.map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: colors[i % colors.length] }} />
                <span className={styles.legendText}>{item.name} — {item.percentage}%</span>
              </div>
            ))}
          </div>
          <div className={styles.industryTableWrapper}>
            <table className={styles.industryTable}>
              <thead><tr><th>Rank</th><th>Industry</th><th>Innovation Share (%)</th></tr></thead>
              <tbody>
                {industryData.map((item, idx) => (
                  <tr key={idx}><td>{item.rank}</td><td>{item.name}</td><td>{item.percentage}%</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       

        {/* People & Innovators */}
        {peopleList.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>People & Innovators</h3>
            <p className={styles.subtext}>{isTechMode ? "Inventors actively contributing to this technology." : "Top inventors and their activity trends."}</p>
            <div className={styles.peopleSection}>
              <table className={styles.peopleTable}>
                <thead><tr><th style={{width: "60%"}}>Name</th>
                {/* <th>Focus</th> */}
                <th style={{width: "40%"}}>Innovations</th></tr></thead>
                <tbody>
                  {peopleList.map((p, i) => (
                    <tr key={i}>
                      <td className={styles.personName}>{p.name}</td>
                      {/* <td className={styles.personFocus}>{p.focus}</td> */}
                      <td className={styles.personPatents}>{p.patents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

         {/* Technologies Developed */}
        {techList.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>{isTechMode ? "Related Technologies" : "Technologies Developed"}</h3>
            <div className={styles.techSection}>
              {techList.map((tech, i) => (
                <div key={i} className={styles.techCard}>
                  <div className={styles.techHeader}>
                    <h4 className={styles.techTitle}>{tech.name}</h4>
                    <span className={`${styles.techChange} ${tech.trend === "up" ? styles.trendUp : styles.trendDown}`}>
                      {tech.trend === "up" ? "↑" : "↓"} {tech.change || "—"}
                    </span>
                  </div>
                  {tech.description && <p className={styles.techDescription}>{tech.description}</p>}
                  <p className={styles.techPatents}>{(tech.patents || tech.count || 0).toLocaleString()} innovations</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerLabel}>Incubig AI - RIX | <a href="/" className="incubigHyper" target="_blank" rel="noopener noreferrer">rix.incubig.org</a> © {year}</span>
      </div>
    </div>
  );
};

export default InsightsView;
