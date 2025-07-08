import LegalConsultationPage from "@/components/static/services/legalConsultation";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "مشاور حقوقی",
  description:
    "آخرین مقالات و راهنماهای تخصصی در زمینه خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران",
};

const LegalConsultation = () => {
  return (
    <main>
      <LegalConsultationPage />{" "}
    </main>
  );
};

export default LegalConsultation;
