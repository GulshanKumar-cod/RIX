"use client";
import React from 'react'
import "./footer.css"

const Footer = () => {

  const year = new Date().getFullYear();

  return (
     <div className="footer">
      <span className="footerLabel">
      RIX |{" "}
        <a
          href="/"
          className="incubigHyper"
          target="_blank"
          rel="noopener noreferrer"
        >
          rix.incubig.org
        </a>{" "}
        © {year}
      </span>
    </div>
  )
}

export default Footer;