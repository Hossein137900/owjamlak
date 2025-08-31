"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiTrendingUp,
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { ConsultantChampion } from "@/types/type";
import useConsultants from "@/hooks/useConsultants";

const TopConsultant: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { consultants, isLoading, error } = useConsultants();

  // Get the top consultant (first one with isTopConsultant: true)
  const topConsultant =
    consultants && consultants.length > 0
      ? consultants.find(
          (consultant: ConsultantChampion) => consultant.isTopConsultant
        ) || consultants[0]
      : null;

  if (isLoading) {
    return (
      <section className="py-16 px-4 mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">درحال بارگذاری</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !topConsultant) {
    return (
      <section className="py-16 px-4 mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>

            {/* Main title with enhanced styling */}
            <div className="relative bg-white px-8 py-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
                >
                  <FiAward className="text-white text-xl" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  مشاور برتر ماه
                </h2>

                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                  }}
                  className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
                >
                  <FiStar className="text-white text-xl" />
                </motion.div>
              </div>

              {/* Enhanced subtitle */}
              <div className="space-y-3">
                <p className="text-xl text-gray-700 font-medium">
                  بهترین مشاور املاک ماه جاری با عملکرد استثنایی
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>آماده ارائه خدمات تخصصی املاک</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="consultant-pattern"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect
                width="100"
                height="100"
                fill="url(#consultant-pattern)"
                className="text-purple-600"
              />
            </svg>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10" />

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-8 right-8 text-yellow-400"
          >
            <FiAward size={32} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-8 left-8 text-green-400"
          >
            <FiTrendingUp size={28} />
          </motion.div>

          <div className="relative p-8 md:p-12">
            {/* Consultant Info - Full Width */}
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Achievement Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full mb-6">
                  <FiAward className="text-yellow-600" />
                  <span className="text-yellow-800 font-semibold text-sm">
                    مشاور برتر این ماه
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-yellow-500 fill-current text-xs"
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                  {topConsultant.name}
                </h3>
                <p className="text-2xl text-purple-600 font-semibold mb-6">
                  {topConsultant.title}
                </p>
                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                  {topConsultant.description}
                </p>
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl shadow-lg border border-blue-200 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
                  <FiTrendingUp className="text-blue-600 text-2xl mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-blue-700 mb-1">
                    {topConsultant.totalSales}
                  </div>
                  <div className="text-blue-600 font-medium">فروش این ماه</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-6 bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-2xl shadow-lg border border-green-200 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-300 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
                  <FiAward className="text-green-600 text-2xl mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    {topConsultant.experience}
                  </div>
                  <div className="text-green-600 font-medium">سال تجربه</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-2xl shadow-lg border border-purple-200 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-300 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
                  <FiStar className="text-purple-600 text-2xl mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-purple-700 mb-1">
                    {topConsultant.rating}
                  </div>
                  <div className="text-purple-600 font-medium">
                    امتیاز کیفیت
                  </div>
                </motion.div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gray-50 rounded-2xl p-6 max-w-2xl mx-auto"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  اطلاعات تماس
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-green-100 rounded-full">
                      <FiPhone className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {topConsultant.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FiMail className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      {topConsultant.email}
                    </span>
                  </div>
                  {topConsultant.location && (
                    <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                      <div className="p-2 bg-red-100 rounded-full">
                        <FiMapPin className="text-red-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {topConsultant.location}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl overflow-hidden min-w-[200px]"
                  onClick={() => {
                    window.open(`tel:${topConsultant.phone}`, "_self");
                  }}
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-3">
                    <FiPhone className="text-lg" />
                    تماس فوری
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-2xl font-bold shadow-lg hover:bg-purple-50 transition-colors duration-300 min-w-[200px]"
                  onClick={() => {
                    window.open(`mailto:${topConsultant.email}`, "_self");
                  }}
                >
                  <span className="flex items-center justify-center gap-3">
                    <FiMail className="text-lg" />
                    ارسال ایمیل
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default TopConsultant;
