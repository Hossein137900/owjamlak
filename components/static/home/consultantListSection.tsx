"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {   FaPhone, FaStar, FaArrowLeft, FaUsers } from "react-icons/fa";
import { Consultant } from "@/types/type";

const ConsultantListSection = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/consultants");
      if (!res.ok) {
        throw new Error("خطا در دریافت مشاوران");
      }
      const data = await res.json();
      setConsultants(data.consultants || []);
    } catch (err) {
      console.log("Error fetching consultants:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_25%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_25%,#01ae9b_0%,transparent_50%)] bg-[length:20px_20px] opacity-20 blur-sm"></div>
        <div className="text-center relative z-10 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01ae9b] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری مشاوران...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_25%_75%,#01ae9b_0%,transparent_50%),radial-gradient(circle_at_75%_25%,#01ae9b_0%,transparent_50%)] bg-[length:20px_20px] opacity-20 blur-sm"></div>
        <div className="text-center relative z-10 py-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">خطا</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchConsultants}
            className="bg-[#01ae9b] text-white px-6 py-3 rounded-lg hover:bg-[#019688] transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 relative overflow-hidden bg-gradient-to-b from-[#66308d] via-[#66308d]/70 to-white container mx-auto px-4 md:px-20"
      dir="rtl"
    >
      {/* Dotted blurred background */}
      <div className=" relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-50 mb-4">
            مشاوران حرفه‌ای
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            تیمی از مشاوران مجرب که با دانش عمیق از بازار املاک، بهترین گزینه‌ها
            را برای شما فراهم می‌کنند.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {consultants.slice(0, 3).map((consultant, index) => (
            <motion.div
              key={consultant._id + index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl  overflow-hidden hover:shadow-md hover:shadow-gray-500 transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={
                    consultant.image || "/assets/images/default-consultant.jpg"
                  }
                  alt={consultant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {consultant.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {consultant.experienceYears} سال تجربه -{" "}
                  {consultant.workAreas?.[0] || "مشاور املاک"}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaPhone className="w-3 h-3" />
                    <span>{consultant.phone}</span>
                  </div>
                  {consultant.rating && (
                    <div className="flex items-center gap-1">
                      <FaStar className="w-3 h-3 text-yellow-500" />
                      <span>{consultant.rating}</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/consultants/${consultant._id}`}
                  className="inline-flex items-center gap-2 text-[#01ae9b] hover:text-[#019688] transition-colors text-sm font-medium"
                >
                  مشاهده پروفایل
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe */}
        <div className="md:hidden overflow-x-auto">
          <div
            className="flex gap-4 pb-4"
            style={{ width: `${consultants.length * 280}px` }}
          >
            {consultants.map((consultant, index) => (
              <motion.div
                key={consultant._id + index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 w-64"
              >
                <div className="relative h-40">
                  <Image
                    src={
                      consultant.image ||
                      "/assets/images/default-consultant.jpg"
                    }
                    alt={consultant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                    {consultant.name}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {consultant.experienceYears} سال تجربه -{" "}
                    {consultant.workAreas?.[0] || "مشاور املاک"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <FaPhone className="w-3 h-3" />
                      <span>{consultant.phone}</span>
                    </div>
                    {consultant.rating && (
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-500" />
                        <span>{consultant.rating}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/consultants/${consultant._id}`}
                    className="inline-flex items-center gap-1 text-[#01ae9b] hover:text-[#019688] transition-colors text-xs font-medium"
                  >
                    مشاهده پروفایل
                    <FaArrowLeft className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/consultants"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#01ae9b] to-[#019688] text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            <FaUsers />
            <span>مشاهده همه مشاوران</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ConsultantListSection;
