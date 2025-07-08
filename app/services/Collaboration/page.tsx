import CollaborationPage from "@/components/static/services/collaboration";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: " همکاری",
  description:
    "آخرین مقالات و راهنماهای تخصصی در زمینه خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران",
};

const LegalConsultation = () => {
  return (
    <main>
      <CollaborationPage />{" "}
    </main>
  );
};

export default LegalConsultation;
