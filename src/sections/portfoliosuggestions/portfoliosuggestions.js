"use client";
import React, { useState } from "react";
import styles from "./portfoliosuggestions.module.css";

const mockData = [
  {
    name: "Rivian Automotive",
    tags: ["USA", "EV"],
    innovations: 5,
    industry: "EV",
    totalDevelopments: 12,
  },
  {
    name: "QuantumScape",
    tags: ["USA", "Renewable Energy"],
    innovations: 3,
    industry: "Renewable Energy",
    totalDevelopments: 8,
  },
  {
    name: "Nuro",
    tags: ["USA", "AI"],
    innovations: 4,
    industry: "AI",
    totalDevelopments: 10,
  },
  {
    name: "Moderna",
    tags: ["USA", "Pharma"],
    innovations: 6,
    industry: "Pharma",
    totalDevelopments: 15,
  },
  {
    name: "Tesla",
    tags: ["USA", "EV"],
    innovations: 10,
    industry: "EV",
    totalDevelopments: 25,
  },
  {
    name: "DeepMind",
    tags: ["UK", "AI"],
    innovations: 7,
    industry: "AI",
    totalDevelopments: 20,
  },
  {
    name: "Enphase Energy",
    tags: ["USA", "Renewable Energy"],
    innovations: 5,
    industry: "Renewable Energy",
    totalDevelopments: 11,
  },
  {
    name: "BioNTech",
    tags: ["Germany", "Pharma"],
    innovations: 8,
    industry: "Pharma",
    totalDevelopments: 14,
  },
];

const increments = {
  "Rivian Automotive": "1.25",
  QuantumScape: "0.75",
  Nuro: "1.00",
  Moderna: "1.50",
  Tesla: "2.00",
  DeepMind: "1.40",
  "Enphase Energy": "0.95",
  BioNTech: "1.10",
};

const filters = ["All", "AI", "EV", "Renewable Energy", "Pharma"];

const PortfolioSuggestions = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const handleAddCompany = (company) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("portfolioStartups")) || [];
      const isDuplicate = existing.some((c) => c.name === company.name);

      if (!isDuplicate) {
        const companyWithDetails = {
          ...company,
          increment: increments[company.name] || (Math.random() * 5).toFixed(2),
          country:
            company.tags?.find((tag) =>
              ["USA", "Germany", "UK"].includes(tag)
            ) || "Unknown",
          industries: company.tags
            ?.filter((tag) => !["USA", "Germany", "UK"].includes(tag))
            .join(", "),
          patents: Math.floor(Math.random() * 100), // mock
          technologies: Math.floor(Math.random() * 50), // mock
          inventors: Math.floor(Math.random() * 20), // mock
        };

        const updated = [...existing, companyWithDetails];
        localStorage.setItem("portfolioStartups", JSON.stringify(updated));
        alert(`${company.name} added to portfolio.`);
      } else {
        alert(`${company.name} is already in your portfolio.`);
      }
    } catch (error) {
      console.error("Error adding company to portfolio:", error);
    }
  };

  return (
    <div>

  <hr className="mb-3" />
      <h3 className={styles.headingH3}>Suggested Companies</h3>

    <div className={styles.wrapper}>
      {/* <div className={styles.filterContainer}>
        {filters.map((filter, i) => (
          <button
            key={i}
            className={`${styles.filterButton} ${
              activeFilter === filter ? styles.activeFilter : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div> */}

      {/* Cards shown inside fixed-height scrollable container */}
      <div className={styles.cardContainer}>
        {mockData.map((company, index) => (
          <div key={index} className={styles.card}>
            <h3 className={styles.companyName}>{company.name}</h3>
            <div className={styles.tags}>
              {company.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <p className={styles.innovations}>
              +{company.innovations} recent innovations
            </p>
            <p className={styles.description}>
              Recent innovation activity in {company.industry} industry:{" "}
              {company.totalDevelopments} new developments.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddCompany(company);
              }}
              className={styles.addButton}
            >
              Add to Portfolio
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default PortfolioSuggestions;
