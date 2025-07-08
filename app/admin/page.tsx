import React from "react";
import { Metadata } from "next";
import AdminLayout from "@/components/static/admin/adminLayout";

export const metadata: Metadata = {
  title: "  پنل مدیریت | اوج",
  description:
    "با تیم املاک در تماس باشید. ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم.",
};
const page = () => {
  return (
    <main className="mt-20" dir="rtl">
      <AdminLayout />
    </main>
  );
};

export default page;
