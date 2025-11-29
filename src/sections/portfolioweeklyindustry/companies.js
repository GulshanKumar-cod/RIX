import React from "react";
import styles from "../companylist/companylist.module.css";

const CompaniesTab = ({
  selectedIndustry,
  dummyCompanies,
  expandedCard,
  setExpandedCard,
  increments,
  goToCompanyPage,
  handleAddCompany
}) => {
  return (
    <section className={styles.cardsWrapper} style={{ marginBottom: "5rem" }}>
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
                    {/* Header */}
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

                    {/*  Summary Line */}
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

                    {/*  Toggle for details */}
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

                    {/*  Expandable Section */}
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

                    {/*  Action Buttons */}
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
    maxWidth: "200px",     
    display: "block",
    margin: "0 auto",       
  }}
>
  1-Click Insight
</button>

    </section>
  );
};

export default CompaniesTab;