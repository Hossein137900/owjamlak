"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const ContactHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-t from-[#01ae9b]/10 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-right"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              <span className="text-[#01ae9b]">تماس</span> با ما
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              ما همیشه آماده شنیدن نظرات، پیشنهادات و سوالات شما هستیم. با ما در
              تماس باشید.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-4 justify-end"
            >
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#01ae9b]/10 flex items-center justify-center text-[#01ae9b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">تماس مستقیم</div>
                  <div className="text-sm font-bold">۰۲۱-۱۲۳۴۵۶۷۸</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#01ae9b]/10 flex items-center justify-center text-[#01ae9b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ایمیل</div>
                  <div className="text-sm font-bold">info@amalak.com</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[300px] md:h-[400px]"
          >
            <Image
              src="/assets/images/hero.jpg"
              alt="تماس با املاک"
              width={4000}
              height={4000}
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-20 right-10 w-20 h-20 rounded-full bg-[#01ae9b]/10 z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-[#01ae9b]/10 z-0"
      />
    </div>
  );
};

export default ContactHero;
