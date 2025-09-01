import CategoryBoxes from "@/components/global/categoryBoxes";
import WhyChooseUs from "@/components/global/whyUs";
import SliderMobile from "@/components/static/home/sliderMobile";
import RealEstateSearch from "@/components/static/home/heroSection";
import InvestmentBanner from "@/components/static/home/investmentBanner";
import OurApproachPage from "@/components/static/home/works";
import SEODescription from "@/components/static/ui/seoDesc";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اوج املاک",
  description:
    "اوج املاک، سامانه پیشرفته خرید، فروش و اجاره انواع آپارتمان، ویلا و زمین در تهران و سراسر ایران. بهترین مشاوران املاک در کنار شما برای یک معامله امن و مطمئن.",
  keywords: [
    "خرید ملک",
    "فروش آپارتمان",
    "اجاره خانه",
    "مشاور املاک تهران",
    "ویلا شمال",
    "زمین کشاورزی",
    "خانه لوکس",
    "رهن و اجاره",
  ],
  authors: [{ name: "Ouj Amlak" }],
  creator: "Ouj Amlak",
  publisher: "Ouj Amlak",

  openGraph: {
    title: "اوج املاک | خرید و فروش ملک در تهران و ایران",
    description:
      "با اوج املاک، بهترین پیشنهادهای خرید، فروش و اجاره ملک را در تهران و سراسر ایران پیدا کنید. همراه با مشاوران حرفه‌ای و خدمات حقوقی مطمئن.",
    url: "https://oujamlak.com",
    siteName: "Ouj Amlak",
    images: [
      {
        url: "https://oujamlak.com/og-image.jpg", // بهتره یه تصویر 1200x630 مخصوص OG بسازی
        width: 1200,
        height: 630,
        alt: "اوج املاک - خرید و فروش ملک",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "اوج املاک | خرید و فروش ملک در تهران و ایران",
    description:
      "سامانه خرید و فروش ملک در تهران و ایران با مشاوران حرفه‌ای و خدمات حقوقی مطمئن.",
    images: ["https://oujamlak.com/og-image.jpg"],
  },

  alternates: {
    canonical: "https://oujamlak.com",
  },

  metadataBase: new URL("https://oujamlak.com"),
};

export default function Home() {
  return (
    <div className="">
      <RealEstateSearch />

      <div className="block md:hidden">
        <SliderMobile />
      </div>
      <CategoryBoxes />
      <WhyChooseUs />
      <InvestmentBanner />
      <OurApproachPage />

      <SEODescription />
    </div>
  );
}
