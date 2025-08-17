import OwjAdComponent from "@/components/static/about/aboutHero";
import AboutUsHero from "@/components/static/about/aboutUsHero";
import AboutUsStats from "@/components/static/about/aboutUsStats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " درباره  ما | اوج",
  description:
    "با تیم املاک در تماس باشید. ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم.",
}; 
export default function AboutPage() {
  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 md:px-20" dir="rtl">
      <OwjAdComponent />
      <AboutUsHero />
      <div className="my-16 border-t border-gray-100 pt-16"></div>
      <AboutUsStats />
    </section>
  );
}
