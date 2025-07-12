"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FiAward,
  FiTrendingUp,
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { BsHCircle } from "react-icons/bs";
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

  console.log(topConsultant);

  if (isLoading) {
    return (
      <section className="py-16 px-4 mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !topConsultant) {
    return (
      <section className="py-16 px-4 mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">خطا در بارگذاری اطلاعات مشاور</p>
          </div>
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
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <BsHCircle className="text-yellow-500 text-2xl" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              مشاور برتر ماه
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <BsHCircle className="text-yellow-500 text-2xl" />
            </motion.div>
          </div>
          <p className="text-gray-600 text-lg">
            بهترین مشاور املاک ماه جاری با عملکرد استثنایی
          </p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Consultant Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative mx-auto lg:mx-0"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  {/* Animated Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-4 border-dashed border-purple-300"
                  />

                  {/* Profile Image */}
                  <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                    <Image
                      //   src={topConsultant.avatar || "/assets/images/hero.jpg"}
                      src={"/assets/images/hero.jpg"}
                      alt={topConsultant.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/images/hero.jpg";
                      }}
                    />
                  </div>

                  {/* Crown Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white p-3 rounded-full shadow-lg"
                  >
                    <FiAward size={24} />
                  </motion.div>

                  {/* Rating Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                  >
                    <FiStar className="fill-current" size={16} />
                    <span className="font-bold">{topConsultant.rating}</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Consultant Info */}
              <div className="lg:col-span-2 text-center lg:text-right space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {topConsultant.name}
                  </h3>
                  <p className="text-xl text-purple-600 font-semibold mb-4">
                    {topConsultant.title}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {topConsultant.description}
                  </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      {topConsultant.totalSales}
                    </div>
                    <div className="text-sm text-gray-600">فروش این ماه</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {topConsultant.experience}
                    </div>
                    <div className="text-sm text-gray-600">سال تجربه</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {topConsultant.rating}
                    </div>
                    <div className="text-sm text-gray-600">امتیاز</div>
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap justify-center lg:justify-end gap-4 text-sm text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-green-500" />
                    <span>{topConsultant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-500" />
                    <span>{topConsultant.email}</span>
                  </div>
                  {topConsultant.location && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-red-500" />
                      <span>{topConsultant.location}</span>
                    </div>
                  )}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex justify-center lg:justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg overflow-hidden"
                    onClick={() => {
                      window.open(`tel:${topConsultant.phone}`, "_self");
                    }}
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      <FiUsers />
                      تماس با مشاور
                    </span>
                  </motion.button>
                </motion.div>
              </div>
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
