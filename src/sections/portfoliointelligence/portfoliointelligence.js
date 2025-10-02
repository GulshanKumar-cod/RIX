"use client";
import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "../companylist/companylist.module.css";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

const parseIncrementValue = (val) => {
  if (typeof val === "string") {
    return parseFloat(val.replace("%", ""));
  }
  return val;
};

const API_KEY =
  "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4";

// Cache object to store trends data
const trendsCache = {};

const PortfolioIntelligence = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [apiTrends, setApiTrends] = useState({});
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [yearLabels, setYearLabels] = useState([]);

  const getLastNQuarters = (n = 4) => {
    const quarters = [];
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let q = Math.floor(month / 3) + 1;
    for (let i = 0; i < n; i++) {
      quarters.unshift(`Q${q} ${year}`);
      q -= 1;
      if (q === 0) {
        q = 4;
        year -= 1;
      }
    }
    return quarters;
  };

  const quarterLabels = getLastNQuarters(4);

  const fetchTrendData = async (companyName) => {
    // Check if data is already in cache
    if (trendsCache[companyName]) {
      console.log(`Using cached data for ${companyName}`);
      return trendsCache[companyName];
    }

    try {
      const response = await fetch(
        `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(
          companyName
        )}`,
        { headers: { "x-api-key": API_KEY } }
      );
      if (!response.ok) throw new Error("API fetch failed");

      const data = await response.json();

      const years = data.application_trends.map((t) => t.year.toString());
      const trendData = data.application_trends.map((t) => t.count);

      const result = { name: companyName, years, trendData };
      
      // Store in cache
      trendsCache[companyName] = result;
      console.log(`Cached data for ${companyName}`);
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch trends for ${companyName}:`, error);
      const result = { name: companyName, years: [], trendData: [] };
      
      // Cache even error results to prevent repeated failed requests
      trendsCache[companyName] = result;
      return result;
    }
  };

  const fetchAllTrends = async () => {
    setLoadingTrends(true);
    try {
      const promises = companies.map((c) => fetchTrendData(c.name));
      const results = await Promise.all(promises);

      const trendsByCompany = {};
      let mergedYears = new Set();

      results.forEach((res) => {
        trendsByCompany[res.name] = res.trendData;
        res.years.forEach((y) => mergedYears.add(y));
      });

      // Sort merged years numerically
      const sortedYears = Array.from(mergedYears).sort();

      setYearLabels(sortedYears);
      setApiTrends(trendsByCompany);
    } catch (err) {
      console.error("Error fetching all trends", err);
    } finally {
      setLoadingTrends(false);
    }
  };

  const fetchSingleCompanyTrend = async () => {
    setLoadingTrends(true);
    try {
      const result = await fetchTrendData(selectedCompany);
      
      setYearLabels(result.years);
      setApiTrends((prev) => ({
        ...prev,
        [selectedCompany]: result.trendData,
      }));
    } catch (e) {
      console.error("Failed to fetch trends:", e);
    } finally {
      setLoadingTrends(false);
    }
  };

  useEffect(() => {
    if (companies.length === 0) return;

    if (selectedCompany === "all") {
      fetchAllTrends();
    } else {
      fetchSingleCompanyTrend();
    }
  }, [selectedCompany, companies]);

  // Clear cache when companies list changes significantly
  useEffect(() => {
    // Optional: Clear cache when component unmounts or companies change significantly
    // This prevents stale data if the portfolio changes
    return () => {
      // Uncomment the line below if you want to clear cache on component unmount
      // Object.keys(trendsCache).forEach(key => delete trendsCache[key]);
    };
  }, [companies]);

  const toTitleCase = (str) =>
    str.replace(
      /\w\S*/g,
      (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
    );

  const makeTrendArrayForCompany = (company) => {
    const hist = company.trend || company.history || company.trends || null;
    if (Array.isArray(hist) && hist.length > 0) {
      const nums = hist.map(parseIncrementValue);
      if (nums.length >= quarterLabels.length) {
        return nums.slice(-quarterLabels.length);
      } else {
        const padCount = quarterLabels.length - nums.length;
        const padValue = nums[0] ?? parseIncrementValue(company.increment);
        const padding = Array(padCount).fill(padValue);
        return [...padding, ...nums];
      }
    }

    const base = parseIncrementValue(company.increment);
    const trend = [
      Math.round((base - 6) * 100) / 100,
      Math.round((base - 2) * 100) / 100,
      Math.round(base * 100) / 100,
      Math.round((base + 4) * 100) / 100,
    ];
    return trend;
  };

  const palette = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#e11d48",
    "#06b6d4",
    "#f472b6",
  ];

  const buildTrendsDatasets = () => {
    if (selectedCompany === "all") {
      return companies.map((c, idx) => {
        const data = apiTrends[c.name] || [];
        return {
          label: toTitleCase(c.name),
          data,
          borderColor: palette[idx % palette.length],
          backgroundColor: `${palette[idx % palette.length]}33`,
          tension: 0.3,
          pointRadius: isMobile ? 2 : 3,
          borderWidth: 2,
        };
      });
    } else {
      const data = apiTrends[selectedCompany] || [];
      return [
        {
          label: toTitleCase(selectedCompany),
          data,
          borderColor: palette[0],
          backgroundColor: `${palette[0]}33`,
          tension: 0.3,
          pointRadius: isMobile ? 3 : 4,
          borderWidth: 2.5,
        },
      ];
    }
  };

  const trendsData = {
    labels: yearLabels.length > 0 ? yearLabels : ["N/A"],
    datasets: buildTrendsDatasets(),
  };

  const trendsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: { family: "DM Sans, sans-serif", size: 12 },
        },
        display: companies.length <= 8 || selectedCompany !== "all",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const v = context.raw;
            return `${context.dataset.label}: ${v} patents`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Year", color: "#fff" },
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
      y: {
        title: {
          display: true,
          text: "Number of Patents Filed",
          color: "#fff",
        },
        ticks: {
          color: "#fff",
          callback: (val) => val,
        },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  useEffect(() => {
    const stored = localStorage.getItem("portfolioStartups");
    if (stored) {
      setCompanies(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (companies.length === 0) {
    return (
      <div style={{ color: "#ccc"}}>
        No portfolio intelligence available. Add startups to your portfolio first.
      </div>
    );
  }

  const increments = companies
    .map((c) => parseIncrementValue(c.increment))
    .filter((val) => !isNaN(val));

  const averageScore =
    increments.length > 0
      ? (increments.reduce((a, b) => a + b, 0) / increments.length).toFixed(2)
      : 0;

  let portfolioHealthStatus = "Strong";
  if (averageScore >= 2) {
    portfolioHealthStatus = "Healthy";
  } else if (averageScore <= -2) {
    portfolioHealthStatus = "Moderate";
  }

  const industryCount = new Set(companies.map((c) => c.industry)).size;

  const performanceGroups = {
    strong: companies
      .filter((c) => parseIncrementValue(c.increment) >= 20)
      .map((c) => c.name),
    moderate: companies
      .filter((c) => {
        const inc = parseIncrementValue(c.increment);
        return inc < 20 && inc >= 5;
      })
      .map((c) => c.name),
    risk: companies
      .filter((c) => parseIncrementValue(c.increment) < 5)
      .map((c) => c.name),
  };

  const industryMap = {};
  companies.forEach((c) => {
    industryMap[c.industry] = (industryMap[c.industry] || 0) + 1;
  });

  const industryDistribution = {
    labels: Object.keys(industryMap),
    datasets: [
      {
        data: Object.values(industryMap),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  return (
    <div style={{ color: "#fff" }}>

      <hr className="mb-3" />
      <h3 className={styles.headingH3}>Portfolio Intelligence</h3>

      {/* Summary Panel */}
    <section className={styles.statsSection}>
  {[
    ["Average Score", `${averageScore}%`],
    ["Companies Shown", companies.length],
    ["Portfolio Health", portfolioHealthStatus],
    ["Industries Covered", industryCount],
  ].map(([label, val], i) => (
    <div className={styles.statsCard} key={i}>
      {loading ? (
        <div className={styles.statsLoadingBar} />
      ) : (
        <h3
          className={styles.statsValue}
          style={{
            color:
              label === "Portfolio Health"
                ? val === "Healthy"
                  ? "#22c55e"
                  : val === "Moderate"
                  ? "#f59e0b"
                  : "#ef4444"
                : "#fff",
          }}
        >
          {val}
        </h3>
      )}
      <p className={styles.statsLabel}>{label}</p>
    </div>
  ))}
</section>


      {/* Performance Groups */}
    <section className={styles.performanceSection}>
  {[
    {
      title: "Strong Performers",
      list: performanceGroups.strong,
      borderColor: "#22c55e",
      titleColor: "#15803d",
    },
    {
      title: "Healthy Performers",
      list: performanceGroups.moderate,
      borderColor: "#f59e0b",
      titleColor: "#b45309",
    },
    {
      title: "Moderate Performers",
      list: performanceGroups.risk,
      borderColor: "#ef4444",
      titleColor: "#b91c1c",
    },
  ].map(({ title, list, borderColor, titleColor }, i) => (
    <div
      key={i}
      className={styles.performanceCard}
      style={{ borderTop: `4px solid ${borderColor}` }}
    >
      <h3
        className={styles.performanceTitle}
        style={{ color: titleColor }}
      >
        {title}
      </h3>
      <ul className={styles.performanceList}>
        {list.length === 0 ? (
          <li className={styles.performanceNone}>None</li>
        ) : (
          list.map((name, j) => (
            <li key={j} className={styles.performanceItem}>
              {toTitleCase(name)}
            </li>
          ))
        )}
      </ul>
    </div>
  ))}
</section>


      {/* Trends Section */}
      <section
        style={{
          marginTop: "2.5rem",
          marginBottom: "3rem",
          padding: "1.25rem",
          borderRadius: "12px",
          backgroundColor: "rgba(255,255,255,0.03)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 25,
    flexWrap: "wrap", // ✅ ensures wrapping on smaller screens
  }}
>
  <h3 className={styles.headingH3}
   
  >
    Filing Trends
  </h3>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap", 
      flex: "1 1 auto", 
      justifyContent: "flex-end", 
    }}
  >
    <select
      value={selectedCompany}
      onChange={(e) => setSelectedCompany(e.target.value)}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        background: "#0b1220",
        color: "#fff",
        border: "1px solid #2b2b2b",
        minWidth: "140px", 
        flex: "0 1 auto", 
        fontSize: "0.8rem",
      }}
    >
      <option value="all">All Companies</option>
      {companies.map((c, idx) => (
        <option key={idx} value={c.name}>
          {toTitleCase(c.name)}
        </option>
      ))}
    </select>
  </div>
</div>


        <div style={{ width: "100%", height: isMobile ? 300 : 420 }}>
          {loadingTrends ? (
            <p
              style={{ color: "#aaa", textAlign: "center", marginTop: "100px" }}
            >
              Loading trends...
            </p>
          ) : (
            <Line data={trendsData} options={trendsOptions} />
          )}
        </div>
      </section>
    

      {/* Portfolio Composition + Industry Distribution */}
      <section
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "2rem",
          flexWrap: "wrap",
          marginBottom: "3rem",
        }}
      >
        {/* Portfolio Composition */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            backgroundColor: "transparent",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3
           className={styles.headingH3}
          >
            Portfolio Composition
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {[
              ["Early Stage", 3],
              ["Growth Stage", 2],
              ["Global Startups", 3],
              ["Local Startups", 2],
            ].map(([label, count], i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  {label}
                </div>
                <div style={{ fontSize: "24px", fontWeight: "700" }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Distribution */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            backgroundColor: "transparent",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3
           className={styles.headingH3}
          >
            Industry Distribution
          </h3>
          {industryDistribution.labels.length === 0 ? (
            <p style={{ color: "#aaa" }}>No industry data available</p>
          ) : (
            <div className={styles.chartContainer}>
              <Pie
                data={industryDistribution}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: isMobile ? "bottom" : "right",
                      labels: {
                        boxWidth: 14,
                        boxHeight: 14,
                        padding: 12,
                        color: "#ffffff",
                        font: {
                          size: 14,
                          weight: "500",
                          family: "DM Sans, sans-serif",
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          return `${label}: ${value}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PortfolioIntelligence;
