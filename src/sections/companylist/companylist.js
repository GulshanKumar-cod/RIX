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
import {
  Search,
  Brain,
 CircleUserRound ,
  Layers,
  AlignEndHorizontal
} from "lucide-react";

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
  { id: "weekly", label: "AI Discovery", icon: Brain },
  { id: "portfolio", label: "Lens", icon: Layers },
  { id: "search", label: "Search", icon: Search },
  { id: "alerts", label: "Signals", icon:  AlignEndHorizontal },
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
            {/* <div className={styles.userInfo}>
              <div>
                <p className={styles.welcomeText}>Welcome,</p>
                <p className={styles.userName}>AL</p>
              </div>
            </div> */}
            <button
              className={styles.notificationButton}
              aria-label="Notifications"
              title="Notifications"
              onClick={() => alert("No new notifications")}
            >
               <CircleUserRound size={35} />
            </button>
            {/* <button className={styles.exportButton}>Export Portfolio</button> */}
          </div>
        </header>
      </div>
      <div>
        <div
          className="tab-container mt-5 mobile-bottom-tabs"
          role="tablist"
          aria-label="Portfolio Tabs"
        >
         {tabs.map(({ id, label, icon: Icon }) => (
  <button
    key={id}
    role="tab"
    className={`tab-button ${currentTab === id ? "active-tab" : ""}`}
    onClick={() => setTabInURL(id)}
    aria-selected={currentTab === id}
    // style={{
    //   display: "flex",
    //   flexDirection: "column",
    //   alignItems: "center",
    //   fontSize: "0.8rem",
    //   padding: "0.75rem",
    //   gap: "0.25rem"
    // }}
  >
    <Icon size={20} />
    {label}
  </button>
))}

        </div>

        <div className="mt-4">{renderTabContent}</div>
      </div>
    </div>
  );
}
