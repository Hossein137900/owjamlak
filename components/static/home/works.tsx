"use client";
import { motion } from "framer-motion";
import React from "react";
import BusinessApproach from "./businessApproach";
import OurWorks from "@/components/global/ourWorks";
import Testimonials from "@/components/global/testimonials";
import { testimonialsData, worksData } from "../../../data/data";
import Link from "next/link";
import { BiHeadphone, BiLeftArrowAlt } from "react-icons/bi";

export default function OurApproachPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#66308d]/90 to-[#01ae9b]/90 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              خدمات حرفه‌ای املاک با رویکردی متفاوت
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl mb-8 text-white/90"
            >
              ما با تکیه بر تخصص و تجربه، خدمات جامع املاک را با بالاترین کیفیت
              ارائه می‌دهیم
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a
                href="#our-works"
                className="bg-white text-[#66308d] px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-block"
              >
                مشاهده نمونه کارها
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Business Approach Section */}
      <BusinessApproach />

      {/* Our Works Section */}
      <div id="our-works" className="bg-white py-16">
        <OurWorks works={worksData} />
      </div>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonialsData} />

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#66308d]/95 to-[#01ae9b]/95 p-10 md:p-16 shadow-xl"
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
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#66308d] px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span>تماس با ما</span>
                    <BiHeadphone size={20} />
                  </motion.button>
                </Link>

                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent text-white border-2 border-white/70 px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-sm"
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
