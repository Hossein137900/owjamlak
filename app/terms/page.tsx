import type { Metadata } from "next";
import TermsAndConditions from "@/components/static/terms/termsAndConditions";

export const metadata: Metadata = {
  title: "قوانین و مقررات | اوج املاک",
  description:
    "تمام قوانین و مقررات استفاده از خدمات اوج املاک شامل شرایط خرید و فروش، حقوق و تعهدات طرفین و استفاده صحیح از خدمات سایت.",
  keywords: [
    "قوانین املاک",
    "مقررات خرید و فروش",
    "شرایط استفاده سایت",
    "حقوق مشتری",
    "تعهدات املاک",
    "شرایط خدمات املاک",
  ],
  openGraph: {
    title: "قوانین و مقررات | اوج املاک",
    description:
      "تمام قوانین و مقررات استفاده از خدمات اوج املاک شامل شرایط خرید و فروش، حقوق و تعهدات طرفین.",
    url: "https://oujamlak.com/terms",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.com/og-image.jpg", // پیشنهاد: تصویر اختصاصی قوانین و مقررات
        width: 1200,
        height: 630,
        alt: "قوانین و مقررات اوج املاک",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "قوانین و مقررات | اوج املاک",
    description:
      "قوانین و مقررات استفاده از خدمات اوج املاک شامل شرایط خرید و فروش و حقوق طرفین.",
    images: ["https://oujamlak.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.com/terms",
  },
  metadataBase: new URL("https://oujamlak.com"),
};

export default function TermsPage() {
  return <TermsAndConditions />;
}
