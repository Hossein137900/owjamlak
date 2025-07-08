"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function WhyUs() {
  return (
    <div
      dir="rtl"
      className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-16 px-4 md:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full lg:w-1/2 text-right relative"
      >
        {/* Color spot circle in the background */}
        <div className="absolute bottom-28 right-8 w-40 h-40 rounded-full opacity-20 blur-[50px] bg-[#01ae9b] z-0"></div>

        {/* Content with higher z-index to appear above the color spots */}
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-4">
            چرا باید ما را انتخاب کنید
          </h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است.
          </p>

          <ul className="space-y-3 text-sm md:text-base text-gray-700">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#01ae9b]" /> معاملات ۱۰۰٪ امن
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#01ae9b]" /> طبقه‌بندی‌شده از خواص
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#01ae9b]" /> مورد اعتماد هزاران
              نفر
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#01ae9b]" /> خرید و فروش امن
            </li>
          </ul>

          <div className="mt-6">
            <button className="bg-[#01ae9b] text-white px-6 py-3 rounded-full text-sm hover:bg-[#019887] transition-all">
              اطلاعات بیشتر
            </button>
          </div>
        </div>
      </motion.div>
      <div className="w-full md:w-1/2 md:h-1/2">
        <Image
          src="/assets/images/hero4.jpg"
          alt="Why choose us"
          width={2000}
          height={2000}
          className="rounded-2xl shadow-xl w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
