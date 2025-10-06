"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const ContactHero = () => {
  return (
    <div className="relative h-screen  pt-20  bg-gradient-to-t from-[#01ae9b]/5 to-white">
      <div className="  mx-auto px-4 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right  "
          >
            {/* Title */}
            <h2 className="text-lg md:text-xl font-extrabold text-gray-400 leading-tight mb-4">
              <span className="text-[#01ae9b] text-3xl md:text-5xl mx-1">املاک اوج</span> منتظر شماست ...
            </h2>

            <h1 className="text-xl md:text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
              <span className="text-[#01ae9b]">تماس</span> با ما
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              ما همیشه آماده شنیدن نظرات، پیشنهادات و سوالات شما هستیم. کافیست
              با ما در تماس باشید تا بهترین تجربه مشاوره املاک را داشته باشید.
            </p>

            {/* Contact Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center sm:justify-start"
            >
              {/* Phone */}
              <a
                href="tel:02177222007"
                className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#01ae9b]/10 flex items-center justify-center text-[#01ae9b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">تماس مستقیم</div>
                  <div className="text-lg font-bold text-gray-800">
                    021-77222007
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:amlakoujj@gmail.com"
                className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#01ae9b]/10 flex items-center justify-center text-[#01ae9b]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ایمیل</div>
                  <div className="text-lg font-bold text-gray-800">
                    amlakoujj@gmail.com
                  </div>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[200px] md:h-[420px] lg:h-[500px]"
          >
            <Image
              src="/assets/images/hero.jpg"
              alt="تماس با املاک"
              fill
              className="object-cover rounded-2xl shadow-xl"
              priority
            />
          </motion.div>
        </div>
      </div>
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-20 right-30 w-24 h-24 shadow-3xl rounded-full bg-[#01ae9b]/15 z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-80 right-100 w-24 h-24 shadow-3xl rounded-full bg-[#01ae9b]/5 z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-16 left-10 w-40 h-40 rounded-full bg-[#01ae9b]/20 z-0"
      />
    </div>
  );
};

export default ContactHero;
