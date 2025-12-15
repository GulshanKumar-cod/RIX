'use client';

import React, { useState, useEffect } from 'react';
import PortfolioWeeklyIndustry from '../portfolioweeklyindustry/portfolioweeklyindustry';
import PortfolioWeeklyTechnologies from '../portfolioweeklytechnologies/portfolioweeklytechnologies';
import styles from "../companylist/companylist.module.css";
import PortfolioWeeklyCompany from '../portfolioweeklycompany/portfolioweeklycompany';

const PortfolioWeekly = () => {
  const [activeTab, setActiveTab] = useState('industry');
  const [selectedIndustry, setSelectedIndustry] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const hasInsights = params.get("insights");
  const mode = params.get("mode");
  const action = params.get("action");

  if (hasInsights && mode && action === 'showInsights') {
    if (mode === "company") {
      setActiveTab("company");
    } else if (mode === "technology") {
      setActiveTab("technologies");
    }
  }
}, []);


  const renderTabContent = () => {
    switch (activeTab) {
      case 'industry':
        return (
          <PortfolioWeeklyIndustry
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
          />
        );
      case 'company':
        return <PortfolioWeeklyCompany />;
      case 'technologies':
        return <PortfolioWeeklyTechnologies />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>
        
          {/* Heading and Subtext */}
           {!selectedIndustry && (
  <div style={{ marginBottom: '1.5rem', marginTop: "1.5rem" }}>
    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
      AI Discovery
    </h2>
    <p style={{ fontSize: '0.8rem', margin: 0 }}>
     Explore what the world is building.
    </p>
  </div>
)}

          

          {/* Tabs */}
       {!selectedIndustry && (
            <div className={styles.tabButtonContainer}>
              <button
                onClick={() => setActiveTab('industry')}
                className={`tab-button ${activeTab === 'industry' ? 'active-tab active-tab-second' : ''}`}
              >
                Industry
              </button>
              <button
                onClick={() => setActiveTab('company')}
                className={`tab-button ${activeTab === 'company' ? 'active-tab active-tab-second' : ''}`}
              >
                Companies
              </button>
              <button
                onClick={() => setActiveTab('technologies')}
                className={`tab-button ${activeTab === 'technologies' ? 'active-tab active-tab-second' : ''}`}
              >
                Technologies
              </button>
            </div>
          )}

          {/* Tab Content */}
          <div>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWeekly;
