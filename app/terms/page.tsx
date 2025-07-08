import TermsAndConditions from "@/components/static/terms/termsAndConditions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "قوانین و مقررات | املاک اوج",
  description:
    "قوانین و مقررات استفاده از خدمات املاک اوج شرایط خرید و فروش، حقوق و تعهدات طرفین",
  keywords:
    "قوانین املاک، مقررات خرید و فروش، شرایط استفاده، حقوق مشتری، تعهدات املاک",
  openGraph: {
    title: "قوانین و مقررات | املاک اوج",
    description: "قوانین و مقررات استفاده از خدمات املاک ایران",
    type: "website",
  },
};

export default function TermsPage() {
  return <TermsAndConditions />;
}
