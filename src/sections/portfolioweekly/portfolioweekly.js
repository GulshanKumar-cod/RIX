'use client';

import React, { useState } from 'react';
import PortfolioWeeklyIndustry from '../portfolioweeklyindustry/portfolioweeklyindustry';
import PortfolioWeeklyTechnologies from '../portfolioweeklytechnologies/portfolioweeklytechnologies';
import styles from "../companylist/companylist.module.css";
import PortfolioWeeklyCompany from '../portfolioweeklycompany/portfolioweeklycompany';


const PortfolioWeekly = () => {
 const [activeTab, setActiveTab] = useState('industry');

const renderTabContent = () =>{
    switch (activeTab) {
      case 'industry':
        return <PortfolioWeeklyIndustry/>;
        case 'company':
          return <PortfolioWeeklyCompany/>;
        case 'technologies':
          return <PortfolioWeeklyTechnologies/>;
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

      <div>
        {renderTabContent()}
      </div>
    </div>
    </div>
    </div>
);

};

export default PortfolioWeekly;