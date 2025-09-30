"use client";
import React, { useEffect, useRef } from "react";
import styles from "./carousel.module.css";
import { useRouter } from "next/navigation";

export const CompanyCarousel = ({ data, isMoving = true, heading }) => {
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
  if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
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

  const clickHandler = (item) => {
    router.push(`/company/${encodeURIComponent(item.companyName)}/overview`);
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
            data.map((item, index) => (
              <div
                key={index}
                className={styles.carouselCard}
              >
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
                <div className={styles.companyCountry}>{item.country}</div>
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
