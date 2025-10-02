"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../companylist/companylist.module.css";

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
  },
];

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
  const [expandedCard, setExpandedCard] = useState(null);

  const [combinedFilterValue, setCombinedFilterValue] = useState("");

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
        `https://api.incubig.org/analytics/assignee-suggestions?assignee=${encodeURIComponent(value)}`,
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

      // Data is an array, use it directly
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

// const goToCompanyPage = (companyName) => {
//   window.location.href = `https://dyr.incubig.org/company-page/${encodeURIComponent(companyName)}/overview`;
// };


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
          <h3 className={styles.headingH3}>Search any company</h3>

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
                  tabIndex={0} // for keyboard accessibility
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
                {/* Add more quick searches here */}
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
                    const isExpanded = expandedCard === cardKey;

                    return (
                      <div
                        key={cardKey}
                        className={`${styles.companyCard} ${isExpanded ? styles.expanded : ""}`}
                      >
                        {/* 🔹 Header */}
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
                            <h3 className={styles.companyName}  style={{fontSize: "1.2rem"}}>{item.name}</h3>
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
                            {/* <span className={styles.tagSearch}>{item.patents} Patents</span> */}
                          </div>
                        </div>

                       <p
  style={{
    marginTop: "15px",
    fontSize: "0.8rem",
    color: "#4da6ff", 
    textShadow: "0 0 0px #4da6ff, 0 0 2px #4da6ff, 0 0 5px #4da6ff",
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
                            e.stopPropagation(); // prevent card redirect
                            setExpandedCard((prev) =>
                              prev === cardKey ? null : cardKey
                            );
                          }}
                          aria-expanded={isExpanded}
                          title={
                            isExpanded ? "Collapse details" : "Expand to view"
                          }
                        >
                          <span className={styles.detailsLabel} style={{fontSize: "0.8rem"}}>Details</span>
                          <span
                            className={`${styles.arrow} ${
                              isExpanded ? styles.rotated : ""
                            }`} style={{fontSize: "0.8rem"}}
                            aria-hidden="true"
                          >
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </button>

                        {/* 🔹 Expandable Section */}
                        {isExpanded && (
                          <div className={styles.expandedContent}>
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
                            {item.topInventor && (
                              <div className={styles.detailRow}>
                                <span>Top Inventor</span>
                                <span>{item.topInventor}</span>
                              </div>
                            )}
                            {item.keyTechnologies?.length > 0 && (
                              <div className={styles.keyTechs}>
                                {item.keyTechnologies
                                  .slice(0, 3)
                                  .map((tech, idx) => (
                                    <span key={idx} className={styles.techTag}>
                                      {tech}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 🔹 Action */}
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
        </div>
      </div>
    </div>
  );
};

export default PortfolioSearch;
