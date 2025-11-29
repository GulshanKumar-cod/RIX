"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const UserProfile = () => {
  const router = useRouter();

  const [profile, setProfile] = useState({
  name: "",
  email: "",
  occupation: "",
  industries: [],
  technologies: [],
  companies: [],
  insightType: "AI Summary",
  notification: "Weekly",
  defaultView: "Industry",
});
useEffect(() => {
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    setProfile(JSON.parse(storedProfile));
  }
}, []);


  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully ✅");
    console.log("Updated Profile:", profile);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "1rem auto",
        padding: "0rem 1rem 2rem 1rem",
        background: "transparent",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Back Button Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#007bff",
            fontWeight: 500,
            fontSize: "0.95rem",
          }}
        >
          <ArrowLeft size={18} style={{ marginRight: "6px" }} />
          Back
        </button>
      </div>

      <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Basic Info</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ gridColumn: "1 / span 2" , fontSize: "0.8rem"}}>
              <label>Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ fontSize: "0.8rem"}}>
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ fontSize: "0.8rem"}}>
              <label>Occupation</label>
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        {/* FOCUS AREAS */}
       <section style={{ marginBottom: "2rem" }}>
  <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
    Focus Areas
  </h3>

<div style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
  <label>Industries</label>
  <div style={{ ...checkboxListStyle }}>
    {[
      "Artificial Intelligence",
      "Electric Vehicles",
      "Semiconductors",
      "Robotics",
      "Biotech",
    ].map((industry) => (
      <label key={industry} style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={profile.industries.includes(industry)}
          onChange={(e) => {
            if (e.target.checked) {
              handleChange("industries", [...profile.industries, industry]);
            } else {
              handleChange(
                "industries",
                profile.industries.filter((i) => i !== industry)
              );
            }
          }}
        />
        {industry}
      </label>
    ))}
  </div>
</div>


  {/* Conditionally show selected industries */}
  {profile.industries.length > 0 && (
    <div style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
      <strong>Your focus areas:</strong>
      <div style={{
        marginTop: "6px",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        {profile.industries.map((industry) => (
          <span
            key={industry}
            style={{
              background: "#007bff",
              color: "#fff",
              borderRadius: "12px",
              padding: "4px 10px",
              fontSize: "0.8rem",
            }}
          >
            {industry}
          </span>
        ))}
      </div>
    </div>
  )}

          {/* <div style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
            <label>Technologies</label>
            <MultiSelect
              options={[
                "Battery Tech",
                "Generative AI",
                "Quantum Computing",
                "IoT",
                "Automation",
              ]}
              values={profile.technologies}
              onChange={(values) => handleChange("technologies", values)}
            />
          </div>

          <div style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
            <label>Companies</label>
            <MultiSelect
              options={[
                "Tesla",
                "NVIDIA",
                "Google",
                "Apple",
                "Samsung",
                "Siemens",
              ]}
              values={profile.companies}
              onChange={(values) => handleChange("companies", values)}
            />
          </div> */}
        </section>

        {/* PREFERENCES */}
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
            Preferences
          </h3>

          <div style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
            <label>Insight Type</label>
            <div style={radioGroupStyle}>
              {["AI Summary", "1-Click Insights"].map((type) => (
                <label key={type} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="insightType"
                    checked={profile.insightType === type}
                    onChange={() => handleChange("insightType", type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
            <label>Notification</label>
            <div style={radioGroupStyle}>
              {["Weekly", "Monthly", "Real-time"].map((freq) => (
                <label key={freq} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="notification"
                    checked={profile.notification === freq}
                    onChange={() => handleChange("notification", freq)}
                  />
                  {freq}
                </label>
              ))}
            </div>
          </div>

         <div style={{ marginBottom: "1rem", fontSize: "0.8rem" }}>
            <label>Default View</label>
            <div style={radioGroupStyle}>
              {["Industry", "Tech", "Company"].map((view) => (
                <label key={view} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="defaultView"
                    checked={profile.defaultView === view}
                    onChange={() => handleChange("defaultView", view)}
                  />
                  {view}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/*  BUTTON */}
        <div style={{ textAlign: "right" }}>
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #007bff, #00bfff)",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;

/* Styles */
const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "0.8rem",
  marginTop: "4px",
};

const radioGroupStyle = {
  display: "flex",
  gap: "1rem",
  marginTop: "0.4rem",
  flexWrap: "wrap",
};

const radioLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "0.8rem",
};

const multiSelectStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #444",
  fontSize: "0.85rem",
  marginTop: "4px",
  height: "120px",
  backgroundColor: "#121212",
  color: "#ffffff",
  fontFamily: "Inter, sans-serif",
  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
  outline: "none",
  scrollbarColor: "#666 #121212",
};

const optionStyle = {
  backgroundColor: "#121212",
  color: "#ffffff",
  padding: "6px 10px",
  cursor: "pointer",
};

const checkboxListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "6px",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "0.8rem",
};



/* MultiSelect */
const MultiSelect = ({ options, values, onChange }) => {
  const handleChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    onChange(selectedOptions);
  };

  return (
    <select
      multiple
      value={values}
      onChange={handleChange}
      style={multiSelectStyle}
    >
      {options.map((option) => (
        <option key={option} value={option} style={optionStyle}>
          {option}
        </option>
      ))}
    </select>
  );
};

