import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../companylist/companylist.module.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { CircleArrowLeft } from "lucide-react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

const dummyCompanies = [
  {
    name: "Robert bosch gmbh",
    patents: 6617,
    industries: 56,
    technologies: 2184,
    inventors: 7219,
    country: "Germany",
    industry: "Vehicles",
    top_inventor: "Mordechai kornbluth",
  },
  {
    name: "Ford global technologies, llc",
    patents: 6726,
    industries: 52,
    technologies: 1952,
    inventors: 6537,
    country: "United States",
    industry: "Vehicles",
    top_inventor: "Stuart c. salter",
  },
  {
    name: "Strong force iot",
    patents: 150,
    industries: 4,
    technologies: 19,
    inventors: 22,
    country: "United States",
    industry: "Biological Computer Models",
    top_inventor: "Jeffrey p. mcguckin",
  },
  {
    name: "International business machines corporation",
    patents: 23742,
    industries: 58,
    technologies: 2610,
    inventors: 20212,
    country: "United States",
    industry: "Biological Computer Models",
    top_inventor: "Sarbajit k. rakshit",
  },
];

const PortfolioWeeklyIndustry = ({
  refreshKey,
  selectedView,
  displayData = [],
}) => {
  const [expandedCard, setExpandedCard] = useState([]);
  const [selectedIndustryView, setSelectedIndustryView] = useState(null);
  const [increments, setIncrements] = useState({});
  const router = useRouter();

  useEffect(() => {
    const newIncrements = {};
    dummyCompanies.forEach((company) => {
      const randomVal = (
        Math.random() *
        10 *
        (Math.random() > 0.5 ? 1 : -1)
      ).toFixed(2);
      newIncrements[company.name] = randomVal;
    });
    setIncrements(newIncrements);
  }, []);

  const handleAddCompany = (company) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("portfolioStartups")) || [];
      const isDuplicate = existing.some((c) => c.name === company.name);

      if (!isDuplicate) {
        const companyWithIncrement = {
          ...company,
          increment: increments[company.name] || "0.00",
        };

        const updated = [...existing, companyWithIncrement];
        localStorage.setItem("portfolioStartups", JSON.stringify(updated));
        alert(`${company.name} added to portfolio.`);
      } else {
        alert(`${company.name} is already in your portfolio.`);
      }
    } catch (error) {
      console.error("Error adding company to portfolio:", error);
    }
  };

  const goToCompanyPage = (companyName) => {
    router.push(
      `https://dyr.incubig.org/company-page/${encodeURIComponent(
        companyName
      )}/overview`
    );
  };

  const industries = [
    {
      rank: 1,
      name: "Vehicles",
      change: "+18%",
      patents: 13,
      tags: ["AI-driven optimization"],
      history: [5, 7, 9, 11, 13],
    },
    {
      rank: 2,
      name: "Biological Computer Models",
      change: "+44%",
      patents: 20,
      tags: ["Mobility AI", "Sensor Fusion"],
      history: [8, 10, 14, 18, 20],
    },
    {
      rank: 3,
      name: "AI for EV",
      change: "+44%",
      patents: 26,
      tags: ["Predictive BMS", "Anomaly detection"],
      history: [10, 13, 18, 22, 26],
    },
    {
      rank: 4,
      name: "Hydrogen Fuel Cells",
      change: "+36%",
      patents: 11,
      tags: ["Closed-loop", "Hydrometallurgy"],
      history: [4, 6, 7, 10, 11],
    },
    {
      rank: 5,
      name: "Lithium Recycling",
      change: "+30%",
      patents: 15,
      tags: ["Closed-loop", "Hydrometallurgy"],
      history: [6, 8, 12, 14, 15],
    },
    {
      rank: 6,
      name: "Computational Technology",
      change: "-25%",
      patents: 11,
      tags: ["PEM stacks", "Green H2"],
      history: [12, 14, 13, 12, 11],
    },
  ];

  return (
    <div>
      {/* <h3 className={styles.headingH3}>Top Industries</h3> */}
      <hr className="mb-5" />

      {/* Filter Toggle for Weekly / Monthly */}

      {selectedIndustryView ? (
        <>
          {/* 🔙 Top bar with Back button and Industry Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => setSelectedIndustryView(null)}
              style={{
                // background: "none",
                // border: "none",
                // color: "#00bfff",
                // fontSize: "0.8rem",
                // fontWeight: "bold",
                // cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <CircleArrowLeft size={24} color="#00bfff" />
            </button>
            <h2 style={{ margin: 0, fontSize: "0.8rem", color: "#fff" }}>
              {selectedIndustryView}
            </h2>
          </div>

          {/* Company Cards Section */}
          <section className={styles.cardsWrapper}>
            {(displayData.length ? displayData : dummyCompanies).filter(
              (c) => c.industry === selectedIndustryView
            ).length === 0 ? (
              <div>No companies match your search</div>
            ) : (
              <div className={styles.cardsScrollableContainer}>
                <div className={styles.cardsGrid}>
                  {(displayData.length ? displayData : dummyCompanies)
                    .filter((item) => item.industry === selectedIndustryView)
                    .map((item, i) => {
                      const cardKey = `${item.name ?? "company"}_${i}`;
                      const isExpanded = expandedCard.includes(cardKey);

                      return (
                        <div
                          key={cardKey}
                          className={`${styles.companyCard} ${
                            isExpanded ? styles.expanded : ""
                          }`}
                        >
                          {/* 🔹 Header */}
                          <div className={styles.cardHeader}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <h3
                                className={styles.companyName}
                                style={{ fontSize: "1.2rem" }}
                              >
                                {item.name}
                              </h3>
                              <span
                                className={styles.companyName}
                                style={{
                                  color: item.increment < 0 ? "red" : "green",
                                }}
                              >
                                {item.increment}%
                              </span>
                            </div>

                            <div className={styles.tagsRow}>
                              <span className={styles.tagSearch}>
                                {item.country}
                              </span>
                              <span className={styles.tagSearch}>
                                {item.industry}
                              </span>
                            </div>
                          </div>

                          <p
                            style={{
                              marginTop: "15px",
                              fontSize: "0.8rem",
                              color: "#4da6ff",
                              textShadow:
                                "0 0 0px #4da6ff, 0 0 2px #4da6ff, 0 0 5px #4da6ff",
                            }}
                          >
                            {item.patents} new developments.
                          </p>

                          <hr className={styles.divider} />

                          {/* Toggle for details */}
                          <button
                            type="button"
                            className={styles.detailsToggle}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard((prev) =>
                                prev.includes(cardKey)
                                  ? prev.filter((key) => key !== cardKey)
                                  : [...prev, cardKey]
                              );
                            }}
                            aria-expanded={isExpanded}
                            title={
                              isExpanded ? "Collapse details" : "Expand to view"
                            }
                          >
                            <span
                              className={styles.detailsLabel}
                              style={{ fontSize: "0.8rem" }}
                            >
                              Details
                            </span>
                            <span
                              className={styles.arrow}
                              style={{ fontSize: "0.8rem" }}
                              aria-hidden="true"
                            >
                              {isExpanded ? "▲" : "▼"}
                            </span>
                          </button>

                          {/* Expandable Section */}
                          <div
                            className={`${styles.expandedContent} ${
                              isExpanded ? styles.show : ""
                            }`}
                          >
                            <div className={styles.detailRow}>
                              <span>Industries</span>
                              <span>{item.industries}</span>
                            </div>
                            <div className={styles.detailRow}>
                              <span>Technologies</span>
                              <span>{item.technologies}</span>
                            </div>
                            <div className={styles.detailRow}>
                              <span>Inventors</span>
                              <span>{item.inventors}</span>
                            </div>
                            <div className={styles.detailRow}>
                              <span>Top Inventor</span>
                              <span>{item.top_inventor}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className={styles.cardAction}>
                            <button
                              className={styles.viewButton}
                              onClick={() => goToCompanyPage(item.name)}
                            >
                              View
                            </button>
                            <button
                              className={styles.addPortfolio}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddCompany(item);
                              }}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
        </>
      ) : (
        // 🔁 Original Industry Cards Section
        <div className={styles.weeklyGrid}>
          {industries.map((ind, idx) => {
            const chartData = {
              labels:
                selectedView === "weekly"
                  ? ind.history.map((_, i) => `W${i + 1}`)
                  : ind.history.map((_, i) => `M${i + 1}`),
              datasets: [
                {
                  data: ind.history,
                  borderColor: "#00bfff",
                  backgroundColor: "rgba(0,191,255,0.2)",
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                },
              ],
            };

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                x: { display: false },
                y: { display: false },
              },
            };

            return (
              <div
                key={`${idx}-${refreshKey}`}
                className={styles.industryCard}
                style={{
                  background: "transparent",
                  border: "0.5px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "1.2rem",
                  color: "white",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {/* 🎯 Industry Card Content */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    #{ind.rank}
                  </span>
                  <span
                    style={{
                      color: ind.change.startsWith("+") ? "#00ff88" : "#ff4d4d",
                    }}
                  >
                    {ind.change}
                  </span>
                </div>

                <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>
                  {ind.name}
                </h4>

                <p
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.8,
                    color: "#4da6ff",
                    textShadow:
                      "0 0 0px #4da6ff, 0 0 2px #4da6ff, 0 0 5px #4da6ff",
                  }}
                >
                  Active Companies: {ind.patents}
                </p>

                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {ind.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#1e2a3a",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: "1rem", height: "70px" }}>
                  <Line data={chartData} options={chartOptions} />
                </div>

                <button
                  onClick={() => setSelectedIndustryView(ind.name)}
                 
                  style={{
                    color: "#fff",
    cursor: "pointer"    ,
    background: "linear-gradient(90deg, #007bff, #00bfff)",
    border: "none",
    borderRadius: "20px",
    padding: "6px 10px",
    fontSize: ".8rem",
                  }}
                >
                  View companies
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioWeeklyIndustry;
