"use client";
import React, { useState } from "react";
import styles from "../companylist/companylist.module.css";
import { capitalizeFirstLetter } from "@/actions/helper";

const companies = ["Tesla", "Samsung", "Siemens", "Apple", "Sony", "Nvidia"];

const PortfolioEngagement = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [serviceType, setServiceType] = useState("Financial Review");
  const [submittedRequests, setSubmittedRequests] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCompany || !serviceType) return;

    const duplicate = submittedRequests.some(
      (req) =>
        req.company === selectedCompany && req.service === serviceType
    );
    if (duplicate) {
      alert("This request has already been submitted.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newReq = {
      company: selectedCompany,
      service: serviceType,
      status: "Pending",
      date: today,
    };

    setSubmittedRequests((prev) => [newReq, ...prev]);
    setSelectedCompany("");
    setServiceType("Financial Review");
  };

  return (
    <div className={styles.bodyCompany}>
      <div className={styles.companyContainer}>
        <div className={styles.pagePadding}>
          <h3
            className={styles.headingH3}
          >
            Request Expert Service
          </h3>

          <hr className="mb-5" />

         <p className={styles.subheading}>
          Submit service requests for portfolio startups.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className={styles.select}
            >
              <option value="" disabled>-- Select Company --</option>
              {companies.map((c, i) => (
                <option key={i} value={c}>{capitalizeFirstLetter(c)}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className={styles.select}
            >
              <option value="" disabled>-- Select Service --</option>
              <option value="Financial Review">Financial Review</option>
              <option value="Compliance Check">Compliance Check</option>
              <option value="Market Strategy">Market Strategy</option>
            </select>
          </div>

          <button type="submit" className={`${styles.actionBtn} ${styles.submitBtn}`}>
            Submit Request
          </button>
        </form>

        <div className={styles.statusSection}>
          <h3 className={styles.subheading}>Service Request Status</h3>

          <section className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {["Company", "Service", "Status", "Requested Date"].map((head, idx) => (
                    <th key={idx} className={styles.th}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submittedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.noData}>No service requests submitted yet.</td>
                  </tr>
                ) : (
                  submittedRequests.map((r, i) => (
                    <tr key={i} className={styles.tr}>
                      <td className={styles.td}>{r.company}</td>
                      <td className={styles.td}>{r.service}</td>
                      <td
                        className={styles.td}
                        style={{ color: r.status === "Pending" ? "#FFA500" : "#1EAD7B" }}
                      >
                        {r.status}
                      </td>
                      <td className={styles.td}>{r.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEngagement;
