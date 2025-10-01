import React, { useState } from "react";
import styles from "../companylist/companylist.module.css";
import { CompanyCarousel } from "@/components/companycarousel/companycarousel";

const sampleData = [
  {
    companyName: "Tesla",
    country: "USA",
    industry1: "EV & Battery Tech",
    industry2: "Autonomous Vehicles",
    technologiesCount: 120,
    topInventor: "Elon Musk",
  },
  {
    companyName: "Samsung",
    country: "South Korea",
    industry1: "Semiconductors",
    industry2: "Consumer Electronics",
    technologiesCount: 95,
    topInventor: "Kim Min-Soo",
  },
  {
    companyName: "Siemens",
    country: "Germany",
    industry1: "Industrial Automation",
    industry2: "Energy Tech",
    technologiesCount: 80,
    topInventor: "Johann Bauer",
  },
  {
    companyName: "Sony",
    country: "Japan",
    industry1: "Electronics",
    industry2: "Entertainment",
    technologiesCount: 65,
    topInventor: "Hiroshi Tanaka",
  },
  {
    companyName: "Nvidia",
    country: "USA",
    industry1: "AI & GPUs",
    industry2: "Autonomous Driving",
    technologiesCount: 110,
    topInventor: "Jensen Huang",
  },
  {
    companyName: "Ola Electric",
    country: "India",
    industry1: "EV Manufacturing",
    industry2: "Mobility Solutions",
    technologiesCount: 40,
    topInventor: "Bhavish Aggarwal",
  },
];

const PortfolioWeeklyCompany = () => {

  const [selectedView, setSelectedView] = useState('weekly');

  return (
    <div>

       <hr className="mb-5" />

       <div style={{
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '0.5rem',
}}>
  <label htmlFor="dataToggle" style={{ color: '#fff', marginRight: '0.5rem', fontSize: "0.8rem" }}>
    View:
  </label>
  <select
    id="dataToggle"
    value={selectedView}
    onChange={(e) => setSelectedView(e.target.value)}
    style={{
      padding: '6px 12px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: '#1a2332',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      fontSize: "0.8rem" 
    }}
  >
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
  </select>
</div>

 <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        {/* <h4 className={styles.weeklySubheading}>Top Companies</h4> */}
        <CompanyCarousel data={sampleData} heading="" />
      </div>

    </div>
  )
}

export default PortfolioWeeklyCompany;