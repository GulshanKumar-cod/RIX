"use client";
import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "lucide-react";
import "../portfoliosearch/portfoliosearch.css";
import Head from "next/head";
import Link from "next/link";
// import PortfolioStartup from "../portfoliostartup/portfoliostartup";
import styles from "./companylist.module.css";
// import PortfolioIntelligence from "../portfoliointelligence/portfoliointelligence";
// import PortfolioAlerts from "../portfolioalerts/portfolioalerts";
// import PortfolioReport from "../portfolioreport/portfolioreport";
import PortfolioSearch from "../portfoliosearch/portfoliosearch";
import PortfolioEngagement from "../portfolioengagement/portfolioengagement";
import PortfolioSignals from "../portfoliosignals/portfoliosignals";
import Portfolio from "../portfolio/portfolio";
import PortfolioWeekly from "../portfolioweekly/portfolioweekly";

export default function CompanyListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "weekly";

  const setTabInURL = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  const tabs = [
    { id: "weekly", label: "AI Discovery" },
     { id: "portfolio", label: "Lens" },
    { id: "search", label: "Search" },
    // { id: "intelligence", label: "Portfolio Intelligence" },
    { id: "alerts", label: "Signals" },
    // { id: "reports", label: "Reports" },
    // { id: "engagement", label: "Engagement" },
  ];

  const renderTabContent = useMemo(() => {
    switch (currentTab) {
      case "weekly":
        return <PortfolioWeekly />;
         case "portfolio":
        return <Portfolio />;
      case "search":
        return <PortfolioSearch />;
      //   case "portfolio":
      //     return <PortfolioStartup />;
      //   case "intelligence":
      //     return <PortfolioIntelligence />;
      case "alerts":
        return <PortfolioSignals />;
      // case "reports":
      //   return <PortfolioReport />;
      
      // case "engagement":
      //   return <PortfolioEngagement />;
      default:
        return <div>Invalid Tab</div>;
    }
  }, [currentTab]);

  return (
    <div className={styles.bodyCompany}>
      <Head>
        <title>RIX — Research Intelligence</title>
      </Head>
      <div className={styles.companyContainer}>
        <header className={styles.header}>
          <div className={styles.leftSection}>
            <h1>
              <Link href="/">RIX</Link>
            </h1>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.userInfo}>
              <div>
                {/* <p className={styles.welcomeText}>Welcome,</p> */}
                <p className={styles.userName}>AL</p>
              </div>
            </div>
            <button
              className={styles.notificationButton}
              aria-label="Notifications"
              title="Notifications"
              onClick={() => alert("No new notifications")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
              >
                <path d="M12 24c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6.36-6-.6-.6V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.88 5.36 6.24 7.92 6.24 11v6.4l-.6.6A.996.996 0 0 0 6 20h12c.89 0 1.34-1.08.72-1.72z" />
              </svg>
            </button>
            {/* <button className={styles.exportButton}>Export Portfolio</button> */}
          </div>
        </header>
      </div>
      <div>
        <div
          className="tab-container mt-5 mb-3"
          role="tablist"
          aria-label="Portfolio Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              className={`tab-button ${
                currentTab === tab.id ? "active-tab" : ""
              }`}
              onClick={() => setTabInURL(tab.id)}
              aria-selected={currentTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">{renderTabContent}</div>
      </div>
    </div>
  );
}
