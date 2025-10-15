import UserProfile from '@/sections/user/userprofile';
import React from 'react';
import Head from "next/head";
import Link from "next/link";
import styles from "../../sections/companylist/companylist.module.css";

const UserProfilePage = () => {
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
          </header>

        <UserProfile/>

</div>
    </div>
  )
}

export default UserProfilePage;