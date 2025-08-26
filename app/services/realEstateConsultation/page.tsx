import RealEstateConsultationPage from "@/components/static/services/realStateConsultation";
import { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "مشاور املاک",
  description:
    "آخرین مقالات و راهنماهای تخصصی در زمینه خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران",
};

const LegalConsultation = () => {
  return (
    <main>
      <RealEstateConsultationPage />
    </main>
  );
};

export default LegalConsultation;
