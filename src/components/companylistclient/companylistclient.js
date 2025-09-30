"use client";
import CompanyListPage from "@/sections/companylist/companylist";
import React, { Suspense } from "react";


export default function CompanyListClient() {
  return (
    <Suspense fallback={<div>Loading Company list page...</div>}>
      <CompanyListPage />
    </Suspense>
  );
}