import type { Metadata } from "next";
import RealEstateConsultationPage from "@/components/static/services/realStateConsultation";

export const metadata: Metadata = {
  title: "مشاوره املاک | اوج املاک",
  description:
    "خدمات مشاوره املاک اوج برای خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران. از تجربه مشاوران حرفه‌ای ما برای معاملات مطمئن استفاده کنید.",
  keywords: [
    "مشاوره املاک",
    "مشاور خرید و فروش ملک",
    "مشاوره اجاره آپارتمان",
    "سرمایه گذاری در ملک",
    "مشاوره تخصصی املاک",
    "اوچ املاک",
  ],
  openGraph: {
    title: "مشاوره املاک | اوج املاک",
    description:
      "خدمات مشاوره حرفه‌ای اوج املاک برای خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران. با کمک مشاوران متخصص، معاملات امن داشته باشید.",
    url: "https://oujamlak.ir/services/realEstateConsultation",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // پیشنهاد: تصویر اختصاصی مشاوره املاک
        width: 1200,
        height: 630,
        alt: "مشاوره املاک اوج",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "مشاوره املاک | اوج املاک",
    description:
      "خدمات مشاوره حرفه‌ای اوج املاک برای خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران.",
    images: ["https://oujamlak.ir/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/services/realEstateConsultation",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

const RealEstateConsultation = () => {
  return (
    <main>
      <RealEstateConsultationPage />
    </main>
  );
};

export default RealEstateConsultation;
