import ConsultantDetailPage from "@/components/static/consultants/consultantDetailPage";
import { Consultant } from "@/types/type";
import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ConsultantDetail({ params }: PageProps) {
  return <ConsultantDetailPage consultantId={params.id} />;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/consultants/${params.id}`
  );
  const data = await res.json();

  if ( !data.consultant) {
    return {
      title: "مشاور یافت نشد",
      description: "اطلاعاتی برای این مشاور در دسترس نیست.",
    };
  }

  const consultant: Consultant = data.consultant;

  return {
    title: `مشاور  ${consultant.name} | اوج املاک`,
    description:
      consultant.description ||
      `اطلاعات تماس، سوابق کاری و تخصص‌های ${
        consultant.name
      }، مشاور املاک حرفه‌ای در مناطق ${consultant.workAreas?.join("، ")}.`,
    keywords: [
      consultant.name,
      "مشاور املاک",
      ...(consultant.workAreas || []),
      ...(consultant.specialties || []),
    ],
    openGraph: {
      title: `مشاور املاک ${consultant.name} | اوج املاک`,
      description:
        consultant.description ||
        `با ${consultant.name} تماس بگیرید و مشاوره تخصصی بگیرید.`,
      images: [
        {
          url: consultant.image || "/assets/images/default-consultant.jpg",
          width: 800,
          height: 600,
          alt: `تصویر ${consultant.name}`,
        },
      ],
      type: "profile",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/consultants/${consultant._id}`,
    },
  };
}
