"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function InvestmentBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 py-20 px-6 md:px-20">
      <div className="  mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="relative overflow-hidden rounded-3xl shadow-2xl"
              >
                <Image
                  src="/assets/images/hero4.jpg"
                  alt="Investment"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px] group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-xl"
              >
                <div className="text-2xl font-bold text-[#01ae9b]">+25%</div>
                <div className="text-xs text-gray-600">بازدهی سالانه</div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 bg-[#01ae9b]/80 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl"
              >
                <div className="text-lg font-bold">1000+</div>
                <div className="text-xs opacity-90">پروژه موفق</div>
              </motion.div>
            </div>
          </motion.div>
          {/* Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
            dir="rtl"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 bg-[#01ae9b]/10 text-[#01ae9b] px-4 py-2 rounded-full text-sm font-medium"
              >
                <span className="w-2 h-2 bg-[#01ae9b] rounded-full animate-pulse"></span>
                فرصت های ویژه سرمایه گذاری
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                سرمایه گذاری
                <span className="block text-[#01ae9b] relative">
                  هوشمندانه
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#01ae9b] to-transparent"
                  />
                </span>
              </h2>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">
              با تیم متخصص املاک اوج، در پروژه های پربازده و آینده دار سرمایه
              گذاری کنید و از بازدهی مطمئن برخوردار شوید.
            </p>

            <div className="flex  flex-row gap-4">
              <Link href="/offers">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer  relative px-8 py-4 bg-[#01ae9b] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">مشاهده فرصت ها</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#01ae9b] to-[#019b8a]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              <Link href="/contactUs">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="px-8 py-4 cursor-pointer  border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-[#01ae9b] hover:text-[#01ae9b] transition-all duration-300"
                >
                  مشاوره رایگان
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#01ae9b]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#01ae9b]/3 rounded-full blur-3xl" />
    </section>
  );
}
