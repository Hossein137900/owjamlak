import ServicesPage from "@/components/static/services/service-container";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "خدمات اوج",
  description:
    "آخرین مقالات و راهنماهای تخصصی در زمینه خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران",
};

const Services = () => {
  return (
    <main>
      <ServicesPage />
    </main>
  );
};

export default Services;
