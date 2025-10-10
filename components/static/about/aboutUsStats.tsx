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
        <h2 className="text-2xl md:text-4xl font-medium text-gray-700 leading-tight">
          آینده‌ی سرمایه‌گذاری شما، امروز در{" "}
          <span className="bg-gradient-to-r from-[#01ae9b] to-purple-600 bg-clip-text text-transparent text-4xl md:text-5xl font-extrabold">
            املاک اوج
          </span>{" "}
          رقم میخورد
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
          در اوج، ما بیش از یک مشاور املاک هستیم. ما شریک شما در مسیر یافتن
          بهترین فرصت های سرمایه گذاری و خانه هایی هستیم که واقعاً شایسته شماست.
          با تجربه های بیش از ۱۰ سال و تیمی از متخصصان حرفه ای، هر روز به هزاران
          نفر کمک میکنیم تا رویای خانه دار شدن را محقق کنند.
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

        <Link href="/contactUs" className="mt-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r cursor-pointer from-[#01ae9b] to-teal-600 text-white px-10 py-4 rounded-full font-bold transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center gap-3 justify-center"
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
          <div className="relative rounded-2xl overflow-hidden shadow-xl transform group-hover:shadow-3xl transition-transform duration-500">
            <Image
              src="/assets/images/about3.webp"
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
                  بهترین گزینه ها برای سرمایه گذاری
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
