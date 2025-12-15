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
      {
        name: "Digital input from or digital output to record carriers , e.g. raid, emulated record carriers, networked record carriers",
        patents: 14166,
        change: "+9%",
        trend: "up",
      },
      {
        name: "Arrangements for conducting electric current to or from the solid state body in operation, e.g. leads, terminal arrangements",
        patents: 3697,
        change: "+7%",
        trend: "up",
      },
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
      {
        name: "Power saving characterised by the action undertaken",
        patents: 5621,
        change: "+8%",
        trend: "up",
      },
      { name: "Mis technology,", patents: 4284, change: "+11%", trend: "up" },
      {
        name: "At the transmitting station",
        patents: 3209,
        change: "-6%",
        trend: "down",
      },
      {
        name: "Switching arrangements with several input- or output-terminals, e.g. multiplexers, distributors",
        patents: 330,
        change: "+5%",
        trend: "up",
      },
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
      {
        name: "For selecting or indicating operating mode",
        patents: 6356,
        change: "+10%",
        trend: "up",
      },
      {
        name: "Constructional details or arrangements",
        patents: 4621,
        change: "+6%",
        trend: "up",
      },
      {
        name: "Construction or manufacture in general",
        patents: 785,
        change: "+12%",
        trend: "up",
      },
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
      {
        name: "Constructional details or arrangements of charging converters specially adapted for charging electric vehicles",
        patents: 3409,
        change: "+7%",
        trend: "up",
      },
      {
        name: "Using neural networks",
        patents: 575,
        change: "+6%",
        trend: "up",
      },
      { name: "Liquid cooling", patents: 518, change: "-4%", trend: "down" },
      {
        name: "Safety or indicating devices for abnormal conditions",
        patents: 427,
        change: "+3%",
        trend: "up",
      },
    ],
  },
  {
    name: "Nvidia corporation",
    industry: "Computational Technology",
    country: "USA",
    patents: 2357,
    industries: 23,
    technologies: 571,
    inventors: 2696,
    change: "+20%",
    technologiesDeveloped: [
      {
        name: "Graphical or visual programming",
        patents: 1799,
        change: "+7%",
        trend: "up",
      },
      {
        name: "Key distribution or management, e.g. generation, sharing or updating, of cryptographic keys or passwords",
        patents: 393,
        change: "+6%",
        trend: "up",
      },
      { name: "Navigation", patents: 97, change: "-4%", trend: "down" },
      {
        name: "Related to drivers or passengers",
        patents: 96,
        change: "+3%",
        trend: "up",
      },
    ],
  },
  {
    name: "Space exploration technologies corp.",
    industry: "Electrical Instruments",
    country: "USA",
    patents: 83,
    industries: 6,
    technologies: 39,
    inventors: 129,
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
      {
        name: "Using several loops, e.g. for redundant clock signal generation",
        patents: 4,
        change: "+7%",
        trend: "up",
      },
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
      {
        name: "Adapted for protecting batteries against vibrations, collision impact or swelling",
        patents: 238,
        change: "+10%",
        trend: "up",
      },
      {
        name: "Of the electric storage means for propulsion",
        patents: 229,
        change: "+8%",
        trend: "up",
      },
      {
        name: "Estimation or adaptation of motor parameters, e.g. rotor time constant, flux, speed, current or voltage",
        patents: 58,
        change: "+12%",
        trend: "up",
      },
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
      {
        name: "Taken from planes or by drones",
        patents: 596,
        change: "+11%",
        trend: "up",
      },
      {
        name: "For calculating health indices",
        patents: 92,
        change: "+9%",
        trend: "up",
      },
      {
        name: "Including means for verifying the identity or authority of a user of the system or for message authentication, e.g. authorization, entity authentication, data integrity or data verification, non-repudiation, key authentication or verification of credentials",
        patents: 64,
        change: "+4%",
        trend: "up",
      },
      {
        name: "Radar or analogous systems specially adapted for specific applications",
        patents: 61,
        change: "-2%",
        trend: "down",
      },
    ],
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
  const [prefetchedInsights, setPrefetchedInsights] = useState(null);

  /*  
  -----------------------------------------------
  🔥 DEEP LINK HANDLER — AUTO-LOAD & AUTO-SCROLL  
  -----------------------------------------------
  */
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const insights = params.get("insights");
  const mode = params.get("mode");
  const action = params.get("action");
  const companyNameParam = params.get("company");

  // Check if we should auto-show insights
  if (insights && mode === "company" && action === "showInsights") {
    try {
      const decodedCompanyName = decodeURIComponent(companyNameParam || insights);
      console.log("Auto-loading company insights for:", decodedCompanyName);

      // Find the company in the list
      const index = suggestedCompanies.findIndex(
        (c) => c.name.toLowerCase() === decodedCompanyName.toLowerCase()
      );

      if (index !== -1) {
        const targetCompany = suggestedCompanies[index];

        // Auto-scroll to the company card first
        setTimeout(() => {
          const element = document.getElementById(`company-${index}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);

        // Then simulate clicking the "1-Click Insights" button after a delay
        setTimeout(async () => {
          console.log("Auto-clicking insights button for:", targetCompany.name);
          
          // Set the company and show insights
          setCurrentCompany(targetCompany);
          setShowInsights(true);
          setIsLoading(true);
          setProgress(0);

          // Fetch the data
          const data = await fetchCompanyInsights(targetCompany.name);
          setPrefetchedInsights(data);
          
          // Complete loading
          setTimeout(() => {
            setIsLoading(false);
            setProgress(100);
          }, 500);
        }, 1000);
      } else {
        console.warn("Company not found in list:", decodedCompanyName);
      }
    } catch (error) {
      console.error("Error auto-loading company insights:", error);
    }
  }
}, []);

// Helper to clean URL after loading
useEffect(() => {
  if (showInsights) {
    // Remove the auto-trigger parameters from URL without refreshing
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'showInsights') {
      params.delete('action');
      params.delete('insights');
      params.delete('mode');
      params.delete('cpc');
      params.delete('id');
      params.delete('company');
      
      // Update URL without page refresh
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  }
}, [showInsights]);

  /*  
  ------------------------------------------------------------
  LOADING SIMULATION WHEN FETCHING INSIGHTS (STAYS AS IS)
  ------------------------------------------------------------
  */
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

  /*  
  ---------------------------------------
  🔥 FETCH INSIGHTS (KEPT AS YOU WROTE)  
  ---------------------------------------
  */
  const fetchCompanyInsights = async (companyName) => {
    try {
      const response = await fetch(
        `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(
          companyName
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "60PKCZgn3smuESHN9e8vbVHxiXVS/8H+vXeFC4ruW1d0YAc1UczQlTQ/C2JlnwlEOKjtnLB0N2I0oheAHJGZeB2bVURMQRC1GvM0k45kyrSmiK98bPPlJPu8q1N/TlK4",
          },
        }
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching insights:", error);
      return null;
    }
  };

  return (
    <div>
      <hr className="mb-4" />

      {/* FEED HEADER */}
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

      {/* FEED LIST */}
      <div className={styles.featuredContainer}>
        {suggestedCompanies.map((company, i) => (
          <div
            id={`company-${i}`}
            key={`${company.name}-${i}`}
            className={styles.industryCardCompany}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4
                  style={{
                    margin: "0.5rem 0",
                    fontSize: "18px",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
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
                  {company.country}
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

            {/* Actions */}
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
                onClick={() => {
                  const existing =
                    JSON.parse(localStorage.getItem("portfolioStartups")) || [];
                  const isDuplicate = existing.some(
                    (c) => c.name === company.name
                  );

                  if (!isDuplicate) {
                    localStorage.setItem(
                      "portfolioStartups",
                      JSON.stringify([...existing, company])
                    );
                    alert(`${company.name} added to portfolio.`);
                  } else {
                    alert(`${company.name} is already in your portfolio.`);
                  }
                }}
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

            {/* 1-Click Insights */}
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <button
                onClick={async () => {
                  setCurrentCompany(company);
                  setShowInsights(true);
                  setIsLoading(true);
                  setProgress(0);

                  const dataPromise = fetchCompanyInsights(company.name);

                  let progressValue = 0;
                  let fetchDone = false;

                  const fetchWatcher = (async () => {
                    try {
                      const insightsData = await dataPromise;
                      setPrefetchedInsights(insightsData);
                      fetchDone = true;
                    } catch (err) {
                      console.error("Error fetching insights:", err);
                      fetchDone = true;
                    }
                  })();

                  const progressInterval = setInterval(() => {
                    if (progressValue < 90) {
                      progressValue += 1.2;
                      setProgress(Math.round(progressValue));
                    } else if (fetchDone) {
                      progressValue += 2;
                      setProgress(Math.round(progressValue));
                      if (progressValue >= 100) {
                        clearInterval(progressInterval);
                        setIsLoading(false);
                      }
                    }
                  }, 80);

                  await fetchWatcher;
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

      {/* INSIGHTS MODAL */}
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

            {/* Loader or Actual Insights */}
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
                      fontSize: "0.8rem",
                      color: "#4da6ff",
                    }}
                  >
                    {Math.round(progress)}%
                  </p>
                </div>
              ) : (
                <InsightsView
                  company={currentCompany}
                  prefetchedData={prefetchedInsights}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWeeklyCompany;
