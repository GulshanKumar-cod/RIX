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
import OverviewTab from "./overview";
import CompaniesTab from "./companies";
import CountriesTab from "./countries";
import TechTab from "./tech";

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
  {
  name: "Meta platforms, inc.",
  patents: 474,
  industries: 21,
  technologies: 263,
  inventors: 1346,
  country: "United States",
  industry: "Artificial Intelligence",
  top_inventor: "Harikrishna madadi reddy",
},
{
  name: "Pfizer inc.",
  patents: 390,
  industries: 8,
  technologies: 130,
  inventors: 1041,
  country: "United States",
  industry: "Pharmaceuticals",
  top_inventor: "Annaliesa sybil anderson",
},
{
  name: "Ballard power systems inc.",
  patents: 9,
  industries: 1,
  technologies: 6,
  inventors: 18,
  country: "Canada",
  industry: "Fuel Cells",
  top_inventor: "Rajesh bashyam",
}

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
      history: [5, 7, 9, 11, 13, 34, 55],
      topCountry: [
        { name: "United States", applications: 12000, increment: "+12%" },
        { name: "China", applications: 11000, increment: "+10%" },
        { name: "Germany", applications: 5000, increment: "+8%" },
        { name: "Japan", applications: 4800, increment: "+6%" },
        { name: "South Korea", applications: 4500, increment: "+5%" },
      ],
      topCompany: [
        { name: "IBM", applications: 3200, increment: "+5%" },
        { name: "Samsung", applications: 3100, increment: "+6%" },
        { name: "Intel", applications: 2900, increment: "+7%" },
        { name: "Microsoft", applications: 2700, increment: "+4%" },
        { name: "Qualcomm", applications: 2500, increment: "+3%" },
      ],
      topTechnology: "Battery Cooling Systems",
      topInventor: "Li Wei",
      descriptionsByTab: {
        Overview:
          "EV Innovation led by China, US & Korea in battery & AI systems.",
        Companies:
          "Top automotive firms like Tesla, Bosch, and Toyota dominate the patent landscape in electric and autonomous vehicle systems.",
        Countries: "The USA is leading innovations in Vehicle Industry.",
        Tech: "Key emerging technologies include battery cooling systems, ADAS, hydrogen fuel tech, and AI-powered mobility platforms.",
      },
    },
    {
      rank: 2,
      name: "Biological Computer Models",
      change: "+44%",
      patents: 80500,
      tags: ["Neural computation", "Synthetic biology"],
      history: [8, 10, 14, 18, 20, 34, 55],
      topCountry: [
        { name: "United States", applications: 12000, increment: "+12%" },
        { name: "China", applications: 11000, increment: "+10%" },
        { name: "Germany", applications: 5000, increment: "+8%" },
        { name: "Japan", applications: 4800, increment: "+6%" },
        { name: "South Korea", applications: 4500, increment: "+5%" },
      ],
      topCompany: [
        { name: "IBM", applications: 3200, increment: "+5%" },
        { name: "Samsung", applications: 3100, increment: "+6%" },
        { name: "Intel", applications: 2900, increment: "+7%" },
        { name: "Microsoft", applications: 2700, increment: "+4%" },
        { name: "Qualcomm", applications: 2500, increment: "+3%" },
      ],
      topTechnology: "Neural Signal Mapping",
      topInventor: "Dr. Jane Smith",
      descriptionsByTab: {
        Overview:
          "Breakthroughs in brain-inspired computing systems are being pioneered by US and European institutions in neuroscience and AI fusion.",
        Companies:
          "IBM and Intel are pushing the frontiers of biological computing, investing heavily in neural processing and synthetic biology models.",
        Countries:
          "The United States leads this space, followed by China and Germany, with a sharp rise in collaborative patents across academia and industry.",
        Tech: "Core technologies include neural signal mapping, brain-computer interfaces, and molecular-level computation models.",
      },
    },
    {
      rank: 3,
      name: "AI for EV",
      change: "+36%",
      patents: 60400,
      tags: ["Predictive BMS", "Anomaly detection"],
      history: [10, 13, 18, 22, 26, 34, 55],
      topCountry: [
        { name: "United States", applications: 12000, increment: "+12%" },
        { name: "China", applications: 11000, increment: "+10%" },
        { name: "Germany", applications: 5000, increment: "+8%" },
        { name: "Japan", applications: 4800, increment: "+6%" },
        { name: "South Korea", applications: 4500, increment: "+5%" },
      ],
      topCompany: [
        { name: "IBM", applications: 3200, increment: "+5%" },
        { name: "Samsung", applications: 3100, increment: "+6%" },
        { name: "Intel", applications: 2900, increment: "+7%" },
        { name: "Microsoft", applications: 2700, increment: "+4%" },
        { name: "Qualcomm", applications: 2500, increment: "+3%" },
      ],
      topTechnology: "Predictive Battery Analytics",
      topInventor: "Lee Sung-ho",
      descriptionsByTab: {
        Overview:
          "Korea and China are leading innovation in AI applications for electric vehicles, focusing on predictive systems and efficiency optimization.",
        Companies:
          "Tech-driven firms like Samsung, IBM, and Microsoft are applying AI models to optimize EV powertrains, safety, and maintenance.",
        Countries:
          "Korea and China have rapidly increased AI-EV patent activity, with significant contributions from US-based R&D as well.",
        Tech: "Predictive BMS, anomaly detection systems, and AI-powered fleet management tools are at the core of this innovation wave.",
      },
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

  // Filter companies relevant to selected industry
  const relevantCompanies = dummyCompanies.filter(
    (company) => company.industry === selectedIndustry?.name
  );

  // 🔹 Group by Country
  const countryMap = {};
  relevantCompanies.forEach((c) => {
    if (!countryMap[c.country]) {
      countryMap[c.country] = { name: c.country, applications: 0, count: 0 };
    }
    countryMap[c.country].applications += c.patents;
    countryMap[c.country].count += 1;
  });

  const topCountries = Array.isArray(selectedIndustry?.topCountry)
    ? selectedIndustry.topCountry
    : Object.values(countryMap)
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 5)
        .map((c) => ({
          ...c,
          increment: `+${(Math.random() * 10).toFixed(1)}%`,
        }));

  const topCompanies = Array.isArray(selectedIndustry?.topCompany)
    ? selectedIndustry.topCompany
    : relevantCompanies
        .sort((a, b) => b.patents - a.patents)
        .slice(0, 5)
        .map((company) => ({
          name: company.name,
          applications: company.patents,
          increment: `${increments[company.name] || "+0.0"}%`,
        }));

  const suggestedIndustries = [
    {
      rank: 99,
      name: "Artificial Intelligence",
      change: "+36%",
      patents: 60400,
      tags: ["Predictive BMS", "Anomaly detection"],
      history: [10, 13, 18, 22, 26, 34, 55],
      topCountry: [
        { name: "United States", applications: 12000, increment: "+12%" },
        { name: "China", applications: 11000, increment: "+10%" },
        { name: "Germany", applications: 5000, increment: "+8%" },
        { name: "Japan", applications: 4800, increment: "+6%" },
        { name: "South Korea", applications: 4500, increment: "+5%" },
      ],
      topCompany: [
        { name: "IBM", applications: 3200, increment: "+5%" },
        { name: "Samsung", applications: 3100, increment: "+6%" },
        { name: "Intel", applications: 2900, increment: "+7%" },
        { name: "Microsoft", applications: 2700, increment: "+4%" },
        { name: "Qualcomm", applications: 2500, increment: "+3%" },
      ],
      topTechnology: "Predictive Battery Analytics",
      topInventor: "Lee Sung-ho",
      description: "Korea & China leading AI-powered EV systems.",
      descriptionsByTab: {
        Overview:
          "AI is rapidly transforming industries through automation, decision-making, and predictive capabilities, with Asia and the US leading patent growth.",
        Companies:
          "Tech giants like IBM, Microsoft, and Samsung are at the forefront of AI development, focusing on edge computing and AI optimization layers.",
        Countries:
          "The US and China are dominating AI research, while Europe shows strong momentum in ethical AI and regulatory frameworks.",
        Tech: "Top AI innovations include neural network optimization, real-time analytics engines, and predictive models for smart systems.",
      },
    },
    {
      rank: 100,
      name: "Pharmaceuticals",
      change: "+36%",
      patents: 60400,
      tags: ["Predictive BMS", "Anomaly detection"],
      history: [10, 13, 18, 22, 26, 34, 55],
      topCountry: [
        { name: "United States", applications: 12000, increment: "+12%" },
        { name: "China", applications: 11000, increment: "+10%" },
        { name: "Germany", applications: 5000, increment: "+8%" },
        { name: "Japan", applications: 4800, increment: "+6%" },
        { name: "South Korea", applications: 4500, increment: "+5%" },
      ],
      topCompany: [
        { name: "IBM", applications: 3200, increment: "+5%" },
        { name: "Samsung", applications: 3100, increment: "+6%" },
        { name: "Intel", applications: 2900, increment: "+7%" },
        { name: "Microsoft", applications: 2700, increment: "+4%" },
        { name: "Qualcomm", applications: 2500, increment: "+3%" },
      ],
      topTechnology: "Predictive Battery Analytics",
      topInventor: "Lee Sung-ho",
      description: "Korea & China leading AI-powered EV systems.",
      descriptionsByTab: {
        Overview:
          "Pharmaceutical innovation continues to surge, especially in areas like precision medicine, biologics, and AI-based drug discovery.",
        Companies:
          "Global leaders such as Pfizer, Roche, and Johnson & Johnson are leveraging AI and genomics to streamline drug development.",
        Countries:
          "The United States leads pharma innovation, followed by Europe and Asia, with a sharp rise in biotech-focused patents.",
        Tech: "Cutting-edge developments include mRNA platforms, gene therapies, and computational drug discovery engines.",
      },
    },
    {
      rank: 101,
      name: "Fuel Cells",
      change: "+36%",
      patents: 60400,
      tags: ["Predictive BMS", "Anomaly detection"],
      history: [10, 13, 18, 22, 26, 34, 55],
      topCountry: [
        { name: "United States", applications: 12000, increment: "+12%" },
        { name: "China", applications: 11000, increment: "+10%" },
        { name: "Germany", applications: 5000, increment: "+8%" },
        { name: "Japan", applications: 4800, increment: "+6%" },
        { name: "South Korea", applications: 4500, increment: "+5%" },
      ],
      topCompany: [
        { name: "IBM", applications: 3200, increment: "+5%" },
        { name: "Samsung", applications: 3100, increment: "+6%" },
        { name: "Intel", applications: 2900, increment: "+7%" },
        { name: "Microsoft", applications: 2700, increment: "+4%" },
        { name: "Qualcomm", applications: 2500, increment: "+3%" },
      ],
      topTechnology: "Predictive Battery Analytics",
      topInventor: "Lee Sung-ho",
      description: "Korea & China leading AI-powered EV systems.",
      descriptionsByTab: {
        Overview:
          "Fuel cell technology is experiencing a resurgence as industries seek cleaner energy alternatives, especially in transport and heavy industries.",
        Companies:
          "Hyundai, Toyota, and Ballard Power are investing heavily in PEM and SOFC technologies, driving global innovation.",
        Countries:
          "Japan and South Korea are pioneering national-level initiatives in fuel cells, with the US following closely in industrial applications.",
        Tech: "Focus areas include proton exchange membrane fuel cells, hydrogen storage, and solid oxide technologies.",
      },
    },
  ];

  // Render function for active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <OverviewTab
            selectedIndustry={selectedIndustry}
            activeTab={activeTab}
            topCountries={topCountries}
            topCompanies={topCompanies}
          />
        );
      case "Companies":
        return (
          <CompaniesTab
            selectedIndustry={selectedIndustry}
            activeTab={activeTab}
            dummyCompanies={
    relevantCompanies.length > 0
      ? relevantCompanies
      : (selectedIndustry?.topCompany || [])
  }
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
            increments={increments}
            goToCompanyPage={goToCompanyPage}
            handleAddCompany={handleAddCompany}
          />
        );
      case "Countries":
        return (
          <CountriesTab
            selectedIndustry={selectedIndustry}
            activeTab={activeTab}
          />
        );
      case "Tech":
        return <TechTab />;
      default:
        return null;
    }
  };

  return (
    <div>
      {!selectedIndustry && <hr className="mb-4" />}

      {/* 🔹 Suggested Industries Section */}
      {!selectedIndustry && (
        <div style={{ marginBottom: "2rem" }}>
          <h3 className={styles.headingH3}>Trending Industries</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {suggestedIndustries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  console.log("👉 Clicked Suggested:", item.name);
                  setSelectedIndustry(item);
                  setActiveTab("Overview");
                }}
                style={{
                  background: "linear-gradient(90deg, #007bff, #00bfff)",
                  border: "none",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔁 MAIN PAGE (Industry List) */}
      {!selectedIndustry && <h3 className={styles.headingH3}>Industry Feed</h3>}

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
              <div key={idx} className={styles.industryCard}>
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
                  Deep Dive
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0rem",
  }}
>
  {/* Back button */}
  <button
    onClick={() => {
      setSelectedIndustry(null);
      setActiveTab("Overview");
    }}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
  >
    <CircleArrowLeft size={24} color="#00bfff" />
  </button>

  {/* 1-Click Insight button */}
  <button
    className={styles.viewButton}
    style={{
      padding: "6px 12px",
      whiteSpace: "nowrap",
    }}
  >
    1-Click Insight
  </button>
</div>

          {/* 🔹 Summary Card */}
          <div style={{ color: "#fff", fontFamily: "DM Sans, sans-serif" }}>
            <div
              style={{
                position: "relative",
                marginBottom: "0rem",
                minHeight: "4rem", // Slightly taller to allow room
              }}
            >

              {/* Industry Title with extra paddingTop to push below button */}
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  paddingTop: "1.5rem",
                  maxWidth: "100%",
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                  // whiteSpace: "nowrap",
                }}
              >
                {selectedIndustry.name}
              </h3>
            </div>

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
                {selectedIndustry.patents?.toLocaleString() || "124,000"}{" "}
                innovations globally
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
                      ticks: { display: false },
                      grid: { display: false },
                    },
                    y: { display: false },
                  },
                }}
              />
            </div>

            {/* 🔹 Sub-tabs */}
            <div className={styles.subTabs}>
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

            {/* Render active tab content */}
            {renderActiveTab()}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioWeeklyIndustry;
