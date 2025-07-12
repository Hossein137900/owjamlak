import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhone, FaStar, FaEnvelope } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineBriefcase } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import { MdRealEstateAgent } from "react-icons/md";
import { Consultant } from "@/types/type";
import connect from "@/lib/data";
import ConsultantModel from "@/models/consultant";

interface ConsultantDetailPageProps {
  consultant: Consultant | null;
  error?: string;
}

const ConsultantDetailPage: React.FC<ConsultantDetailPageProps> = ({
  consultant,
  error,
}) => {
  const handleWhatsAppClick = (phone: string) => {
    window.open(`https://wa.me/98${phone.substring(1)}`, "_blank");
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, "_self");
  };

  if (error || !consultant) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              مشاور یافت نشد
            </h1>
            <p className="text-gray-600">
              {error || "مشاور مورد نظر یافت نشد"}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
   

      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/3">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={
                      consultant.image ||
                      "/assets/images/default-consultant.jpg"
                    }
                    alt={consultant.name}
                    fill
                    className="object-cover"
                  />
                  {consultant.rating && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-full flex items-center gap-2">
                      <FaStar />
                      <span className="font-semibold">{consultant.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="md:w-2/3 p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {consultant.name}
                  </h1>
                  <p className="text-xl text-[#01ae9b] font-semibold">
                    مشاور املاک
                  </p>
                </div>

                {consultant.description && (
                  <div className="mb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {consultant.description}
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <BiTime className="text-2xl text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {consultant.experienceYears}
                    </div>
                    <div className="text-sm text-gray-600">سال تجربه</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <MdRealEstateAgent className="text-2xl text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {consultant.posterCount}
                    </div>
                    <div className="text-sm text-gray-600">آگهی فعال</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <HiOutlineLocationMarker className="text-2xl text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {consultant.workAreas.length}
                    </div>
                    <div className="text-sm text-gray-600">منطقه فعالیت</div>
                  </div>

                  {consultant.rating && (
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <FaStar className="text-2xl text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {consultant.rating}
                      </div>
                      <div className="text-sm text-gray-600">امتیاز</div>
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleWhatsAppClick(consultant.whatsapp)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>واتساپ</span>
                  </button>

                  <button
                    onClick={() => handlePhoneClick(consultant.phone)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <FaPhone className="text-lg" />
                    <span>تماس تلفنی</span>
                  </button>

                  {consultant.email && (
                    <button
                      onClick={() => handleEmailClick(consultant.email!)}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      <FaEnvelope className="text-lg" />
                      <span>ایمیل</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Work Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <HiOutlineLocationMarker className="text-2xl text-[#01ae9b]" />
                <h2 className="text-xl font-bold text-gray-800">
                  مناطق فعالیت
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {consultant.workAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700 font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Specialties */}
            {consultant.specialties && consultant.specialties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <HiOutlineBriefcase className="text-2xl text-[#01ae9b]" />
                  <h2 className="text-xl font-bold text-gray-800">تخصص‌ها</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {consultant.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-[#01ae9b] to-[#019688] rounded-xl shadow-lg p-8 mt-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              آماده همکاری با شما هستیم
            </h3>
            <p className="text-lg mb-6 opacity-90">
              برای مشاوره رایگان و بازدید ملک با ما در تماس باشید
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FaPhone />
                <span>{consultant.phone}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FaWhatsapp />
                <span>{consultant.whatsapp}</span>
              </div>
              {consultant.email && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaEnvelope />
                  <span>{consultant.email}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   try {
//     await connect();

//     const consultant = await ConsultantModel.findById(params?.id).lean();

//     if (!consultant) {
//       return {
//         props: {
//           consultant: null,
//           error: "مشاور یافت نشد",
//         },
//       };
//     }

//     return {
//       props: {
//         consultant: JSON.parse(JSON.stringify(consultant)),
//       },
//     };
//   } catch (error: any) {
//     console.error("Error fetching consultant:", error);
//     return {
//       props: {
//         consultant: null,
//         error: "خطا در بارگذاری اطلاعات مشاور",
//       },
//     };
//   }
// };

export default ConsultantDetailPage;
