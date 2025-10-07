"use client";

import { useRouter } from "next/navigation";
import styles from "./landingpage.module.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.tagline}>
          ✨ The Future of Research Intelligence
        </div>

        <h1 className={styles.title}>
          <span className={styles.lineGray}>Navigate Innovation.</span> <br />
          <span className={styles.gradientText}>Discover Your Edge.</span>
        </h1>

        <p className={styles.subtitle}>
          RIX is the premier platform for uncovering deep insights into
          companies, technologies, and market trends to fuel your strategic
          growth.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.startButton}
            onClick={() => router.push("/companylist")}
          >
          Get Early Access
          </button>
          {/* <input
            type="text"
            placeholder=""
            className={styles.searchInput}
          /> */}
        </div>
      </section>

        <section className={styles.capabilitiesSection}>
  <div className={styles.capabilitiesHeader}>
    <div className={styles.capIcon}>🧠</div>
    <h2 className={styles.capTitle}>Core Capabilities</h2>
    <p className={styles.capSubtitle}>
      Discover the powerful features that make RIX the ultimate research
      intelligence platform
    </p>
  </div>

  {/* Card Container */}
  <div className={styles.cardsContainer}>
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>🧠</div>
        <div className={styles.cardTopText}>
          <p className={styles.cardLabel}>ADVANCED ML</p>
          <p className={styles.cardMetric}>99.7% Accuracy</p>
        </div>
      </div>
      <h3 className={styles.cardTitle}>AI-Powered Insights</h3>
      <p className={styles.cardText}>
        Leverage machine learning to uncover non-obvious patterns and opportunities.
      </p>
    </div>

    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>🌍</div>
        <div className={styles.cardTopText}>
          <p className={styles.cardLabel}>REAL-TIME DATA</p>
          <p className={styles.cardMetric}>190+ Countries</p>
        </div>
      </div>
      <h3 className={styles.cardTitle}>Global Data Coverage</h3>
      <p className={styles.cardText}>
        Access a comprehensive database of companies, patents, and research worldwide.
      </p>
    </div>

    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>📈</div>
        <div className={styles.cardTopText}>
          <p className={styles.cardLabel}>TREND PREDICTION</p>
          <p className={styles.cardMetric}>6 Months Early</p>
        </div>
      </div>
      <h3 className={styles.cardTitle}>Predictive Trend Analysis</h3>
      <p className={styles.cardText}>
        Identify and track emerging market and technology trends before they peak.
      </p>
    </div>
  </div>
</section>

<section className={styles.trustedSection}>
  <h2 className={styles.trustedTitle}>Trusted at Scale</h2>
  <p className={styles.trustedSubtitle}>
    Join thousands of innovation teams who rely on RIX for critical business intelligence
  </p>

  <div className={styles.trustedCards}>
    <div className={styles.trustedCard}>
      <h3 className={styles.trustedNumber}>1.0B+</h3>
      <p className={styles.trustedHeading}>Market Signals Processed Daily</p>
      <p className={styles.trustedText}>Real-time analysis of global market data</p>
    </div>

    <div className={styles.trustedCard}>
      <h3 className={styles.trustedNumber}>10.0M+</h3>
      <p className={styles.trustedHeading}>Company & Tech Profiles</p>
      <p className={styles.trustedText}>Comprehensive database coverage</p>
    </div>

    <div className={styles.trustedCard}>
      <h3 className={styles.trustedNumber}>95%</h3>
      <p className={styles.trustedHeading}>Reduction in Research Time</p>
      <p className={styles.trustedText}>Accelerated decision-making process</p>
    </div>

    <div className={styles.trustedCard}>
      <h3 className={styles.trustedNumber}>500+</h3>
      <p className={styles.trustedHeading}>Global Enterprise Customers</p>
      <p className={styles.trustedText}>Trusted by industry leaders worldwide</p>
    </div>
  </div>

  <div className={styles.trustedBottom}>
    <span>● Live Data Processing</span>
    <span>● 99.9% Uptime Guaranteed</span>
  </div>
</section>

<section className={styles.workflowSection}>
  <h2 className={styles.workflowTitle}>From Data to Decision in Minutes</h2>
  <p className={styles.workflowSubtitle}>
    A seamless workflow designed for speed and clarity.
  </p>

  <div className={styles.workflowSteps}>
    <div className={styles.workflowStep}>
      <div className={styles.workflowIcon}>🔍</div>
      <h3 className={styles.workflowStepTitle}>1. Define Your Scope</h3>
      <p className={styles.workflowText}>
        Start with a keyword, company, or technology. Our smart search understands your intent.
      </p>
    </div>

    <div className={styles.workflowStep}>
      <div className={styles.workflowIcon}>🧠</div>
      <h3 className={styles.workflowStepTitle}>2. AI Analysis</h3>
      <p className={styles.workflowText}>
        RIX instantly analyzes millions of data points, connecting disparate information.
      </p>
    </div>

    <div className={styles.workflowStep}>
      <div className={styles.workflowIcon}>📊</div>
      <h3 className={styles.workflowStepTitle}>3. Actionable Insights</h3>
      <p className={styles.workflowText}>
        Receive clear, visual reports that highlight key trends, opportunities, and risks.
      </p>
    </div>
  </div>
</section>

<section className={styles.innovatorsSection}>
  <h2 className={styles.innovatorsTitle}>Empowering Every Innovator</h2>
  <p className={styles.innovatorsSubtitle}>
    RIX is designed for the diverse needs of forward-thinking organizations.
  </p>

  <div className={styles.innovatorsGrid}>
    <div className={styles.innovatorCard}>
      <div className={styles.innovatorIcon}>📑</div>
      <h3 className={styles.innovatorTitle}>Corporate Strategy</h3>
      <p className={styles.innovatorText}>
        Outmaneuver competitors and identify M&amp;A targets with real-time market intelligence.
      </p>
    </div>

    <div className={styles.innovatorCard}>
      <div className={styles.innovatorIcon}>💡</div>
      <h3 className={styles.innovatorTitle}>Venture Capital</h3>
      <p className={styles.innovatorText}>
        Source deals, perform due diligence, and monitor portfolio companies with unmatched data depth.
      </p>
    </div>

    <div className={styles.innovatorCard}>
      <div className={styles.innovatorIcon}>🔗</div>
      <h3 className={styles.innovatorTitle}>R&amp;D Teams</h3>
      <p className={styles.innovatorText}>
        Accelerate your innovation pipeline by mapping technology landscapes and identifying key researchers.
      </p>
    </div>

    <div className={styles.innovatorCard}>
      <div className={styles.innovatorIcon}>📊</div>
      <h3 className={styles.innovatorTitle}>Consulting Firms</h3>
      <p className={styles.innovatorText}>
        Deliver superior value to clients with data-driven insights for any industry or market.
      </p>
    </div>
  </div>
</section>


<section className={styles.ctaSection}>
  <h2 className={styles.ctaTitle}>Ready to See the Future?</h2>
  <p className={styles.ctaSubtitle}>
    Unlock the strategic insights you&apos;ve been missing. Get started with a 
    personalized demo of RIX and discover your competitive advantage.
  </p>
  <button className={styles.ctaButton}>
    Schedule Your Free Demo
  </button>
</section>


    </div>
  );
}