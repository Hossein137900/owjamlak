import { Metadata } from "next";
import AdminLayout from "@/components/static/admin/adminLayout";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

export const metadata: Metadata = {
  title: "  پنل مدیریت | اوج",
  description:
    "با تیم املاک در تماس باشید. ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم.",
};
const page = () => {
  return (
    <AdminAuthProvider>
      <main className="" dir="rtl">
        <AdminLayout />
      </main>
    </AdminAuthProvider>
  );
};

export default page;
