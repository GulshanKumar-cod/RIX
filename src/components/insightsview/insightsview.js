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
  verticalAlign: "bottom",
};

const tdStyle = {
  textAlign: "left",
  padding: "8px 4px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "0.8rem",
  verticalAlign: "middle",
};

const InsightsView = ({ company, prefetchedData, feedItem }) => {
  // Data states
  const [apiData, setApiData] = useState(null); // company API data
  const [techApi, setTechApi] = useState(null); // technology API data (technology-analysis)
  const [loading, setLoading] = useState(true);
  const [loadingTech, setLoadingTech] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [technologies, setTechnologies] = useState([]); // CPC-derived techs (company-mode)
  const [error, setError] = useState(null);

  const isTechMode = Boolean(feedItem);
  const colors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];
  const year = new Date().getFullYear();

  // Hardcoded API key as requested
  const API_KEY =
    "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4";

  const toNum = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // --- Helpers for fetch with timeout + retry (used for tech api) ---
  const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
    // timeout in ms (default 15s)
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch(url, { signal: controller.signal, ...options });
      return resp;
    } finally {
      clearTimeout(id);
    }
  };

  // --- Map & countryTable data: default, replaced with techApi data when available ---
  let mapData = [["US", 0]];
  let countryTableData = [];

  if (isTechMode && techApi?.country_analysis?.top_countries) {
    // convert to map format and table format
    mapData = techApi.country_analysis.top_countries.map((c) => [c.country, c.count]);
    const total = techApi.country_analysis.top_countries.reduce((s, c) => s + (c.count || 0), 0) || 1;
    countryTableData = techApi.country_analysis.top_countries.map((c, idx) => ({
      rank: idx + 1,
      country: c.country,
      share: ((c.count / total) * 100).toFixed(1) + "%",
      count: c.count,
    }));
  }

  // --- Top orgs fallback (will be replaced by techApi.assignee_analysis if available) ---
  const topOrgsData = [
    { rank: 1, name: "Samsung Electronics", count: 14500, growth: "+12.4%" },
    { rank: 2, name: "Huawei Technologies", count: 12300, growth: "+18.1%" },
    { rank: 3, name: "IBM Corporation", count: 9800, growth: "-2.5%" },
    { rank: 4, name: "Qualcomm", count: 8500, growth: "+8.9%" },
    { rank: 5, name: "Canon", count: 7200, growth: "+4.1%" },
  ];

  // --- PROCESS CPC definitions for company mode (same approach as before) ---
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
        const defObj = cpcDefs.find((c) => c.cpc === ind.cpc);
        const up = idx < 2;
        return {
          name: defObj?.definition || ind.cpc,
          patents: ind.count,
          trend: up ? "up" : "down",
          change: up ? `${15 - idx * 3}%` : `${idx * 2}%`,
          cpc: ind.cpc,
        };
      });
      setTechnologies(mapped);
    } catch (err) {
      console.error("CPC processing failed:", err);
      setTechnologies([]);
    }
  };

  // --- EFFECT: fetch company insights (when not tech mode) ---
  useEffect(() => {
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
      setError(null);
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
      } catch (err) {
        console.error("Error fetching insights data:", err);
        setError(err?.message || "Failed to fetch company data");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [company, prefetchedData, isTechMode]);

  // --- EFFECT: fetch technology insights when in tech mode ---
  useEffect(() => {
    if (!isTechMode) return;

    const cpc = feedItem?.primary_cpc;
    if (!cpc) {
      setTechApi(null);
      setLoadingTech(false);
      return;
    }

    let cancelled = false;

    const fetchTech = async () => {
      setLoadingTech(true);
      setError(null);

      // url expects encoded CPC; pass API key in header
      const url = `https://api.incubig.org/analytics/technology-analysis?cpc=${encodeURIComponent(
        cpc
      )}`;

      // attempt twice in case of transient 504/timeout
      for (let attempt = 0; attempt < 2 && !cancelled; attempt++) {
        try {
          const resp = await fetchWithTimeout(url, {
            headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
          }, 20000); // 20s timeout
          if (!resp.ok) {
            // if server returns 5xx or 504, try again once
            const text = await resp.text().catch(() => null);
            console.error(`Technology API returned non-OK: ${resp.status}`, text);
            if (attempt === 1) {
              // last attempt failed
              setTechApi(null);
              setError(`Technology API returned ${resp.status}`);
            } else {
              // wait a bit and retry
              await new Promise((r) => setTimeout(r, 700));
              continue;
            }
          } else {
            const data = await resp.json();
            if (!cancelled) setTechApi(data);
            break;
          }
        } catch (err) {
          console.error("TECH API ERROR:", err);
          // if last attempt, set error
          if (attempt === 1) setError("Technology API request failed or timed out");
          else await new Promise((r) => setTimeout(r, 700));
        }
      }

      if (!cancelled) setLoadingTech(false);
    };

    fetchTech();
    return () => {
      cancelled = true;
    };
  }, [isTechMode, feedItem?.primary_cpc]);

const handleShareInsights = async () => {
  try {
    // 🔑 BUILD SHARE PAYLOAD (THIS WAS MISSING)
    const dataToShare = isTechMode
      ? {
          technologyName: feedItem?.title || feedItem?.name,
          primary_cpc: feedItem?.primary_cpc,
          companyName: feedItem?.company?.name || null,
        }
      : {
          companyName: company?.name,
        };

    if (!dataToShare || (!dataToShare.companyName && !dataToShare.technologyName)) {
      throw new Error("Missing share payload");
    }

    const params = new URLSearchParams();
    params.set("insights", encodeURIComponent(JSON.stringify(dataToShare)));
    params.set("mode", isTechMode ? "technology" : "company");

    const shareUrl = `${window.location.origin}/portfolio?${params.toString()}`;

    const shareText = isTechMode
      ? `Generated this Technology Intelligence Report on RIX – Incubig 🚀`
      : `Generated this Company Innovation Report on RIX – Incubig 🚀`;

    const shareData = {
      title: "Incubig RIX Insights",
      text: shareText,
      url: shareUrl,
    };

    //  Native share (mobile & supported browsers)
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback (desktop)
      await navigator.clipboard.writeText(shareUrl);
      alert("Insights link copied to clipboard 📋");
    }
  } catch (err) {
    console.error("SHARE ERROR:", err);
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
      if (!insightsElement) {
        alert("Insights section not found.");
        setDownloading(false);
        return;
      }
      const iconButtons = insightsElement.querySelector(`.${styles.iconButtons}`);
      if (iconButtons) iconButtons.style.visibility = "hidden";
      const canvas = await html2canvas(insightsElement, {
        scale: 1.5,
        backgroundColor: "#000",
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.6);
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      if (iconButtons) iconButtons.style.visibility = "visible";
      pdf.save(fileName);
      alert(`${fileName} downloaded successfully ✔️`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF report ❌");
    } finally {
      setDownloading(false);
    }
  };

  // --- Feed fallback for feedItem (unchanged) ---
  const feedFallback = feedItem
    ? {
        summary: {
          applications:
            feedItem.metrics?.innovations ?? feedItem.patents ?? feedItem.summary?.applications ?? 0,
          industries: feedItem.industriesCount ?? feedItem.summary?.industries ?? 0,
          technologies: feedItem.technologiesCount ?? feedItem.summary?.technologies ?? 0,
          totalCountries: 15,
          topCountry: "USA",
          growth: feedItem.trend?.percent || "+12%",
          totalOrganizations: feedItem.metrics?.organizations ?? 120,
        },
        publication_trends:
          (feedItem.trendGraph?.labels
            ? (feedItem.trendGraph.labels || []).map((lab, i) => ({
                year: lab,
                count: (feedItem.trendGraph.values && feedItem.trendGraph.values[i]) ?? 0,
              }))
            : null) || feedItem.publication_trends || [],
        top_industries: feedItem.top_industries || [],
        inventor_analysis: {
          total_inventors:
            feedItem.inventor_analysis?.total_inventors ?? feedItem.inventors ?? 0,
          top_inventors: feedItem.inventor_analysis?.top_inventors || [],
        },
        technologies: feedItem.relatedTechnologies || feedItem.technologiesDeveloped || [],
      }
    : null;

  // effectiveData selects appropriate dataset
  const effectiveData = isTechMode ? techApi || feedFallback : apiData || feedFallback || null;
  if (!effectiveData && !company && !feedItem) return null;

  // publication trends mapping: techApi may return application_trends or publication_trends
  const publication_trends = isTechMode
    ? techApi?.publication_trends || techApi?.application_trends || feedFallback?.publication_trends || []
    : effectiveData?.publication_trends || [];

  const trends = (publication_trends &&
    Array.isArray(publication_trends) &&
    publication_trends.map((t) => ({ year: t.year, count: toNum(t.count, 0) }))) || [];

  // Use last 5 points (or all, if fewer)
  const lastFiveYears = trends.slice(-5);
  const maxCount = Math.max(...lastFiveYears.map((t) => t.count || 0), 1);
  const trendPoints = lastFiveYears.map((t, i) => ({
    x: 60 + i * 60,
    y: 120 - ((t.count || 0) / maxCount) * 90,
    year: t.year,
    count: t.count || 0,
  }));

  // YoY growth computed from trendPoints
  function calculateYoYGrowth(points) {
    if (!points || points.length < 2) return "N/A";
    const first = points[0].count;
    const last = points[points.length - 1].count;
    if (!first || first === 0) return "N/A";
    const growth = ((last - first) / first) * 100;
    const rounded = growth.toFixed(1);
    return (growth >= 0 ? "+" : "") + rounded + "%";
  }
  const yoyGrowth = calculateYoYGrowth(trendPoints);

  // Industries array (use techApi.top_industries when technology mode and data available)
  const industriesArr = isTechMode
    ? techApi?.top_industries || feedFallback?.top_industries || []
    : effectiveData?.top_industries || [];

  let industryData = [];
  if (isTechMode && techApi?.total_applications) {
    const totalApps = toNum(techApi.total_applications, 1);
    industryData = industriesArr.map((ind, idx) => ({
      rank: idx + 1,
      name: ind.industry || ind.name || "Unknown",
      percentage: (((toNum(ind.count, 0) / totalApps) * 100) || 0).toFixed(1),
    }));
  } else {
    const sum = industriesArr.reduce((s, it) => s + toNum(it.count, 0), 0) || 1;
    industryData = industriesArr.map((ind, idx) => ({
      rank: idx + 1,
      name: ind.industry || ind.name || "Unknown",
      percentage: ((toNum(ind.count, 0) / sum) * 100).toFixed(1),
    }));
  }

  // Tech list: for company mode we pulled CPC definitions into 'technologies' earlier; for tech mode use related tech fallback
  const techList =
    technologies && technologies.length > 0
      ? technologies
      : isTechMode
      ? [
          {
            name: feedItem?.title || feedItem?.name,
            patents: techApi?.total_applications || feedItem.metrics?.innovations || 0,
            trend: feedItem?.trend?.percent ? "up" : "—",
            change: feedItem?.trend?.percent || "—",
          },
        ]
      : effectiveData?.technologies?.length > 0
      ? effectiveData.technologies
      : feedItem
      ? [{ name: feedItem.title || feedItem.name, patents: feedItem.metrics?.innovations ?? 0, trend: "up", change: feedItem.trend?.percent ?? "—" }]
      : [];

  // People list: map from techApi (tech mode) or effectiveData (company mode)
  const peopleList =
    (isTechMode
      ? techApi?.inventor_analysis?.top_inventors || []
      : effectiveData?.inventor_analysis?.top_inventors || []
    ).slice(0, 10).map((p) => ({ name: p.inventor || p.name || "Unknown", focus: p.focus || "Research", patents: p.count || p.patents || 0 })) || [];

  // Summary fields (company mode vs tech mode differences)
  const summary = isTechMode
    ? {
        applications: techApi?.total_applications ?? feedFallback?.summary?.applications ?? 0,
        industries: feedFallback?.summary?.industries ?? feedItem?.industries ?? 0, // sample until better data available
        technologies: feedFallback?.summary?.technologies ?? feedItem?.technologies ?? 0, // sample until better data available
        totalCountries: techApi?.country_analysis?.total_countries ?? techApi?.country_analysis?.top_countries?.length ?? feedFallback?.summary?.totalCountries ?? 0,
        topCountry: feedItem?.topCountry || feedFallback?.summary?.topCountry || "—",
        growth: feedItem?.trend?.percent || feedFallback?.summary?.growth || "+12%",
        totalOrganizations: techApi?.assignee_analysis?.total_assignees ?? feedFallback?.summary?.totalOrganizations ?? 0,
      }
    : effectiveData?.summary || {};

  // -------------------------------
  // Company-specific narrative formatting (Apple-style sentences, dynamic)
  // -------------------------------
  // Image1 style: Executive Summary (company-specific)
  function renderCompanyExecutiveSummary() {
    // Values pulled from apiData (company insights)
    const patentCount = apiData?.total_applications ?? summary.applications ?? 0;
    const inventorCount = apiData?.inventor_analysis?.total_inventors ?? effectiveData?.inventor_analysis?.total_inventors ?? 0;
    const industriesCount = effectiveData?.summary?.industries ?? effectiveData?.top_industries?.length ?? "—";
    const techCount = effectiveData?.summary?.technologies ?? effectiveData?.technologies?.length ?? "—";

    // Compose Apple-like paragraph (text from your sample images), with dynamic values
    return (
      <p className={styles.summaryParagraph}>
        <strong>{company?.name}</strong> recorded <strong>{patentCount.toLocaleString()}</strong> patent filings, contributed by <strong>{inventorCount.toLocaleString()}</strong> inventors across <strong>{industriesCount}</strong> industries and <strong>{techCount}</strong> technology areas. Innovation activity shows steady year-over-year trends, with key concentrations in {effectiveData?.top_industries?.[0]?.industry || effectiveData?.top_industries?.[0]?.name || "Communication Technique"} and growing focus in {effectiveData?.top_industries?.[1]?.industry || "Computational Technology"}. Emerging technologies such as {techList?.[0]?.name || "—"} are shaping the current development landscape, while top innovators continue to drive contributions across multiple domains.
      </p>
    );
  }

  // Image2 style: Company-specific paragraph shown after company pie chart
  function renderCompanyPieFollowup() {
    // Build a short paragraph using highest industries
    const top1 = effectiveData?.top_industries?.[0]?.industry || effectiveData?.top_industries?.[0]?.name || "Communication Technique";
    return (
      <p className={styles.summaryParagraph}>
        {company?.name} demonstrates a well-diversified innovation strategy, with significant patent concentration in <strong>{top1}</strong> and emerging interest in computational and cross-domain technologies. This balance across sectors reflects a proactive approach toward future technologies and market adaptability.
      </p>
    );
  }

  // Image3 style: Company technology section paragraph (unique to company)
  function renderCompanyTechnologyFollowup() {
    // Example: picks a couple of top technology names (from technologies list or techList)
    const t1 = (technologies && technologies[0]?.name) || techList?.[0]?.name || "For selecting or indicating operating mode";
    const t2 = (technologies && technologies[1]?.name) || techList?.[1]?.name || "Constructional details or arrangements";
    return (
      <p className={styles.summaryParagraph}>
        Emerging focus areas include {t1}, {t2}. Several previously dominant areas show stabilization, while {t1} and {t2} technologies exhibit an upward trajectory.
      </p>
    );
  }

  // -------------------------------
  // Loading states
  // -------------------------------
  if (loading && company?.name) return <p className={styles.loadingText}>Loading insights…</p>;
  if (isTechMode && loadingTech) return <p className={styles.loadingText}>Loading technology insights…</p>;

  // -------------------------------
  // Stats configuration list (with YoY)
  // -------------------------------
  const statsToRender = isTechMode
    ? [
        ["Total Innovations", summary.applications?.toLocaleString() || "—"],
        ["YoY Innovation Growth", yoyGrowth],
        ["Active Countries", summary.totalCountries || "—"],
        ["Active Organizations", summary.totalOrganizations || "—"],
        ["Active Inventors", (techApi?.inventor_analysis?.total_inventors?.toLocaleString() || "—")],
        ["Impacted Industries", summary.industries || "—"],
      ]
    : [
        ["Innovations", summary.applications?.toLocaleString() || "—"],
        ["Inventors", effectiveData?.inventor_analysis?.total_inventors?.toLocaleString() || "—"],
        ["Industries", summary.industries || "—"],
        ["Technologies", summary.technologies || "—"],
      ];

  // -------------------------------
  // Render component UI
  // -------------------------------
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
              {downloading ? (
                <div className={styles.downloadLoader} title="Preparing PDF..." />
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
            {isTechMode
              ? "Technology intelligence — organizations, trends & people."
              : "Innovation intelligence — industries, technologies & people."}
          </p>
        </div>

        {/* Executive Summary (different shape for company vs technology) */}
        <h3 className={styles.sectionTitle}>{isTechMode ? "Technology Overview" : "Executive Summary"}</h3>
        <div className={styles.summaryContainer}>
          {isTechMode ? (
            <>
              <p className={styles.summaryParagraph}>
                <strong>{feedItem?.title || feedItem?.name}</strong> has recorded{" "}
                <strong>{summary.applications?.toLocaleString() || "—"}</strong> innovations across{" "}
                <strong>{summary.industries || "—"}</strong> industries. This technology shows active contribution from{" "}
                <strong>{techApi?.inventor_analysis?.total_inventors?.toLocaleString() || "—"}</strong> inventors globally.
              </p>
            </>
          ) : (
            <>
              {renderCompanyExecutiveSummary()}
            </>
          )}

          {/* Trend summary (shared) */}
          {trendPoints.length > 0 && (() => {
            const peak = trendPoints.reduce((max, t) => (t.count > max.count ? t : max), trendPoints[0]);
            const firstYear = trendPoints[0]?.year;
            const lastYear = trendPoints[trendPoints.length - 1]?.year;
            const change = (((trendPoints[trendPoints.length - 1].count - trendPoints[0].count) / (trendPoints[0].count || 1)) * 100).toFixed(1);
            return (
              <p className={styles.summaryParagraph}>
                Innovation activity peaked in <strong>{peak.year}</strong> with <strong>{peak.count.toLocaleString()}</strong> filings. From{" "}
                <strong>{firstYear}</strong> to <strong>{lastYear}</strong>, innovation volume has shown a{" "}
                <strong>{change > 0 ? `growth of ${change}%` : `decline of ${Math.abs(change)}%`}</strong>.
              </p>
            );
          })()}
        </div>

        {/* Stats */}
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
              datasets: [
                {
                  label: isTechMode ? "Technology Trend Over Time" : "YoY Innovation Activity",
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
                  ticks: { color: "#aaa", font: { size: 12 } },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(255,255,255,0.1)" },
                  ticks: { color: "#aaa", font: { size: 12 }, callback: (val) => `${val}` },
                },
              },
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw} Published` } } },
            }}
          />
          <div style={{ marginTop: 10, textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 500 }}>
            {isTechMode ? "Technology Trend Over Time" : "YoY Innovation Activity"}
          </div>
        </div>

        {/* NEW SECTIONS: Technology-only global map + rankings */}
        {isTechMode && (
          <div style={{ background: "transparent", marginTop: "5rem", marginBottom: "3rem" }}>
            <h3 className={styles.sectionTitle}>Global Reach & Markets</h3>

            <p style={{ color: "#fff", marginBottom: "1.5rem" }} className={styles.summaryParagraph}>
              {feedItem?.description || "High innovation density observed in North American and Asian markets."}
            </p>

            <div style={{ background: "transparent", borderRadius: "10px", marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
              <SimpleMap data={mapData} color="#4a90e2" backgroundColor="transparent" borderColor="#ccc" label="Global Innovation Map" />
            </div>

            <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: "1rem", color: "#fff" }}>
                Global Rankings
              </h3>
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

            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <h3 className={styles.sectionTitle}>Leading Organizations</h3>
              <p className={styles.subtext} style={{ marginBottom: "1rem" }}>
                Top organizations driving innovation in this domain.
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Rank</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Innovations</th>
                  </tr>
                </thead>
                <tbody>
                  {(techApi?.assignee_analysis?.top_assignees || topOrgsData)
                    .slice(0, 5)
                    .map((org, idx) => (
                      <tr key={idx}>
                        <td style={tdStyle}>{idx + 1}</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{org.assignee || org.name}</div>
                        </td>
                        <td style={tdStyle}>{(org.count || org.count === 0) ? (org.count).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Industry Distribution / Company pie header difference */}
       {!isTechMode && (
  <>
    <h3 className={styles.sectionTitle}>Industry Distribution</h3>

    <div className={styles.industrySection}>
      {/* PIE CHART */}
      <div className={styles.pieChartWrapper}>
        <Pie
          data={{
            labels: industryData.map((item) => item.name),
            datasets: [
              {
                label: "Industry Distribution",
                data: industryData.map((item) => parseFloat(item.percentage)),
                backgroundColor: colors,
                borderColor: "#000",
                borderWidth: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: { label: (context) => `${context.label}: ${context.formattedValue}%` },
              },
            },
          }}
        />
      </div>

      {/* LEGEND */}
      <div className={styles.legendWrapper}>
        {industryData.map((item, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: colors[i % colors.length] }} />
            <span className={styles.legendText}>
              {item.name} — {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* TABLE */}
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
  </>
)}


        {/* Company-specific paragraph after pie chart */}
        {!isTechMode && renderCompanyPieFollowup()}

        {/* People & Innovators */}
        {peopleList.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>People & Innovators</h3>
            <p className={styles.subtext}>{isTechMode ? "Inventors actively contributing to this technology." : "Top inventors and their activity trends."}</p>
            <div className={styles.peopleSection}>
              <table className={styles.peopleTable}>
                <thead>
                  <tr>
                    <th style={{ width: "60%" }}>Name</th>
                    <th style={{ width: "40%" }}>Innovations</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleList.map((p, i) => (
                    <tr key={i}>
                      <td className={styles.personName}>{p.name}</td>
                      <td className={styles.personPatents}>{p.patents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Technologies Developed / Related Technologies */}
        {!isTechMode && techList.length > 0 && (
  <>
    <h3 className={styles.sectionTitle}>Technologies Developed</h3>
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


        {/* Company-only technology followup paragraph */}
        {!isTechMode && techList.length > 0 && renderCompanyTechnologyFollowup()}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerLabel}>
          Incubig AI - RIX |{" "}
          <a href="/" className="incubigHyper" target="_blank" rel="noopener noreferrer">
            rix.incubig.org
          </a>{" "}
          © {year}
        </span>
      </div>
    </div>
  );
};

export default InsightsView;
