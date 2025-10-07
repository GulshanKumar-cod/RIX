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
  Tooltip,
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
  selectedIndustry,
  setSelectedIndustry,
  refreshKey,
  selectedView,
  displayData = [],
}) => {
  const [expandedCard, setExpandedCard] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
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

  const industries = [
    {
      rank: 1,
      name: "Vehicles",
      change: "+18%",
      patents: 124500,
      tags: ["AI-driven optimization"],
      history: [5, 7, 9, 11, 13],
      topCountry: "China",
      topCompany: "BYD",
      topTechnology: "Battery Cooling Systems",
      topInventor: "Li Wei",
      description:
        "EV Innovation led by China, US & Korea in battery & AI systems.",
    },
    {
      rank: 2,
      name: "Biological Computer Models",
      change: "+44%",
      patents: 80500,
      tags: ["Neural computation", "Synthetic biology"],
      history: [8, 10, 14, 18, 20],
      topCountry: "United States",
      topCompany: "IBM",
      topTechnology: "Neural Signal Mapping",
      topInventor: "Dr. Jane Smith",
      description:
        "Breakthroughs in brain-inspired systems led by US & Europe.",
    },
    {
      rank: 3,
      name: "AI for EV",
      change: "+36%",
      patents: 60400,
      tags: ["Predictive BMS", "Anomaly detection"],
      history: [10, 13, 18, 22, 26],
      topCountry: "Korea",
      topCompany: "Hyundai",
      topTechnology: "Predictive Battery Analytics",
      topInventor: "Lee Sung-ho",
      description: "Korea & China leading AI-powered EV systems.",
    },
  ];

  const handleAddCompany = (company) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("portfolioStartups")) || [];
      const isDuplicate = existing.some((c) => c.name === company.name);

      if (!isDuplicate) {
        const updated = [
          ...existing,
          { ...company, increment: increments[company.name] || "0.00" },
        ];
        localStorage.setItem("portfolioStartups", JSON.stringify(updated));
        alert(`${company.name} added to portfolio.`);
      } else {
        alert(`${company.name} is already in your portfolio.`);
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const goToCompanyPage = (companyName) => {
    router.push(
      `https://dyr.incubig.org/company-page/${encodeURIComponent(
        companyName
      )}/overview`
    );
  };

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div>
   {!selectedIndustry && <hr className="mb-4" />}


      {/* 🔁 MAIN PAGE (Industry List) */}
      {!selectedIndustry ? (
        <div className={styles.weeklyGrid}>
          {industries.map((ind, idx) => {
            const chartData = {
              labels: ["2018", "2024"],
              datasets: [
                {
                  data: ind.history,
                  borderColor: "#00bfff",
                  backgroundColor: "rgba(0,191,255,0.2)",
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                  fill: true,
                },
              ],
            };

            return (
              <div
                key={idx}
                className={styles.industryCard}
              >
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
                    color: "#4da6ff",
                    textShadow: "0 0 3px #4da6ff",
                  }}
                >
                  Active Companies: {ind.patents}
                </p>

                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    gap: "0.5rem",
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
                  <Line data={chartData} options={baseChartOptions} />
                </div>

                <button
                  onClick={() => setSelectedIndustry(ind)}
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    border: "none",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    fontSize: ".8rem",
                    marginTop: "10px",
                  }}
                >
                  Explore
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* 🔙 Back Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => {
                setSelectedIndustry(null);
                setActiveTab("Overview");
              }}
              style={{
                marginRight: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <CircleArrowLeft size={24} color="#00bfff" />
            </button>
          </div>

         {/* 🔹 Summary Card */}
<div
  style={{
    color: "#fff",
    fontFamily: "DM Sans, sans-serif",
  }}
>
  {/* Title */}
  <h3
    style={{
      marginBottom: "1rem",
      fontSize: "1.5rem",
      fontWeight: 600,
    }}
  >
    {selectedIndustry.name}
  </h3>

  {/* Patents line with YoY */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
    }}
  >
    <p
      style={{
        fontSize: "0.8rem",
        opacity: 0.9,
        margin: 0,
        fontWeight: 500,
      }}
    >
      {selectedIndustry.patents?.toLocaleString() || "124,000"} innovations globally
    </p>
    <span
      style={{
        color: "#00ff88",
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      {selectedIndustry.change || "+14%"} YoY
    </span>
  </div>

  {/* Line Chart */}
<div style={{ height: "100px", marginBottom: "1.5rem" }}>
  <Line
    data={{
      labels: ["2018", "2019", "2020", "2021", "2022"],
      datasets: [
        {
          data: selectedIndustry.history || [5, 7, 9, 11, 13],
          borderColor: "#00bfff",
          backgroundColor: "rgba(0,191,255,0.2)",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: { display: false },
        },
        y: {
          display: false,
        },
      },
    }}
  />
</div>


  {/* 🔹 Sub-tabs */}
  <div className={styles.subTabs}
  >
    {["Overview", "Countries", "Companies", "Tech"].map((tab) => (
      <button
        key={tab}
      className={`${styles.subTabButton} ${
                  activeTab === tab ? styles.activeSubTab : ""
                }`}
                onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* ✅ Conditionally show Description and Info Grid only in Overview tab */}
  {activeTab === "Overview" && (
    <>
      {/* Description */}
      <p
        style={{
          fontSize: "0.9rem",
          color: "#fff",
          margin: "0 0 1.5rem 0",
          lineHeight: "1.4",
        }}
      >
        {selectedIndustry.description ||
          "The biotechnology industry is experiencing steady growth, with leading activity in the US, China, and Europe."}
      </p>

      {/* Info Grid */}
   <section className={styles.statsSection}>
  {[
     {
      label: "Innovations",
      value: "1299",
    },
    {
      label: "Countries",
      value: "12",
    },
    {
      label: "Companies",
      value: "34",
    },
    {
      label: "Technologies",
      value: "70",
    },
   
  ].map((item, i) => (
    <div className={styles.statsCard} key={i}>
      <h3 className={styles.statsValue}>{item.value}</h3>
      <p className={styles.statsLabel}>{item.label}</p>
    </div>
  ))}
</section>

    </>
  )}
</div>


          {/* 🏢 Companies Tab (Filtered) */}
          {activeTab === "Companies" && (
            <section className={styles.cardsWrapper}>
              {dummyCompanies.filter(
                (c) => c.industry === selectedIndustry.name
              ).length === 0 ? (
                <div
                  style={{
                    padding: "14px 16px",
                    textAlign: "center",
                    color: "#9bb5ff",
                  }}
                >
                  No companies match your search
                </div>
              ) : (
                <div className={styles.cardsScrollableContainer}>
                  <div className={styles.cardsGrid}>
                    {dummyCompanies
                      .filter((c) => c.industry === selectedIndustry.name)
                      .map((item, i) => {
                        const randomIncrement =
                          Math.floor(Math.random() * 31) - 10;
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
                                    color:
                                      randomIncrement < 0
                                        ? "#ff4d4d"
                                        : "#00ff88",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {randomIncrement > 0
                                    ? `+${randomIncrement}%`
                                    : `${randomIncrement}%`}
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

                            {/* 🔹 Summary Line */}
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

                            {/* 🔹 Toggle for details */}
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
                                isExpanded
                                  ? "Collapse details"
                                  : "Expand to view"
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

                            {/* 🔹 Expandable Section */}
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

                            {/* 🔹 Action Buttons */}
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
          )}

          {/* 📊 Countries Tab */}
          {activeTab === "Countries" && (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#9bb5ff" }}
            >
           
              <p>
                Sign up to view.
              </p>
            </div>
          )}

          {/* 🔬 Technologies Tab */}
          {activeTab === "Tech" && (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#9bb5ff" }}
            >
              <p>
                Sign up to view.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioWeeklyIndustry;
