import type { Metadata } from "next";
import ServicesPage from "@/components/static/services/service-container";

export const metadata: Metadata = {
  title: "خدمات اوج | مشاوره و خدمات املاک حرفه‌ای",
  description:
    "بررسی و معرفی خدمات اوج املاک شامل مشاوره خرید، فروش، اجاره، سرمایه‌گذاری و خدمات حقوقی در بازار املاک ایران. با تیم حرفه‌ای اوج همراه باشید.",
  keywords: [
    "خدمات اوج املاک",
    "مشاوره املاک",
    "خدمات حقوقی ملک",
    "سرمایه گذاری در املاک",
    "خرید و فروش ملک",
    "اجاره آپارتمان",
    "مشاور املاک حرفه‌ای",
  ],
  openGraph: {
    title: "خدمات اوج | مشاوره و خدمات املاک حرفه‌ای",
    description:
      "خدمات حرفه‌ای اوج املاک شامل مشاوره خرید، فروش، اجاره و سرمایه‌گذاری. تجربه‌ای امن و مطمئن برای معاملات ملکی شما.",
    url: "https://oujamlak.ir/services",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // پیشنهاد: تصویر اختصاصی برای صفحه خدمات
        width: 1200,
        height: 630,
        alt: "خدمات اوج املاک",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "خدمات اوج | مشاوره و خدمات املاک حرفه‌ای",
    description:
      "خدمات حرفه‌ای اوج املاک شامل مشاوره خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران.",
    images: ["https://oujamlak.ir/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/services",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

const Services = () => {
  return (
    <main>
      <ServicesPage />
    </main>
  );
};

export default Services;
