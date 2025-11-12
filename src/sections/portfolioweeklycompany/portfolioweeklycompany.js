import React, { useState, useEffect } from "react";
import styles from "../companylist/companylist.module.css";
import { CompanyCarousel } from "@/components/companycarousel/companycarousel";
import InsightsView from "@/components/insightsview/insightsview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PortfolioSuggestions from "../portfoliosuggestions/portfoliosuggestions";

const suggestedCompanies = [
   {
    name: "International business machines corporation",
    industry: "Computational Technology",
    country: "USA",
    patents: 23742,
    industries: 58,
    technologies: 2610,
    inventors: 20212,
    change: "+8%",
    technologiesDeveloped: [
      { name: "Digital input from or digital output to record carriers , e.g. raid, emulated record carriers, networked record carriers", patents: 14166, change: "+9%", trend: "up" },
      { name: "Arrangements for conducting electric current to or from the solid state body in operation, e.g. leads, terminal arrangements", patents: 3697, change: "+7%", trend: "up" },
      {
        name: "Photonic quantum communication",
        patents: 3240,
        change: "-2%",
        trend: "down",
      },
      {
        name: "Ion-sensitive or chemical field-effect transistors",
        patents: 539,
        change: "+4%",
        trend: "up",
      },
    ],
  },
  {
    name: "Intel corporation",
    industry: "Semiconductors",
    country: "USA",
    patents: 14024,
    industries: 41,
    technologies: 2034,
     inventors: 12878,
    change: "+15%",
    technologiesDeveloped: [
      { name: "Power saving characterised by the action undertaken", patents: 5621, change: "+8%", trend: "up" },
      { name: "Mis technology,", patents: 4284, change: "+11%", trend: "up" },
      {
        name: "At the transmitting station",
        patents: 3209,
        change: "-6%",
        trend: "down",
      },
      { name: "Switching arrangements with several input- or output-terminals, e.g. multiplexers, distributors", patents: 330, change: "+5%", trend: "up" },
    ],
  },
   {
    name: "Apple inc.",
    industry: "Communication Technique",
    country: "USA",
    patents: 13823,
    industries: 47,
    technologies: 2268,
    inventors: 13020,
    change: "+12%",
    technologiesDeveloped: [
      { name: "For selecting or indicating operating mode", patents: 6356, change: "+10%", trend: "up" },
      { name: "Constructional details or arrangements", patents: 4621, change: "+6%", trend: "up" },
      { name: "Construction or manufacture in general", patents: 785, change: "+12%", trend: "up" },
      {
        name: "Prisms",
        patents: 591,
        change: "-4%",
        trend: "down",
      },
    ],
  },
 
  {
    name: "Ford global technologies, llc",
    industry: "Vehicles",
    country: "USA",
    patents: 6726,
    industries: 52,
    technologies: 1952,
    inventors: 6537,
    change: "+20%",
    technologiesDeveloped: [
      { name: "Constructional details or arrangements of charging converters specially adapted for charging electric vehicles", patents: 3409, change: "+7%", trend: "up" },
      { name: "Using neural networks", patents: 575, change: "+6%", trend: "up" },
      { name: "Liquid cooling", patents: 518, change: "-4%", trend: "down" },
      { name: "Safety or indicating devices for abnormal conditions", patents: 427, change: "+3%", trend: "up" },
    ],
  },
  {
    name: "Space exploration technologies corp.",
    industry: "Electrical Instruments",
    country: "USA",
    patents: 83,
    industries: 6,
    technologies: 39,
    inventors: 129 ,
    change: "+18%",
    technologiesDeveloped: [
      { name: "Supports", patents: 38, change: "+12%", trend: "up" },
      {
        name: "For groups of terminals or users",
        patents: 36,
        change: "+9%",
        trend: "up",
      },
      {
        name: "Systems for coupling or separating cosmonautic vehicles or parts thereof, e.g. docking arrangements",
        patents: 5,
        change: "-3%",
        trend: "down",
      },
      { name: "Using several loops, e.g. for redundant clock signal generation", patents: 4, change: "+7%", trend: "up" },
    ],
  },
  {
    name: "Byd company limited",
    industry: "Vehicles",
    country: "China",
    patents: 605,
    industries: 27,
    technologies: 342,
    inventors: 913,
    change: "+44%",
    technologiesDeveloped: [
      { name: "Adapted for protecting batteries against vibrations, collision impact or swelling", patents: 238, change: "+10%", trend: "up" },
      { name: "Of the electric storage means for propulsion", patents: 229, change: "+8%", trend: "up" },
      { name: "Estimation or adaptation of motor parameters, e.g. rotor time constant, flux, speed, current or voltage", patents: 58, change: "+12%", trend: "up" },
      {
        name: "Bus networks",
        patents: 22,
        change: "-5%",
        trend: "down",
      },
    ],
  },
  {
    name: "Tata consultancy services limited",
    industry: "Computational Technology",
    country: "India",
    patents: 967,
    industries: 33,
    technologies: 424,
    inventors: 1543,
    change: "+36%",
    technologiesDeveloped: [
      { name: "Taken from planes or by drones", patents: 596, change: "+11%", trend: "up" },
      { name: "For calculating health indices", patents: 92, change: "+9%", trend: "up" },
      { name: "Including means for verifying the identity or authority of a user of the system or for message authentication, e.g. authorization, entity authentication, data integrity or data verification, non-repudiation, key authentication or verification of credentials", patents: 64, change: "+4%", trend: "up" },
      {
        name: "Radar or analogous systems specially adapted for specific applications",
        patents: 61,
        change: "-2%",
        trend: "down",
      },
    ],
  },
 
];

