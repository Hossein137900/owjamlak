import type { Metadata } from "next";
import OffersPage from "@/components/static/offers/offerContainer";

export const metadata: Metadata = {
  title: "آگهی‌های سرمایه گذاری | اوج املاک ایران",
  description:
    "تمام آگهی‌های املاک شامل خرید، فروش و اجاره آپارتمان، ویلا، زمین و املاک تجاری در ایران. بهترین فرصت‌های سرمایه گذاری را در اوج املاک مشاهده کنید.",
  keywords: [
    "آگهی املاک",
    "خرید آپارتمان",
    "فروش ویلا",
    "اجاره ملک",
    "املاک تجاری",
    "سرمایه گذاری در املاک",
    "آگهی ملک ایران",
  ],
  openGraph: {
    title: "آگهی‌های سرمایه گذاری | اوج املاک ایران",
    description:
      "مشاهده آخرین آگهی‌های خرید، فروش و اجاره ملک در ایران با اوج املاک. فرصت‌های سرمایه گذاری را از دست ندهید.",
    url: "https://oujamlak.com/offers",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.com/og-image.jpg", // پیشنهاد: تصویر اختصاصی کاور آگهی‌ها
        width: 1200,
        height: 630,
        alt: "آگهی‌های سرمایه گذاری املاک ایران",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "آگهی‌های سرمایه گذاری | اوج املاک ایران",
    description:
      "مشاهده آخرین آگهی‌های خرید، فروش و اجاره ملک در ایران با اوج املاک.",
    images: ["https://oujamlak.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.com/offers",
  },
  metadataBase: new URL("https://oujamlak.com"),
};

export default function Offers() {
  return <OffersPage />;
}
