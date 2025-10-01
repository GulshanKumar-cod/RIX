"use client";
import React, { useEffect, useRef } from "react";
import styles from "./carousel.module.css";
import { useRouter } from "next/navigation";

export const CompanyCarousel = ({
  data,
  isMoving = true,
  heading,
  increments = {},
}) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const startScroll = () => {
      animationRef.current = requestAnimationFrame(scroll);
    };

    const stopScroll = () => {
      cancelAnimationFrame(animationRef.current);
    };

    const scroll = () => {
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollTo({ left: 0, behavior: "auto" });
      } else {
        container.scrollLeft += 1.5;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    if (isMoving) {
      startScroll();
      container.addEventListener("mouseenter", stopScroll);
      container.addEventListener("mouseleave", startScroll);
    } else {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, [isMoving]);

  const handleAddCompany = (company) => {
    try {
      const existing =
        JSON.parse(localStorage.getItem("portfolioStartups")) || [];
      const isDuplicate = existing.some((c) => c.name === company.companyName);

      if (!isDuplicate) {
        const companyWithIncrement = {
          ...company,
          name: company.companyName,
          increment: increments[company.companyName] || "0.00",
        };

        const updated = [...existing, companyWithIncrement];
        localStorage.setItem("portfolioStartups", JSON.stringify(updated));
        alert(`${company.companyName} added to portfolio.`);
      } else {
        alert(`${company.companyName} is already in your portfolio.`);
      }
    } catch (error) {
      console.error("Error adding company to portfolio:", error);
    }
  };

  return (
    <div className={styles.carouselContainer}>
      {heading && (
        <div className={styles.heading} style={{ fontSize: "0.7rem" }}>
          <span>{heading}</span>
        </div>
      )}

      <div className={styles.scrollableContainer} ref={containerRef}>
        <div className={styles.columnsContainer}>
          {data &&
            data.length > 0 &&
            data.map((item, index) => {
          const randomChange = (Math.random() * 10 - 5).toFixed(2); 
const displayChange = randomChange > 0 ? `+${randomChange}` : randomChange; 
const absIntegerChange = Math.abs(parseFloat(randomChange)).toFixed(0); 



              return (
                <div key={index} className={styles.carouselCard}>
                  <div className={styles.companyHeader}>
                    <div
                      className={styles.companyName}
                      style={{
                        background:
                          "linear-gradient(to right, rgb(24, 52, 221), rgb(208, 121, 223)) text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {item.companyName}
                    </div>

                    <div
                      style={{
                        color: displayChange.startsWith("+")
                          ? "#00ff88"
                          : "#ff4d4d",
                      }}
                    >
                      {displayChange}%
                    </div>
                  </div>

                  <div className={styles.companyHeader}>
                    <div className={styles.companyCountry}>{item.country}</div>

                    <div
                      style={{
                       color: "#4da6ff", 
    textShadow: "0 0 0px #4da6ff, 0 0 2px #4da6ff, 0 0 5px #4da6ff",
                          fontSize: "0.8rem"
                      }}
                    >
                      {absIntegerChange} developments.
                    </div>
                  </div>

                  <div>
                    <hr
                      style={{
                        width: "30%",
                        background:
                          "linear-gradient(to right, rgb(12 177 232), rgb(13 39 238))",
                        height: "5px",
                        border: "none",
                      }}
                    />
                  </div>

                  <div className={styles.industryFocus}>
                    <h4>Industry Focus</h4>
                    <p>{item.industry1}</p>
                    <p>{item.industry2}</p>
                  </div>

                  <div className={styles.technologiesDeveloped}>
                    <h4>Technologies Developed</h4>
                    <p>{item.technologiesCount}</p>
                  </div>

                  <div className={styles.topInventor}>
                    <h4>Top Inventor</h4>
                    <p>{item.topInventor}</p>
                  </div>

                  <div className={styles.cardAction}>
                    <button
                      onClick={() =>
                        router.push(
                          `https://dyr.incubig.org/company-page/${encodeURIComponent(
                            item.companyName
                          )}/overview`
                        )
                      }
                      className={styles.viewButton}
                    >
                      Explore
                    </button>

                    <button
                      onClick={() => handleAddCompany(item)}
                      className={styles.addPortfolio}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
