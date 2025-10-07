'use client';

import React, { useState } from 'react';
import PortfolioStartup from '../portfoliostartup/portfoliostartup';
import PortfolioIntelligence from '../portfoliointelligence/portfoliointelligence';
import styles from "../companylist/companylist.module.css";
import PortfolioSuggestions from '../portfoliosuggestions/portfoliosuggestions';
import LensSignals from '../lenssignals/lenssignals';


const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('startup');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'startup':
        return <PortfolioStartup />;
        case 'intelligence':
          return <PortfolioIntelligence />;
      case 'lenssignals':
        return <LensSignals/>;
        case 'suggestions':
          return <PortfolioSuggestions />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>


    {/* Heading and Subtext */}
  <div style={{ marginBottom: '1.5rem', marginTop: "1.5rem" }}>
    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
     Lens
    </h2>
    <p style={{ fontSize: '0.8rem', margin: 0 }}>
     Add, monitor, Get intelligence.
    </p>
  </div>



      {/* Tabs */}
      <div className={styles.tabButtonContainer}>
        <button
          onClick={() => setActiveTab('startup')}
          className={`tab-button ${activeTab === 'startup' ? 'active-tab active-tab-second' : ''}`}
        >
         My Lens
        </button>
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`tab-button ${activeTab === 'intelligence' ? 'active-tab active-tab-second' : ''}`}
        >
        Intelligence
        </button>
        <button
          onClick={() => setActiveTab('lenssignals')}
          className={`tab-button ${activeTab === 'lenssignals' ? 'active-tab active-tab-second' : ''}`}
        >
        Signals
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`tab-button ${activeTab === 'suggestions' ? 'active-tab active-tab-second' : ''}`}
        >
        X Factor
        </button>
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
    </div>
    </div>
  );
};

export default Portfolio;
