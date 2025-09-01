import type { Metadata } from "next";
import VideoContainer from "@/components/static/videos/videoContainer";

export const metadata: Metadata = {
  title: "ویدیوهای املاک | اوج املاک",
  description:
    "مشاهده ویدیوهای آموزشی و معرفی املاک شامل خرید، فروش، اجاره، سرمایه‌گذاری و مشاوره تخصصی در بازار املاک ایران با اوج املاک.",
  keywords: [
    "ویدیو املاک",
    "آموزش خرید و فروش ملک",
    "ویدیو سرمایه گذاری ملک",
    "مشاوره املاک",
    "ویدیوهای آموزشی املاک",
    "اوچ املاک",
  ],
  openGraph: {
    title: "ویدیوهای املاک | اوج املاک",
    description:
      "ویدیوهای آموزشی و معرفی املاک شامل خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران با اوج املاک.",
    url: "https://oujamlak.com/videos",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.com/og-image.jpg", // پیشنهاد: تصویر اختصاصی برای ویدیوها
        width: 1200,
        height: 630,
        alt: "ویدیوهای املاک اوج",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ویدیوهای املاک | اوج املاک",
    description:
      "مشاهده ویدیوهای آموزشی و معرفی املاک شامل خرید، فروش، اجاره و سرمایه‌گذاری با اوج املاک.",
    images: ["https://oujamlak.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.com/videos",
  },
  metadataBase: new URL("https://oujamlak.com"),
};

export default function Video() {
  return (
    <main className="">
      <VideoContainer />
    </main>
  );
}