const sampleData = [
  {
    name: "Tesla",
    country: "USA",
    industry1: "EV & Battery Tech",
    industry2: "Autonomous Vehicles",
    technologiesCount: 120,
    topInventor: "Elon Musk",
    totalDevelopments: 1231,
    innovations: 53,
  },
  {
    name: "Samsung",
    country: "South Korea",
    industry1: "Semiconductors",
    industry2: "Consumer Electronics",
    technologiesCount: 95,
    topInventor: "Kim Min-Soo",
    totalDevelopments: 2345,
    innovations: 45,
  },
  {
    name: "Siemens",
    country: "Germany",
    industry1: "Industrial Automation",
    industry2: "Energy Tech",
    technologiesCount: 80,
    topInventor: "Johann Bauer",
    totalDevelopments: 131,
    innovations: 33,
  },
  {
    name: "Sony",
    country: "Japan",
    industry1: "Electronics",
    industry2: "Entertainment",
    technologiesCount: 65,
    topInventor: "Hiroshi Tanaka",
    totalDevelopments: 4051,
    innovations: 531,
  },
  {
    name: "Nvidia",
    country: "USA",
    industry1: "AI & GPUs",
    industry2: "Autonomous Driving",
    technologiesCount: 110,
    topInventor: "Jensen Huang",
    totalDevelopments: 11231,
    innovations: 331,
  },
  {
    name: "Ola Electric",
    country: "India",
    industry1: "EV Manufacturing",
    industry2: "Mobility Solutions",
    technologiesCount: 40,
    topInventor: "Bhavish Aggarwal",
    totalDevelopments: 115,
    innovations: 23,
  },
];

