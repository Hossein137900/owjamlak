import AdminList from "@/components/static/admins/adminList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " مدیران اوج | اوج",
  description:
    "با تیم املاک در تماس باشید. ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم.",
};
const page = () => {
  return (
    <main className="" dir="rtl">
      <AdminList />
    </main>
  );
};

export default page;
