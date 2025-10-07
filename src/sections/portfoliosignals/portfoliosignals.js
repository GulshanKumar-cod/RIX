"use client";
import React, { useState, useEffect } from "react";
import "../portfoliosearch/portfoliosearch.css";
import styles from "../companylist/companylist.module.css";
import { capitalizeFirstLetter } from "@/actions/helper";

const tabsData = ["US", "DE", "CN", "JP", "IN"];
const companies = ["Tesla", "Samsung", "Siemens", "Apple", "Sony", "Nvidia"];

const normalizeCountry = (c) => {
  if (!c) return "";
  const val = c.trim().toUpperCase();
  if (val === "UNITED STATES") return "US";
  if (val === "GERMANY") return "DE";
  if (val === "CHINA") return "CN";
  if (val === "JAPAN") return "JP";
  if (val === "INDIA") return "IN";
  return val;
};

const SkeletonCard = () => (
  <div className="signal-card skeleton">
    <div className="signal-header">
      <div className="avatar skeleton-box"></div>
      <div className="company-meta">
        <div className="skeleton-box" style={{ width: "120px", height: "18px" }}></div>
        <div className="skeleton-box" style={{ width: "80px", height: "14px", marginTop: "6px" }}></div>
      </div>
    </div>
    <div className="skeleton-box" style={{ width: "100%", height: "14px", marginTop: "12px" }}></div>
    <div className="skeleton-box" style={{ width: "90%", height: "14px", marginTop: "8px" }}></div>
    <div className="skeleton-box" style={{ width: "60%", height: "14px", marginTop: "8px" }}></div>
  </div>
);

const fetchApplications = async (company, page = 1, limit = 5) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_INCUBIG_API_KEY;

    const response = await fetch(
      `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(company)}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch applications");
    }

    const data = await response.json();
    const apps = data.applications || [];
    const start = (page - 1) * limit;
    return apps.slice(start, start + limit);
  } catch (err) {
    console.error("Error fetching applications:", err);
    return [];
  }
};

const ReadMore = ({ text, maxChars = 150 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxChars;

  const displayText = !expanded && isLong ? text.slice(0, maxChars) + "..." : text;

  return (
    <p className="description">
      {displayText}{" "}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "#0070f3",
            cursor: "pointer",
            padding: 0,
            fontSize: "0.9em",
            fontWeight: "600",
          }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
};


const PortfolioSignals = () => {
  const [activeTab, setActiveTab] = useState("US");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [allSignals, setAllSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      const cached = localStorage.getItem("signalsData");

      if (cached) {
        setAllSignals(JSON.parse(cached));
        setLoading(false);
        return;
      }

      setLoading(true);
      let all = [];

      for (let company of companies) {
        try {
          const apps = await fetchApplications(company, 1, 20);
         const mapped = apps.map((app) => ({
  title: app.title,
  description: app.abstract,
  author: app.name,
  date: app.publication_date || app.application_date,
  company,
  country: normalizeCountry(app.country),
  industry: app.industry ? app.industry.trim() : null,
  tags: [
    normalizeCountry(app.country),
    app.industry ? app.industry.trim() : null,
    app.publication_date || app.application_date || "Unknown Date",
  ].filter(Boolean),
}));


          all.push(...mapped);
        } catch (err) {
          console.error("Error loading data for", company, err);
        }
      }

      setAllSignals(all);
      localStorage.setItem("signalsData", JSON.stringify(all));
      setLoading(false);
    }

    loadAllData();
  }, []);

  useEffect(() => {
    setSelectedIndustry("");
  }, [activeTab]);

  const filteredSignals = allSignals.filter((s) => {
    const matchCountry = activeTab ? s.country === activeTab : true;
    const matchIndustry = selectedIndustry ? s.industry === selectedIndustry : true;
    return matchCountry && matchIndustry;
  });

  const industryOptions = [
    ...new Set(
      allSignals
        .filter((s) => (activeTab ? s.country === activeTab : true))
        .map((s) => s.industry)
        .filter(Boolean)
    ),
  ];

   useEffect(() => {
    setSelectedIndustry("");
  }, [activeTab]);

  const countryOptions = [
    ...new Set(allSignals.map((s) => s.country).filter(Boolean)),
  ];

  const countryStats = {};
  const industryStats = {};
  const companyStats = {};

  allSignals.forEach((s) => {
    if (s.country) countryStats[s.country] = (countryStats[s.country] || 0) + 1;
    if (s.industry)
      industryStats[s.industry] = (industryStats[s.industry] || 0) + 1;
    if (s.company) companyStats[s.company] = (companyStats[s.company] || 0) + 1;
  });

  const topCountries = Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topIndustries = Object.entries(industryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topCompanies = Object.entries(companyStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>
          <div className="signals-container">

            <div style={{ marginBottom: '1.5rem', marginTop: "1.5rem" }}>
    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
     Signals
    </h2>
    <p style={{ fontSize: '0.8rem', margin: 0 }}>
      Discover the applications driving innovation.
    </p>
  </div>

              <hr className="mb-3" />
            {/* <h3 className={styles.headingH3 }
            >
              Signals
            </h3> */}

            {/* Tabs and Dropdown */}
            <div
              className="signals-tabs"
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {countryOptions.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-pill ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="industry-dropdown"
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #333",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                <option value="">All Industries</option>
                {industryOptions.map((industry, i) => (
                  <option key={i} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout: Feed and Sidebar */}
            <div className="signals-layout">
              {/* Feed */}
              <div className="signals-feed">
                {loading ? (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </>
                ) : (
                  filteredSignals.map((signal, index) => (
                    <div key={index} className="signal-card">
                      <div className="signal-header">
                        <div className="avatar">{signal.company[0]}</div>
                        <div className="company-meta">
                          <h3 className="company">{signal.company}</h3>
                          <div className="tags">
                            {signal.tags.map((tag, i) => (
                              <span key={i} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* <span className="date">{signal.date}</span> */}
                      </div>
                      <p className="title mt-3">
                       <strong>{capitalizeFirstLetter(signal.title)}</strong>
                      </p>
                      {signal.author && (
                        <p className="author">Patent by {signal.author}</p>
                      )}
                    <ReadMore text={signal.description} />
                      
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar */}
              <div className="signals-sidebar">
                <div className="sidebar-card">
                  <h4>🌍 Top Countries</h4>
                  <ul>
                    {topCountries.map(([country, count]) => (
                      <li key={country}>
                        {country} <span className="growth">+{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-card">
                  <h4>📦 Trending Industries</h4>
                  <ul>
                    {topIndustries.map(([industry, count]) => (
                      <li key={industry}>
                        {industry} <span className="growth">+{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-card">
                  <h4>📈 Active Companies</h4>
                  <ul>
                    {topCompanies.map(([company, count]) => (
                      <li key={company}>
                        {company} <span className="growth">+{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSignals;
