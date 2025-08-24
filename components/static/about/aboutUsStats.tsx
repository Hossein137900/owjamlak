"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaChartLine, FaUsers, FaAward } from "react-icons/fa";
import Link from "next/link";

export default function AboutUsStats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 py-16 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-purple-600 rounded-full blur-3xl"></div>
      </div>
      {/* Right Text */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="md:w-1/2 space-y-8 text-right relative z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          آینده‌ی سرمایه‌گذاری شما، امروز در{" "}
          <span className="bg-gradient-to-r from-[#01ae9b] to-purple-600 bg-clip-text text-transparent text-4xl md:text-6xl font-extrabold">
            اوج
          </span>{" "}
          رقم میخورد
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
          در اوج، ما بیش از یک مشاور املاک هستیم. ما شریک شما در مسیر یافتن
          بهترین فرصتهای سرمایهگذاری و خانهای هستیم که واقعاً شایسته شماست. با
          تجربهای بیش از ۱۰ سال و تیمی از متخصصان حرفهای، هر روز به هزاران نفر
          کمک میکنیم تا رویای خانهدار شدن را محقق کنند.
        </p>

        {/* Key Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
          className="grid grid-cols-2 gap-4 mt-8"
        >
          <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <FaAward className="text-[#01ae9b] text-2xl" />
            <div>
              <div className="font-bold text-gray-800">تضمین کیفیت</div>
              <div className="text-sm text-gray-600">۱۰۰% قانونی</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <FaUsers className="text-purple-600 text-2xl" />
            <div>
              <div className="font-bold text-gray-800">تیم متخصص</div>
              <div className="text-sm text-gray-600">۵۰+ مشاور</div>
            </div>
          </div>
        </motion.div>

        {/* Live Counters */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <div className="text-center p-4 bg-gradient-to-br from-[#01ae9b]/10 to-[#01ae9b]/5 rounded-xl">
            <div className="text-3xl font-bold text-[#01ae9b]">5000</div>
            <div className="text-sm text-gray-600 mt-1">املاک فعال</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">2500</div>
            <div className="text-sm text-gray-600 mt-1">مشتری راضی</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl">
            <div className="text-3xl font-bold text-orange-500">150</div>
            <div className="text-sm text-gray-600 mt-1">معامله روزانه</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl">
            <div className="text-3xl font-bold text-green-500">98</div>
            <div className="text-sm text-gray-600 mt-1">درصد رضایت</div>
          </div>
        </motion.div>

        <Link href="/contactUs" className="mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-[#01ae9b] to-teal-600 text-white px-10 py-4 rounded-full font-bold transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center gap-3 justify-center"
          >
            <span>تماس با ما</span>
            <FaChartLine className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Left Image + Stats */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="md:w-1/2 relative"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#01ae9b] to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/assets/images/aboutus1.png"
              alt="مجموعه املاک لوکس و مدرن"
              width={500}
              height={500}
              className="rounded-2xl object-cover w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm font-bold text-gray-800">
                  املاک برتر اوج
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  بهترین گزینهها برای سرمایهگذاری
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
