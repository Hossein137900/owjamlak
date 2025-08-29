"use client";
import   { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaPhone,
  FaStar,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineBriefcase } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
// import { MdRealEstateAgent } from "react-icons/md";
import { Consultant } from "@/types/type";

interface ConsultantDetailPageProps {
  consultantId?: string;
  consultant?: Consultant;
}

const ConsultantDetailPage: React.FC<ConsultantDetailPageProps> = ({
  consultantId,
  consultant: initialConsultant,
}) => {
  const [consultant, setConsultant] = useState<Consultant | null>(
    initialConsultant || null
  );
  const [loading, setLoading] = useState(!initialConsultant);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialConsultant && consultantId) {
      fetchConsultant(consultantId);
    }
  }, [consultantId, initialConsultant]);

  const fetchConsultant = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/consultants/${id}`);

      if (!res.ok) {
        throw new Error("مشاور یافت نشد");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "خطا در دریافت اطلاعات مشاور");
      }

      setConsultant(data.consultant);
    } catch (error) {
      console.log("Error fetching consultant:", error);
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (phone: string) => {
    window.open(`https://wa.me/98${phone.substring(1)}`, "_blank");
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, "_self");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b] mx-auto mb-4"></div>
          <p className="text-gray-600">درحال بارگذاری</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            مشاور یافت نشد
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "مشاور مورد نظر یافت نشد"}
          </p>
          <Link
            href="/consultants"
            className="inline-flex items-center gap-2 bg-[#01ae9b] hover:bg-[#019688] text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FaArrowRight />
            <span>بازگشت به لیست مشاوران</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/consultants"
            className="inline-flex items-center gap-2 text-[#01ae9b] hover:text-[#019688] transition-colors"
          >
            <FaArrowRight />
            <span>بازگشت به لیست مشاوران</span>
          </Link>
        </motion.div>

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
                    consultant.image || "/assets/images/default-consultant.jpg"
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className=" p-4 rounded-lg text-center shadow-md">
                  <BiTime className="text-2xl text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {consultant.experienceYears}
                  </div>
                  <div className="text-sm text-gray-600">سال تجربه</div>
                </div>
{/* 
                <div className=" p-4 rounded-lg text-center shadow-md">
                  <MdRealEstateAgent className="text-2xl text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {consultant.posterCount}
                  </div>
                  <div className="text-sm text-gray-600">آگهی فعال</div>
                </div> */}

                <div className=" p-4 rounded-lg text-center shadow-md">
                  <HiOutlineLocationMarker className="text-2xl text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {consultant.workAreas?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">منطقه فعالیت</div>
                </div>

                {consultant.rating && (
                  <div className=" p-4 rounded-lg text-center shadow-md">
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
                  className="flex items-center cursor-pointer gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FaWhatsapp className="text-lg" />
                  <span>واتساپ</span>
                </button>

                <button
                  onClick={() => handlePhoneClick(consultant.phone)}
                  className="flex items-center cursor-pointer gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FaPhone className="text-lg" />
                  <span>تماس تلفنی</span>
                </button>

                {consultant.email && (
                  <button
                    onClick={() => handleEmailClick(consultant.email!)}
                    className="flex items-center cursor-pointer gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
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
              <h2 className="text-xl font-bold text-gray-800">مناطق فعالیت</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {consultant.workAreas?.map((area, index) => (
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
          <h3 className="text-2xl font-bold mb-4">آماده همکاری با شما هستیم</h3>
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
  );
};

export default ConsultantDetailPage;
