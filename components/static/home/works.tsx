"use client";
import { motion } from "framer-motion";
import BusinessApproach from "./businessApproach";
// import OurWorks from "@/components/global/ourWorks";
import Testimonials from "@/components/global/testimonials";
// import { testimonialsData, worksData } from "../../../data/data";
import Link from "next/link";
import { BiHeadphone, BiLeftArrowAlt } from "react-icons/bi";

export default function OurApproachPage() {
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const heroTitleVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const heroDescriptionVariants = {
    hidden: {
      y: 40,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const heroButtonVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.4,
        duration: 0.6,
      },
    },
  };
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#66308d]/90 to-[#01ae9b]/90 text-white relative overflow-hidden">
        {/* SVG Decorative Elements */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Top Left Key */}
          <motion.svg
            className="absolute top-8 left-8 w-16 h-16 text-white/20"
            initial={{ rotate: -45, scale: 0 }}
            animate={{
              rotate: [0, 360],
              scale: 1,
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, delay: 0.5 },
            }}
            whileHover={{ scale: 1.1 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </motion.svg>

          {/* Top Right Building */}
          <motion.svg
            className="absolute top-12 right-12 w-20 h-20 text-white/15"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: [1, 1.1, 1],
              filter: [
                "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
                "drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))",
                "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
              ],
            }}
            transition={{
              y: { duration: 1.2, delay: 0.8 },
              opacity: { duration: 1.2, delay: 0.8 },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              filter: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ y: -5 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            <path d="M3 21h18M5 21V7l8-4v18M19 21V10l-6-3" />
            <path d="M9 9v.01M9 12v.01M9 15v.01M13 9v.01M13 12v.01M13 15v.01" />
          </motion.svg>

          {/* Bottom Left Home */}
          <motion.svg
            className="absolute bottom-16 left-16 w-14 h-14"
            initial={{ scale: 0, rotate: 180 }}
            animate={{
              scale: 1,
              rotate: 0,
              color: [
                "rgba(255, 255, 255, 0.25)",
                "rgba(102, 48, 141, 0.4)",
                "rgba(1, 174, 155, 0.4)",
                "rgba(255, 255, 255, 0.25)",
              ],
            }}
            transition={{
              scale: { duration: 1, delay: 1.2 },
              rotate: { duration: 1, delay: 1.2 },
              color: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.15 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </motion.svg>

          {/* Bottom Right Key Ring */}
          <motion.svg
            className="absolute bottom-8 right-8 w-12 h-12 text-white/20"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            whileHover={{ rotate: -10 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M18.09 10.37a6 6 0 1 1-10.37 0" />
            <path d="M12 2a6 6 0 0 0-6 6c0 1 .2 1.8.57 2.5L12 16l5.43-5.5c.37-.7.57-1.5.57-2.5a6 6 0 0 0-6-6z" />
          </motion.svg>

          {/* Center Floating Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/25 rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/20 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={heroContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
              margin: "0px 0px -50px 0px",
            }}
          >
            <motion.h1
              variants={heroTitleVariants}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              خدمات حرفهای املاک با رویکردی متفاوت
            </motion.h1>

            <motion.p
              variants={heroDescriptionVariants}
              className="text-lg md:text-xl mb-8 text-white/90"
            >
              ما با تکیه بر تخصص و تجربه، خدمات جامع املاک را با بالاترین کیفیت
              ارائه میدهیم
            </motion.p>

            <motion.div variants={heroButtonVariants}>
              <motion.a
                href="/poster"
                target="_blank"
                className="bg-white text-[#66308d] px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-block"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)",
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }}
              >
                مشاهده آگهی ها
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Business Approach Section */}
      <BusinessApproach />

      {/* Our Works Section */}
      {/* <div id="our-works" className="bg-white py-16">
        <OurWorks works={worksData} />
      </div> */}

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="  ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden  bg-gradient-to-br from-[#66308d]/95 to-[#01ae9b]/95 p-10 md:p-16 shadow-xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3 blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white text-center"
              >
                آماده همکاری با شما هستیم
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/90 mb-10 max-w-2xl mx-auto text-center text-lg leading-relaxed"
              >
                برای مشاوره رایگان و بررسی نیازهای ملکی خود با ما تماس بگیرید.
                تیم متخصص ما آماده ارائه بهترین خدمات به شماست.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-5 justify-center"
              >
                <Link href="/contactUs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#66308d] cursor-pointer px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span>تماس با ما</span>
                    <BiHeadphone size={20} />
                  </motion.button>
                </Link>

                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent text-white cursor-pointer border-2 border-white/70 px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-sm"
                  >
                    <span>مشاهده خدمات</span>
                    <BiLeftArrowAlt size={20} />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 pt-8 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="flex items-center justify-center gap-3 text-white/90">
                  <i className="fas fa-medal text-2xl"></i>
                  <span>بیش از ۱۰ سال تجربه</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white/90">
                  <i className="fas fa-users text-2xl"></i>
                  <span>صدها مشتری راضی</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white/90">
                  <i className="fas fa-certificate text-2xl"></i>
                  <span>تضمین کیفیت خدمات</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
