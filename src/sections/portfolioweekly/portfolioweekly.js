'use client';

import React, { useState } from 'react';
import PortfolioWeeklyIndustry from '../portfolioweeklyindustry/portfolioweeklyindustry';
import PortfolioWeeklyTechnologies from '../portfolioweeklytechnologies/portfolioweeklytechnologies';
import PortfolioWeeklyCountry from '../portfolioweeklycountry/portfolioweeklycountry';
import styles from "../companylist/companylist.module.css";


const PortfolioWeekly = () => {
 const [activeTab, setActiveTab] = useState('industry');

const renderTabContent = () =>{
    switch (activeTab) {
      case 'industry':
        return <PortfolioWeeklyIndustry/>;
        case 'technologies':
          return <PortfolioWeeklyTechnologies/>;
          case 'country':
            return <PortfolioWeeklyCountry/>;
      default:
        return null;
    }
};

return (
   <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>
      {/* Tabs */}
      <div className={styles.tabButtonContainer}>
        <button
          onClick={() => setActiveTab('industry')}
          className={`tab-button ${activeTab === 'industry' ? 'active-tab' : ''}`}
        >
         Industry
        </button>
        <button
          onClick={() => setActiveTab('technologies')}
          className={`tab-button ${activeTab === 'technologies' ? 'active-tab' : ''}`}
        >
        Technologies
        </button>
        <button
          onClick={() => setActiveTab('country')}
          className={`tab-button ${activeTab === 'country' ? 'active-tab' : ''}`}
        >
        Country
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

export default PortfolioWeekly;