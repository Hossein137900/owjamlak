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
    <section className="w-full bg-white " dir="rtl">
      <OwjAdComponent />
      <div className="px-4 md:px-20">
        <AboutUsHero />
        <AboutUsStats />
      </div>
    </section>
  );
}
