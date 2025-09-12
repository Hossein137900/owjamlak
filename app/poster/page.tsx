import type { Metadata } from "next";
import PosterListPage from "@/components/static/poster/posterList";

export const metadata: Metadata = {
  title: "آگهی‌های املاک | اوج املاک ایران",
  description:
    "مشاهده آخرین آگهی‌های املاک شامل خرید، فروش و اجاره آپارتمان، ویلا، زمین و املاک تجاری در ایران با اوج املاک.",
  keywords: [
    "آگهی املاک",
    "خرید آپارتمان",
    "فروش ویلا",
    "اجاره ملک",
    "املاک تجاری",
    "پوستر ملک",
    "آگهی ملک ایران",
  ],
  openGraph: {
    title: "آگهی‌های املاک | اوج املاک ایران",
    description:
      "تمام آگهی‌های خرید، فروش و اجاره ملک را در اوج املاک ایران مشاهده کنید. فرصت‌های سرمایه گذاری را از دست ندهید.",
    url: "https://oujamlak.ir/poster",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // پیشنهاد: تصویر اختصاصی پوستر
        width: 1200,
        height: 630,
        alt: "آگهی‌های املاک اوج",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "آگهی‌های املاک | اوج املاک ایران",
    description:
      "مشاهده آخرین آگهی‌های خرید، فروش و اجاره ملک در ایران با اوج املاک.",
    images: ["https://oujamlak.ir/assets/images/poster-cover.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/poster",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

export default function PosterPage() {
  return <PosterListPage />;
}
