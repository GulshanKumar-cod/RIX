"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../companylist/companylist.module.css";
import InsightsView from "@/components/insightsview/insightsview";

const dummyData = [
  {
    name: "Apple inc.",
    patents: 13823,
    industries: 47,
    technologies: 2268,
    inventors: 13020,
    country: "USA",
    industry: "Communication Technique",
    top_inventor: "Dawei zhang",
    // Example placeholder data required by InsightsView (for static display)
    technologiesDeveloped: [
      { name: "Digital input", patents: 14166, change: "+9%", trend: "up" },
      { name: "Arrangements", patents: 3697, change: "+7%", trend: "up" },
      { name: "Photonic quantum", patents: 3240, change: "-2%", trend: "down" },
      { name: "Ion-sensitive", patents: 539, change: "+4%", trend: "up" },
    ],
  },
  {
    name: "Google llc",
    patents: 9515,
    industries: 43,
    technologies: 1661,
    inventors: 11264,
    country: "USA",
    industry: "Computational Technology",
    top_inventor: "Alexandre duarte",
    technologiesDeveloped: [
      { name: "Machine Learning", patents: 5621, change: "+8%", trend: "up" },
      { name: "AI Algorithms", patents: 4284, change: "+11%", trend: "up" },
      { name: "Data Centers", patents: 3209, change: "-6%", trend: "down" },
      { name: "Networking", patents: 330, change: "+5%", trend: "up" },
    ],
  },
  {
    name: "Huawei technologies co., ltd.",
    patents: 18442,
    industries: 41,
    technologies: 2534,
    inventors: 12713,
    country: "China",
    industry: "Communication Technique",
    top_inventor: "Ming gan",
    technologiesDeveloped: [
      { name: "5G Communication", patents: 1799, change: "+7%", trend: "up" },
      { name: "Security", patents: 393, change: "+6%", trend: "up" },
      { name: "Navigation", patents: 97, change: "-4%", trend: "down" },
      { name: "Related to drivers", patents: 96, change: "+3%", trend: "up" },
    ],
  },
  {
    name: "Tencent technology (shenzhen) company limited",
    patents: 3034,
    industries: 22,
    technologies: 808,
    inventors: 3773,
    country: "China",
    industry: "Computational Technology",
    top_inventor: "Wei liu",
    technologiesDeveloped: [
      { name: "Social Media Tech", patents: 238, change: "+10%", trend: "up" },
      { name: "Mobile Gaming", patents: 229, change: "+8%", trend: "up" },
      { name: "Estimation", patents: 58, change: "+12%", trend: "up" },
      { name: "Bus networks", patents: 22, change: "-5%", trend: "down" },
    ],
  },
  {
    name: "Toyota jidosha kabushiki kaisha",
    patents: 11690,
    industries: 56,
    technologies: 2524,
    inventors: 7088,
    country: "Japan",
    industry: "Vehicles",
    top_inventor: "Daiki yokoyama",
    technologiesDeveloped: [
      { name: "Charging Converters", patents: 3409, change: "+7%", trend: "up" },
      { name: "Neural Networks", patents: 575, change: "+6%", trend: "up" },
      { name: "Liquid Cooling", patents: 518, change: "-4%", trend: "down" },
      { name: "Safety Devices", patents: 427, change: "+3%", trend: "up" },
    ],
  },
  {
    name: "Sony corporation",
    patents: 4721,
    industries: 35,
    technologies: 1321,
    inventors: 3497,
    country: "Japan",
    industry: "Communication Technique",
    top_inventor: "Shin horng wong",
    technologiesDeveloped: [
      { name: "Operating Mode", patents: 6356, change: "+10%", trend: "up" },
      { name: "Construction", patents: 4621, change: "+6%", trend: "up" },
      { name: "Manufacture", patents: 785, change: "+12%", trend: "up" },
      { name: "Prisms", patents: 591, change: "-4%", trend: "down" },
    ],
  },
  {
    name: "Tata consultancy services limited",
    patents: 967,
    industries: 33,
    technologies: 424,
    inventors: 1543,
    country: "India",
    industry: "Computational Technology",
    top_inventor: "Arpan pal",
    technologiesDeveloped: [
      { name: "Drones", patents: 596, change: "+11%", trend: "up" },
      { name: "Health Indices", patents: 92, change: "+9%", trend: "up" },
      { name: "Authentication", patents: 64, change: "+4%", trend: "up" },
      { name: "Radar Systems", patents: 61, change: "-2%", trend: "down" },
    ],
  },
  {
    name: "Infosys limited",
    patents: 91,
    industries: 8,
    technologies: 62,
    inventors: 190,
    country: "India",
    industry: "Computational Technology",
    top_inventor: "Steven schilders",
    technologiesDeveloped: [
      { name: "Cloud Computing", patents: 38, change: "+12%", trend: "up" },
      { name: "Enterprise Systems", patents: 36, change: "+9%", trend: "up" },
      { name: "Data Security", patents: 5, change: "-3%", trend: "down" },
      { name: "IoT Devices", patents: 4, change: "+7%", trend: "up" },
    ],
  },
];


