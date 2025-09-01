import type { Metadata } from "next";
import LegalConsultationPage from "@/components/static/services/legalConsultation";

export const metadata: Metadata = {
  title: "مشاوره حقوقی املاک | اوج املاک",
  description:
    "خدمات مشاوره حقوقی اوج املاک برای خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران. با تیم حقوقی حرفه‌ای اوج املاک همراه باشید.",
  keywords: [
    "مشاوره حقوقی املاک",
    "وکیل املاک",
    "مشاوره خرید و فروش ملک",
    "مشاوره قرارداد اجاره",
    "خدمات حقوقی ملک",
    "اوچ املاک حقوقی",
  ],
  openGraph: {
    title: "مشاوره حقوقی املاک | اوج املاک",
    description:
      "خدمات مشاوره حقوقی برای خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران. راهنمای حقوقی معاملات ملکی با اوج املاک.",
    url: "https://oujamlak.com/services/legalConsultation",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.com/og-image.jpg", // پیشنهاد: تصویر اختصاصی برای مشاوره حقوقی
        width: 1200,
        height: 630,
        alt: "مشاوره حقوقی املاک اوج",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "مشاوره حقوقی املاک | اوج املاک",
    description:
      "خدمات مشاوره حقوقی برای خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران.",
    images: ["https://oujamlak.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.com/services/legalConsultation",
  },
  metadataBase: new URL("https://oujamlak.com"),
};

const LegalConsultation = () => {
  return (
    <main>
      <LegalConsultationPage />
    </main>
  );
};

export default LegalConsultation;
