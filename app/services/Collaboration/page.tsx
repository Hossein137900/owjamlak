import type { Metadata } from "next";
import CollaborationPage from "@/components/static/services/collaboration";

export const metadata: Metadata = {
  title: "همکاری با اوج املاک | فرصت‌های مشارکت در بازار ملک",
  description:
    "صفحه همکاری اوج املاک برای مشارکت و همکاری با مشاوران، سرمایه‌گذاران و شرکت‌های فعال در زمینه خرید، فروش و اجاره ملک در ایران.",
  keywords: [
    "همکاری املاک",
    "فرصت همکاری در املاک",
    "مشارکت در خرید ملک",
    "سرمایه گذاری املاک",
    "همکاری با مشاور املاک",
  ],
  openGraph: {
    title: "همکاری با اوج املاک | فرصت‌های مشارکت در بازار ملک",
    description:
      "همکاری و مشارکت با اوج املاک برای مشاوران، سرمایه‌گذاران و شرکت‌های فعال در حوزه ملک. فرصت‌های طلایی برای همکاری.",
    url: "https://oujamlak.ir/services/Collaboration",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // پیشنهاد: تصویر اختصاصی همکاری
        width: 1200,
        height: 630,
        alt: "همکاری با اوج املاک",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "همکاری با اوج املاک | فرصت‌های مشارکت در بازار ملک",
    description:
      "همکاری و مشارکت با اوج املاک برای مشاوران، سرمایه‌گذاران و شرکت‌های فعال در حوزه ملک.",
    images: ["https://oujamlak.ir/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/services/Collaboration",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

const Collaboration = () => {
  return (
    <main>
      <CollaborationPage />
    </main>
  );
};

export default Collaboration;
