"use client";
import React, { useEffect, useState } from "react";
import styles from "../companylist/companylist.module.css";
import "../portfoliosearch/portfoliosearch.css";
import { capitalizeFirstLetter } from "@/actions/helper";

// Skeleton loading card
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

// Helper functions
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

const LensSignals = () => {
  const [companies, setCompanies] = useState([]);
  const [signals, setSignals] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("portfolioStartups");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const names = parsed.map((c) => c.name);
    setCompanies(names);

    const fetchAllSignals = async () => {
      setLoading(true);
      let all = [];

      for (let name of names) {
        try {
          const apps = await fetchApplications(name, 1, 20);
          const mapped = apps.map((app) => ({
            title: app.title,
            description: app.abstract,
            author: app.name,
            date: app.publication_date || app.application_date,
            company: name,
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
          console.error("Error loading signals for", name);
        }
      }

      setSignals(all);
      setLoading(false);
    };

    fetchAllSignals();
  }, []);

  useEffect(() => {
    setSelectedIndustry("");
  }, [activeTab]);

  const filteredSignals = signals.filter((s) => {
    const matchCountry = activeTab ? s.country === activeTab : true;
    const matchIndustry = selectedIndustry ? s.industry === selectedIndustry : true;
    return matchCountry && matchIndustry;
  });

  const countryOptions = [...new Set(signals.map((s) => s.country).filter(Boolean))];
  const industryOptions = [
    ...new Set(
      signals
        .filter((s) => (activeTab ? s.country === activeTab : true))
        .map((s) => s.industry)
        .filter(Boolean)
    ),
  ];

  // Sidebar Stats
  const countryStats = {};
  const industryStats = {};
  const companyStats = {};

  signals.forEach((s) => {
    if (s.country) countryStats[s.country] = (countryStats[s.country] || 0) + 1;
    if (s.industry) industryStats[s.industry] = (industryStats[s.industry] || 0) + 1;
    if (s.company) companyStats[s.company] = (companyStats[s.company] || 0) + 1;
  });

  const topCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topIndustries = Object.entries(industryStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCompanies = Object.entries(companyStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (companies.length === 0) {
    return (
      <div style={{ color: "#ccc" }}>
        <p>No companies added to your portfolio yet.</p>
    <button  onClick={() => router.push("/companylist?tab=search")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
           marginTop: "1rem",
           fontSize: "0.8rem"
          }}>+ Add companies</button>
      </div>
    );
  }

  return (
    <div>
          <hr className="mb-3" />
          <h3 className={styles.headingH3}>Signals from Your Portfolio</h3>

          {/* Tabs and Filter */}
          <div className="signals-tabs">
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

          {/* Layout */}
          <div className="signals-layout">
            {/* Feed */}
            <div className="signals-feed">
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </>
              ) : filteredSignals.length === 0 ? (
                <p style={{ color: "#aaa" }}>No signals found for selected filters.</p>
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
                    </div>
                    <p className="title mt-3">
                      <strong>{capitalizeFirstLetter(signal.title)}</strong>
                    </p>
                    {signal.author && <p className="author">Patent by {signal.author}</p>}
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
  );
};

export default LensSignals;
