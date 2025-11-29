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
import { CircleArrowLeft,BarChart3 } from "lucide-react";
import OverviewTab from "./overview";
import CompaniesTab from "./companies";
import CountriesTab from "./countries";
import TechTab from "./tech";
import PeopleTab from "./people";

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
  // selectedView,
  displayData = [],
}) => {
  const [expandedCard, setExpandedCard] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedView, setSelectedView] = useState("ForYou");
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

    // NEW DATA START
    topInnovators: [
      { name: "Elena Rodriguez", applications: 1450, increment: "+9%" },
      { name: "Kenji Takahara", applications: 1320, increment: "+7%" },
      { name: "Michael Andersen", applications: 1280, increment: "+6%" },
      { name: "Priya Mehta", applications: 1225, increment: "+5%" },
      { name: "Hiroshi Tanaka", applications: 1180, increment: "+4%" },
    ],
    topTechnologies: [
      { name: "Autonomous Driving Vision AI", applications: 4200 },
      { name: "Adaptive Cruise Optimization", applications: 3900 },
      { name: "Hydrogen Fuel Powertrain", applications: 3650 },
      { name: "EV Thermal Regulation Systems", applications: 3400 },
      { name: "Lane-Level Predictive Mapping", applications: 3200 },
    ],
    // NEW DATA END

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

    // NEW DATA START
    topInnovators: [
      { name: "Dr. Maria Chen", applications: 980, increment: "+11%" },
      { name: "Prof. Liam O'Connor", applications: 910, increment: "+8%" },
      { name: "Dr. Sofia Dimitri", applications: 880, increment: "+7%" },
      { name: "Dr. Alex Müller", applications: 850, increment: "+6%" },
      { name: "Dr. Isaac Patel", applications: 830, increment: "+6%" },
    ],
    topTechnologies: [
      { name: "Bio-Neural Wetware Chips", applications: 2600 },
      { name: "Cellular Logic Circuits", applications: 2400 },
      { name: "Neuro-synthetic Data Processing", applications: 2250 },
      { name: "Living DNA Storage Arrays", applications: 2100 },
      { name: "Bio-Analog Signal Mapping", applications: 1980 },
    ],
    //  NEW DATA END

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

    //  NEW DATA START
    topInnovators: [
      { name: "Ravi Narang", applications: 1120, increment: "+10%" },
      { name: "Chen Guang", applications: 1080, increment: "+9%" },
      { name: "Sarah Klein", applications: 1030, increment: "+6%" },
      { name: "Daniel Kim", applications: 995, increment: "+5%" },
      { name: "Yuki Nakamura", applications: 970, increment: "+5%" },
    ],
    topTechnologies: [
      { name: "AI-based Battery Health Prediction", applications: 3100 },
      { name: "EV Motor Fault Detection AI", applications: 2950 },
      { name: "Smart Regenerative Braking AI", applications: 2800 },
      { name: "Energy-Optimal Route Planning AI", applications: 2700 },
      { name: "Thermal Runaway Prediction Models", applications: 2550 },
    ],
    // NEW DATA END

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

  // Group by Country
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

        //  Top Innovators
const topInnovators = Array.isArray(selectedIndustry?.topInnovators)
  ? selectedIndustry.topInnovators
  : relevantCompanies
      .sort((a, b) => b.innovators - a.innovators) 
      .slice(0, 5)
      .map((inv) => ({
        name: inv.innovator || inv.name,
        applications: inv.patents || 0,
        increment: `+${(Math.random() * 10).toFixed(1)}%`,
      }));

