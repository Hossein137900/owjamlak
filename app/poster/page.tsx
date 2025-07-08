import PosterListPage from "@/components/static/poster/posterList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آگهی‌های املاک | املاک اوج",
  description:
    "مشاهده تمام آگهی‌های املاک شامل خرید، فروش و اجاره آپارتمان، ویلا و املاک تجاری",
  keywords: "آگهی املاک، خرید آپارتمان، فروش ویلا، اجاره ملک، املاک تجاری",
  openGraph: {
    title: "آگهی‌های املاک | املاک اوج",
    description: "مشاهده تمام آگهی‌های املاک",
    type: "website",
  },
};

export default function PosterPage() {
  return <PosterListPage />;
}
