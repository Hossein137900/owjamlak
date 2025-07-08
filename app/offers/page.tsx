import OffersPage from "@/components/static/offers/offerContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آگهی‌های سرمایه گذاری | املاک ایران",
  description:
    "مشاهده تمام آگهی‌های املاک شامل خرید، فروش و اجاره آپارتمان، ویلا و املاک تجاری",
  keywords: "آگهی املاک، خرید آپارتمان، فروش ویلا، اجاره ملک، املاک تجاری",
  openGraph: {
    title: "آگهی‌های سرمایه گذاری | املاک ایران",
    description: "مشاهده تمام آگهی‌های املاک",
    type: "website",
  },
};

export default function Offers() {
  return <OffersPage />;
}
