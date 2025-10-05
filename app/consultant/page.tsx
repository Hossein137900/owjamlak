import type { Metadata } from "next";
import ConsultantsList from "@/components/static/consultants/consultantsList";

export const metadata: Metadata = {
  title: "مشاوران املاک تهران | لیست بهترین مشاوران اوج املاک",
  description:
    "بهترین مشاوران املاک تهران با تجربه و تخصص در خرید، فروش و اجاره انواع ملک. اوج املاک شما را به مشاور مطمئن در مناطق مختلف تهران وصل می‌کند.",
  keywords: [
    "مشاور املاک",
    "مشاوران املاک تهران",
    "خرید آپارتمان تهران",
    "فروش خانه",
    "مشاور املاک شرق تهران",
    "مشاور املاک غرب تهران",
    "مشاور املاک نارمک",
    "مشاور املاک سبلان",
    "مشاور املاک اوج",
    "لیست مشاوران املاک",
  ],
  openGraph: {
    title: "لیست بهترین مشاوران املاک تهران | اوج املاک",
    description:
      "لیست کامل مشاوران حرفه‌ای املاک در تهران برای خرید، فروش و اجاره ملک. مشاوران مورد اعتماد در مناطق مختلف تهران در اوج املاک.",
    url: "https://oujamlak.ir/consultants",
    siteName: "Ouj Amlak",
    type: "website",
    images: [
      {
        url: "https://oujamlak.ir/og-image.jpg", // بهتره یه تصویر اختصاصی برای کاور مشاوران بسازی
        width: 1200,
        height: 630,
        alt: "مشاوران املاک تهران",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "مشاوران املاک تهران | اوج املاک",
    description:
      "لیست مشاوران املاک حرفه‌ای تهران برای خرید، فروش و اجاره ملک. انتخابی مطمئن در اوج املاک.",
    images: ["https://oujamlak.ir/og-image.jpg"],
  },
  alternates: {
    canonical: "https://oujamlak.ir/consultant",
  },
  metadataBase: new URL("https://oujamlak.ir"),
};

const ConsultantsPage = () => {
  return (
    <main>
      <ConsultantsList />
    </main>
  );
};

export default ConsultantsPage;
