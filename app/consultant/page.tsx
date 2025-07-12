import { GetServerSideProps } from "next";
import Head from "next/head";
import { Consultant } from "@/types/type";
import connect from "@/lib/data";
import ConsultantModel from "@/models/consultant";
import ConsultantsList from "@/components/static/consultants/consultantsList";

interface ConsultantsPageProps {
  consultants: Consultant[];
  error?: string;
}

const ConsultantsPage: React.FC<ConsultantsPageProps> = ({
  consultants,
  error,
}) => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {error ? (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600 text-lg">
                خطا در بارگذاری مشاوران: {error}
              </p>
            </div>
          </div>
        ) : (
          <ConsultantsList initialConsultants={consultants} />
        )}
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     await connect();

//     const consultants = await ConsultantModel.find({ isActive: true })
//       .sort({ experienceYears: -1, posterCount: -1 })
//       .lean();

//     return {
//       props: {
//         consultants: JSON.parse(JSON.stringify(consultants)),
//       },
//     };
//   } catch (error: any) {
//     console.error("Error fetching consultants:", error);
//     return {
//       props: {
//         consultants: [],
//         error: "خطا در بارگذاری مشاوران",
//       },
//     };
//   }
// };

export default ConsultantsPage;