// REMOVED REDUNDANT fetchCompanyInsights from here (it is now inside InsightsView)


const PortfolioSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedPatents, setSelectedPatents] = useState("All");
  const router = useRouter();
  const [increments, setIncrements] = useState({});
  const [displayData, setDisplayData] = useState([]);
  const [expandedCard, setExpandedCard] = useState(() => {
    return dummyData.map((item, i) => `${item.name ?? "company"}_${i}`);
  });
  const [combinedFilterValue, setCombinedFilterValue] = useState("");

  // --- INSIGHTS STATE ---
  const [showInsights, setShowInsights] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState(
    "Fetching innovation activity data..."
  );
  const [prefetchedInsights, setPrefetchedInsights] = useState(null); 



  // Initial increments/setup
  useEffect(() => {
    const newIncrements = {};
    dummyData.forEach((company) => {
      const randomVal = (
        Math.random() *
        10 *
        (Math.random() > 0.5 ? 1 : -1)
      ).toFixed(2);
      newIncrements[company.name] = randomVal;
    });
    setIncrements(newIncrements);
  }, []);


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
  
            // Update message based on progress stage
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

  useEffect(() => {
    const savedPortfolio =
      JSON.parse(localStorage.getItem("portfolioStartups")) || [];

    const filtered = dummyData.filter((c) => {
      const matchesCompany = searchTerm
        ? c.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesIndustry =
        selectedIndustry === "All" || c.industry === selectedIndustry;
      const matchesCountry =
        selectedCountry === "All" || c.country === selectedCountry;

      let matchesPatents = true;
      if (selectedPatents === "1-500")
        matchesPatents = c.patents >= 1 && c.patents <= 500;
      if (selectedPatents === "500-1000")
        matchesPatents = c.patents > 500 && c.patents <= 1000;
      if (selectedPatents === ">1000") matchesPatents = c.patents > 1000;

      return (
        matchesCompany && matchesIndustry && matchesCountry && matchesPatents
      );
    });

    const withIncrements = filtered.map((company) => {
      const portfolioCompany = savedPortfolio.find(
        (c) => c.name === company.name
      );
      let increment;

      if (portfolioCompany && portfolioCompany.increment !== undefined) {
        increment = parseFloat(portfolioCompany.increment);
      } else {
        increment = parseFloat(
          (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2)
        );
      }

      return {
        ...company,
        increment,
      };
    });

    setDisplayData(withIncrements);
  }, [
    selectedCompany,
    selectedIndustry,
    selectedCountry,
    selectedPatents,
    searchTerm,
  ]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      try {
        const res = await fetch(
          `https://api.incubig.org/analytics/assignee-suggestions?assignee=${encodeURIComponent(
            value
          )}`,
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_INCUBIG_API_KEY,
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch suggestions");
        }

        const data = await res.json();
        const suggestions = Array.isArray(data) ? data : [];
        setSuggestions(suggestions.slice(0, 5));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const goToCompanyPage = (companyName) => {
    router.push(
      `https://dyr.incubig.org/company-page/${encodeURIComponent(
        companyName
      )}/overview`
    );
  };

  const handleSuggestionClick = (name) => {
    setSelectedCompany(name);
    setSearchTerm(name);
    setSuggestions([]);
    goToCompanyPage(name);
  };

  const handleCombinedFilterChange = (value) => {
    setCombinedFilterValue(value);

    const [filterType, filterValue] = value.split(":");
    if (filterType === "industry") {
      setSelectedIndustry(filterValue);
    } else if (filterType === "geography") {
      setSelectedCountry(filterValue);
    } else if (filterType === "patents") {
      setSelectedPatents(filterValue);
    }
  };

   const fetchCompanyInsights = async (companyName) => {
  try {
    const response = await fetch(
      `https://api.incubig.org/analytics/assignee?assignee=${encodeURIComponent(companyName)}`,
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

  const industryOptions = [
    "All",
    ...new Set(dummyData.map((item) => item.industry)),
  ];

  const countryOptions = [
    "All",
    ...new Set(dummyData.map((item) => item.country)),
  ];

  const patentOptions = ["All", "1-500", "500-1000", ">1000"];

  return (
    <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>
          <hr className="mb-3" />

          {/* Search + Filters Row */}
          <div className={styles.searchFilters}>
            {/* Search Box */}
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={handleInputChange}
                className={styles.searchInput}
              />
              {/* Suggestion text */}
              <div className={styles.quickSearchSuggestions}>
                <p style={{ color: "rgb(170, 170, 170)", fontSize: "0.8rem" }}>
                  Quick Searches:{" "}
                </p>
                <span
                  className={styles.quickSearchItem}
                  onClick={() => handleSuggestionClick("Apple")}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSuggestionClick("Apple");
                    }
                  }}
                >
                  Apple
                </span>
                <span
                  className={styles.quickSearchItem}
                  onClick={() => handleSuggestionClick("Google")}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSuggestionClick("Google");
                    }
                  }}
                >
                  Google
                </span>
                <span
                  className={styles.quickSearchItem}
                  onClick={() => handleSuggestionClick("Tesla")}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSuggestionClick("Tesla");
                    }
                  }}
                >
                  Tesla
                </span>
              </div>

              {suggestions.length > 0 && (
                <ul className={styles.searchSuggestionUL}>
                  {suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={styles.searchSuggestionLI}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Filters */}
            <div className={styles.filters}>
              <select
                value={combinedFilterValue}
                onChange={(e) => handleCombinedFilterChange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="" disabled hidden>
                  Select Filter
                </option>

                <optgroup label="Industry">
                  {industryOptions.map((ind, i) => (
                    <option key={`ind-${i}`} value={`industry:${ind}`}>
                      {ind === selectedIndustry ? "✔ " : ""}
                      {ind}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Geography">
                  {countryOptions.map((geo, i) => (
                    <option key={`geo-${i}`} value={`geography:${geo}`}>
                      {geo === selectedCountry ? "✔ " : ""}
                      {geo}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Patents">
                  {patentOptions.map((p, i) => (
                    <option key={`pat-${i}`} value={`patents:${p}`}>
                      {p === selectedPatents ? "✔ " : ""}
                      {p}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Company Cards */}
          <section className={styles.cardsWrapper}>
            {displayData.length === 0 ? (
              <div style={{ padding: "14px 16px", textAlign: "center" }}>
                No companies match your search
              </div>
            ) : (
              <div className={styles.cardsScrollableContainer}>
                <div className={styles.cardsGrid}>
                  {displayData.map((item, i) => {
                    const cardKey = `${item.name ?? "company"}_${i}`;
                    const isExpanded = expandedCard.includes(cardKey);

                    return (
                      <div
                        key={cardKey}
                        className={`${styles.companyCard} ${
                          isExpanded ? styles.expanded : ""
                        }`}
                      >
                        {/* Header */}
                        <div
                          className={styles.cardHeader}
                          // onClick={() => goToCompanyPage(item.name)}
                        >
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

                        {/* Action */}
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

                        {/*  1-Click Insights Button */}
                        <div style={{ marginTop: "15px", textAlign: "center" }}>
                          <button
  onClick={async () => {
    setCurrentCompany(item);
    setShowInsights(true);
    setIsLoading(true);
    setProgress(0);

    // Start fetching immediately
    const dataPromise = fetchCompanyInsights(item.name);

    let progressValue = 0;
    let fetchDone = false;

    // Track when API finishes
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

    // Progress animation
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


    // Wait for both animation + fetch to end
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
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/*  INSIGHTS MODAL OVERLAY (Now calling the real InsightsView) */}
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
            {/* Close Button */}
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

            {/* Loading / Insights Content */}
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
                // CALLING THE ACTUAL InsightsView COMPONENT
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

export default PortfolioSearch;