const PortfolioWeeklyCompany = () => {
  const [selectedView, setSelectedView] = useState("ForYou");
  const [showInsights, setShowInsights] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState(
    "Fetching innovation activity data..."
  );

  // Simulate progress bar before showing insights
  useEffect(() => {
    if (isLoading) {
      let progressInterval = setInterval(() => {
        setProgress((prev) => {
          let next = prev + 1;
          if (next >= 100) {
            clearInterval(progressInterval);
            setIsLoading(false);
            next = 100;
          }

          // 🔹 Update message based on progress stage
          if (next < 25) {
            setProgressMessage("Fetching innovation activity data...");
          } else if (next < 50) {
            setProgressMessage(
              "Analyzing industries and emerging technologies..."
            );
          } else if (next < 75) {
            setProgressMessage("Processing inventor networks...");
          } else {
            setProgressMessage("Generating intelligence report...");
          }

          return next;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [isLoading]);

useEffect(() => {
  if (suggestedCompanies && suggestedCompanies.length > 0) {
    const params = new URLSearchParams(window.location.search);
    const companyName = params.get("insights");
    if (companyName) {
      const match = suggestedCompanies.find(
        (c) => c.name.toLowerCase() === companyName.toLowerCase()
      );
      if (match) {
        setCurrentCompany(match);
        setShowInsights(true);
        setIsLoading(true);
        setProgress(0);

        window.history.replaceState({}, document.title, "/companylist");
      }
    }
  }
}, [suggestedCompanies]);


  // Add company to portfolio
  const handleAddCompany = (company) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("portfolioStartups")) || [];
      const isDuplicate = existing.some((c) => c.name === company.name);

      if (!isDuplicate) {
        const updated = [...existing, company];
        localStorage.setItem("portfolioStartups", JSON.stringify(updated));
        alert(`${company.name} added to portfolio.`);
      } else {
        alert(`${company.name} is already in your portfolio.`);
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  return (
    <div>
      <hr className="mb-4" />

      {/* Suggested Companies */}
      <div style={{ marginBottom: "3rem" }}>
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
          <h3 className={styles.headingH3}>Companies Feed</h3>
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

        <div className={styles.featuredContainer}>
          {suggestedCompanies.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className={styles.industryCardCompany}
            >
              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h4 style={{ margin: "0.5rem 0", fontSize: "18px" }}>
                    {company.name}
                  </h4>
                  <span
                    style={{
                      color: company.change.startsWith("+")
                        ? "#00ff88"
                        : "#ff4d4d",
                      margin: "0.5rem 0",
                      fontSize: "18px",
                    }}
                  >
                    {company.change}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    margin: "0.8rem 0",
                  }}
                >
                  <span
                    style={{
                      background: "#2c3e50",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      color: "#fff",
                    }}
                  >
                    {company.country || "N/A"}
                  </span>
                  <span
                    style={{
                      background: "#1e2a3a",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      color: "#fff",
                    }}
                  >
                    {company.industry}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#4da6ff",
                    textShadow: "0 0 3px #4da6ff",
                  }}
                >
                  {company.patents.toLocaleString()} innovations
                </p>
              </div>

              {/* Buttons Row */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <button
                  onClick={() =>
                    window.open(
                      `https://dyr.incubig.org/company-page/${encodeURIComponent(
                        company.name
                      )}/overview`,
                      "_blank"
                    )
                  }
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
                  View
                </button>
                <button
                  onClick={() => handleAddCompany(company)}
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
                  + Add
                </button>
              </div>

              {/* 1-Click Insights Button */}
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    setCurrentCompany(company);
                    setShowInsights(true);
                    setIsLoading(true);
                    setProgress(0);
                  }}
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: ".8rem",
                  }}
                >
                  1-Click Insights
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Toggle Dropdown */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h3 className={styles.headingH3}>Companies Feed</h3>

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
      </div> */}

      {/* Main Weekly Companies Carousel
      <div style={{ marginTop: "0rem", marginBottom: "3rem" }}>
        <PortfolioSuggestions data={sampleData} showHeading={false} />
      </div> */}

      {/* Insights Popup Modal  */}
      {showInsights && currentCompany && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#000",
              color: "#fff",
              border: "1px solid #4da6ff",
              boxShadow: "0 0 12px rgba(77, 166, 255, .3)",
              borderRadius: "10px",
              // padding: "20px",
              width: "90%",
              maxWidth: "900px",
              height: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowInsights(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#4da6ff",
              }}
            >
              ×
            </button>

            {/* Loading / Insights */}
            <div
              style={{
                marginTop: "40px",
                textAlign: "center",
                fontSize: "0.8rem",
              }}
            >
              {isLoading ? (
                <div>
                  <p
                    style={{
                      marginBottom: "10px",
                      color: "#fff",
                      fontSize: "0.8rem",
                    }}
                  >
                    {progressMessage}
                  </p>
                  <div
                    style={{
                      height: "10px",
                      width: "100%",
                      background: "#1a1a1a",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #007bff, #00bfff)",
                        transition: "width 0.2s ease",
                      }}
                    ></div>
                  </div>
                  <p
                    style={{
                      marginTop: "5px",
                      fontSize: "0.75rem",
                      color: "#4da6ff",
                    }}
                  >
                    {progress}%
                  </p>
                </div>
              ) : (
                <InsightsView company={currentCompany} />
              )}
            </div>

            {/* Actions */}
            {/* {!isLoading && (
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <button
                  onClick={handleShareInsights}
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: ".8rem",
                  }}
                >
                  Share
                </button>
                <button
                  onClick={handleDownloadReport}
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00bfff)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontSize: ".8rem",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWeeklyCompany;
