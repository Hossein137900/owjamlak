import ConsultantsList from "@/components/static/consultants/consultantsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مشاوران املاک اوج تهران | اوج املاک",
  description:
    "لیست کامل مشاوران املاک حرفه‌ای در تهران با تجربه بالا، مناطق فعالیت متنوع و تخصص‌های مختلف. بهترین مشاوران برای خرید و فروش ملک در تهران را اینجا پیدا کنید.",
  keywords: [
    "مشاور املاک",
    "مشاوران املاک تهران",
    "خرید خانه",
    "فروش آپارتمان",
    "مشاور املاک نارمک",
    "مشاور املاک سبلان",
    "مشاور املاک شرق تهران",
    "لیست مشاوران املاک",
    "اوج املاک",
    "املاکی شرق تهران",
  ],
  openGraph: {
    title: "لیست بهترین مشاوران املاک تهران | اوج املاک",
    description:
      "مشاوران حرفه‌ای و متخصص برای خرید و فروش خانه در مناطق مختلف تهران مخصوصا شرق تهران. از تخصص و تجربه‌ی آن‌ها برای معاملات مطمئن استفاده کنید.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/consultants`,
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/images/consultants-cover.jpg`,
        width: 1200,
        height: 630,
        alt: "مشاوران املاک تهران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مشاوران املاک تهران | اوج املاک",
    description:
      "لیست بهترین مشاوران املاک در تهران برای خرید، فروش و اجاره ملک. با اطمینان انتخاب کنید.",
    images: [
      `${process.env.NEXT_PUBLIC_BASE_URL}/assets/images/consultants-cover.jpg`,
    ],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/consultants`,
  },
};

const ConsultantsPage = () => {
  return (
    <div className="">
      <ConsultantsList />
    </div>
  );
};

export default ConsultantsPage;