//  Top Technologies
const topTechnologies = Array.isArray(selectedIndustry?.topTechnologies)
  ? selectedIndustry.topTechnologies
  : (selectedIndustry?.technologies || [])
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5)
      .map((tech) => ({
        name: tech.name,
        applications: tech.applications || Math.floor(Math.random() * 3000) + 500,
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
            topInnovators={topInnovators}
            topTechnologies={topTechnologies}
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
        case "People":
          return <PeopleTab/>;
      case "Tech":
        return <TechTab />;
      default:
        return null;
    }
  };

  return (
    <div>
      {!selectedIndustry && <hr className="mb-4" />}

      {/* Suggested Industries Section */}
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

      {/* MAIN PAGE (Industry List) */}
      {!selectedIndustry &&
        <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
       <h3 className={styles.headingH3}>Industry Feed</h3>
        <select
          id="dataToggle"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          <option value="ForYou">For You</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

       }

      {!selectedIndustry ? (
        <div className={styles.weeklyGrid}>
          {industries.map((ind, idx) => {
           // Use only last 5 history points
const lastFive = ind.history.slice(-5);

// Fixed "5-month" label
const historyLength = 5;

// Labels: M-1 to M-5
const chartData = {
  labels: Array.from({ length: 5 }, (_, i) => `M-${i + 1}`),
  datasets: [
    {
      label: "Trend",
      data: lastFive,
      borderColor: "#00bfff",
      backgroundColor: "rgba(0,191,255,0.15)",
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 2,
      pointBackgroundColor: "#00bfff",
      fill: true,
    },
  ],
};

const startVal = lastFive[0];
const endVal = lastFive[lastFive.length - 1];

const growthPercent =
  startVal === 0 ? "0.0" : (((endVal - startVal) / startVal) * 100).toFixed(1);

const growthText = `${endVal > startVal ? "↑" : "↓"} ${growthPercent}%`;
const growthColor = endVal > startVal ? "#00ff88" : "#ff4d4d";



            return (
         <div key={idx} className={styles.industryCard}>
  {/* Rank + Growth */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>#{ind.rank}</span>
    <span
      style={{
        color: ind.change.startsWith("+") ? "#00ff88" : "#ff4d4d",
      }}
    >
      {ind.change}
    </span>
  </div>

  {/* Title */}
  <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>{ind.name}</h4>

  <div 
   className={styles.industryCardTags}
  >
    <p
      style={{
        fontSize: "0.8rem",
        color: "#4da6ff",
        textShadow: "0 0 3px #4da6ff",
        margin: 0,
      }}
    >
      Active Companies: {ind.patents}
    </p>

    {/* Top Country */}
    <p
      style={{
        position: "relative",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
      }}
      className="desktop-top-country"
    >
      🌍 {ind.topCountry?.[0]?.name || "—"}
    </p>
  </div>

  {/* Tags section */}
  <div
       className={styles.industryCardTags}
  >
    {ind.tags.map((tag, i) => (
      <p
        key={i}
        style={{
          background: "#1e2a3a",
          padding: "2px 8px",
          borderRadius: "6px",
          fontSize: "0.8rem",
          width: "fit-content",
        }}
      >
        {tag}
      </p>
    ))}

    {/* Top Inventor */}
    <p
      style={{
        position: "relative",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
      }}
      className="desktop-top-inventor"
    >
      🧠 {ind.topInventor || "—"}
    </p>
  </div>

{/* Header row for chart */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
    marginBottom: "6px",
  }}
>
  {/* Left Label */}
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <BarChart3 size={14} color="#00bfff" />
    
    <span style={{ fontSize: "0.8rem", color: "#4da6ff" }}>
      5-Month Trend
    </span>
  </div>

  {/* Right Growth */}
  <span
    style={{
      fontSize: "0.8rem",
      color: growthColor,
      fontWeight: 500,
    }}
  >
    {growthText}
  </span>
</div>

<div style={{ height: "70px" }}>
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
          {/* Back Button */}
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
      borderRadius: "8px",
    }}
  >
    1-Click Insight
  </button>
</div>

          {/* Summary Card */}
          <div style={{ color: "#fff", fontFamily: "DM Sans, sans-serif" }}>
            <div
              style={{
                position: "relative",
                marginBottom: "0rem",
                minHeight: "4rem", 
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

            {/* Sub-tabs */}
            <div className={styles.subTabs}>
              {["Overview", "Countries", "Companies","People", "Tech"].map((tab) => (
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
