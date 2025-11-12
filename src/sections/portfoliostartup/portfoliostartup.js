"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../companylist/companylist.module.css";

const PortfolioStartup = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("portfolioStartups");
    if (stored) {
      const parsed = JSON.parse(stored);

      const updated = parsed.map((c) => {
        if (typeof c.increment === "undefined") {
          const generated = (
            Math.random() *
            10 *
            (Math.random() > 0.5 ? 1 : -1)
          ).toFixed(2);
          return { ...c, increment: generated };
        }
        return c;
      });

      localStorage.setItem("portfolioStartups", JSON.stringify(updated));
      setCompanies(updated);
    }
  }, []);

  const handleCheckboxChange = (companyName) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(companyName)
        ? prevSelected.filter((name) => name !== companyName)
        : [...prevSelected, companyName]
    );
  };

  const handleDelete = () => {
    const filtered = companies.filter(
      (c) => !selectedCompanies.includes(c.name)
    );
    localStorage.setItem("portfolioStartups", JSON.stringify(filtered));
    setCompanies(filtered);
    setSelectedCompanies([]);
  };

  const handleCompare = () => {
    const selected = companies.filter((c) =>
      selectedCompanies.includes(c.name)
    );
    if (selected.length < 2) {
      alert("Select at least two companies to compare.");
    } else {
      console.log("Comparing companies:", selected);
      // You can replace this with redirect or modal comparison logic
      alert(`Comparing: ${selected.map((c) => c.name).join(" vs ")}`);
    }
  };

  if (companies.length === 0) {
    return (
      <div style={{ color: "#ccc" }}>
        <p>No companies added to your portfolio yet.</p>
        <button
          onClick={() => router.push("/companylist?tab=search")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
            marginTop: "1rem",
            fontSize: "0.8rem",
          }}
        >
          + Add companies
        </button>
      </div>
    );
  }

  return (
    <div style={{ color: "#fff" }}>
      <hr className="mb-3" />

      <h3 className={styles.headingH3}>Your Portfolio</h3>

      {/* Company Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          className={styles.portfolioTable}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "800px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Select</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Country</th>
              <th style={thStyle}>Industry</th>
              <th style={thStyle}>Patents</th>
              <th style={thStyle}>Industries</th>
              <th style={thStyle}>Technologies</th>
              <th style={thStyle}>Inventors</th>
              <th style={thStyle}>Increment</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i}>
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(c.name)}
                    onChange={() => handleCheckboxChange(c.name)}
                  />
                </td>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.country}</td>
                <td style={tdStyle}>{c.industry}</td>
                <td style={tdStyle}>{c.patents}</td>
                <td style={tdStyle}>{c.industries}</td>
                <td style={tdStyle}>{c.technologies}</td>
                <td style={tdStyle}>{c.inventors}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: c.increment < 0 ? "red" : "lightgreen",
                  }}
                >
                  {c.increment}%
                </td>
                <td style={tdStyle}>
                  <button className={styles.viewButton}
                    onClick={() =>
                      router.push(
                        `https://dyr.incubig.org/company-page/${encodeURIComponent(
                          c.name
                        )}/overview`
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      
      <div className={styles.startupButtons}>
        <button
          onClick={() => router.push("/companylist?tab=search")}
          style={{
            backgroundColor: "#0070f3",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + Add More
        </button>

        <button
          onClick={handleDelete}
          disabled={selectedCompanies.length === 0}
          style={{
            backgroundColor: "#e00",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: selectedCompanies.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Delete
        </button>
      </div>

<button
  style={{
    background: "linear-gradient(90deg, #007bff, #00bfff)",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    width: "100%",
    // maxWidth: "200px",     
    display: "block",
    // margin: "0 auto",       
  }}
>
  1-Click Insight
</button>

    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #444",
  color: "#aaa",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
};

export default PortfolioStartup;
