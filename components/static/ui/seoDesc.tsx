"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

const SEODescription: React.FC = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const fullTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fullTextRef.current) {
      const fullHeight = fullTextRef.current.scrollHeight;
      const collapsedHeight = lineHeight * 3; // show 3 lines collapsed
      setContentHeight(isExpanded ? fullHeight : collapsedHeight);
      setShowToggle(fullHeight > collapsedHeight);
    }
  }, [isExpanded]);

  const lineHeight = 28; // px for leading-7

  const mainText = `املاک اوج، پیشرو در ارائه خدمات جامع مشاوره املاک با بیش از ۱۰ سال تجربه در زمینه خرید، فروش و اجاره املاک مسکونی، تجاری و اداری در سراسر کشور. ما با تیمی از کارشناسان مجرب و متخصص، بهترین گزینه‌های ملکی را متناسب با بودجه و نیازهای شما ارائه می‌دهیم.`;

  const fullText = `${mainText}

خدمات جامع املاک ما شامل ارزیابی دقیق املاک توسط کارشناسان رسمی، مشاوره حقوقی تخصصی با وکلای پایه یک دادگستری، کمک در تنظیم قراردادهای خرید و فروش، بررسی اسناد مالکیت و استعلام رسمی، راهنمایی در امور وام مسکن و تسهیلات بانکی، و پشتیبانی کامل در تمام مراحل معامله می‌باشد. با استفاده از جدیدترین تکنولوژی‌ها و روش‌های نوین بازاریابی دیجیتال، ما تضمین می‌کنیم که ملک شما در کمترین زمان ممکن و با بهترین قیمت بازار به فروش برسد یا ملک مورد نظرتان را با مناسب‌ترین شرایط پیدا کنید. تیم متخصص ما در شهرهای بزرگ کشور آماده خدمت‌رسانی به شما عزیزان است. خدمات ویژه ما شامل مشاوره رایگان، بازدید تخصصی، کمک در اخذ وام، انجام کلیه تشریفات قانونی و خدمات پس از فروش می‌باشد.`;

  if (pathname === "/admin" || pathname === "/auth") return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8" dir="rtl">
      <div className="relative bg-white text-black overflow-hidden p-4">
        {/* Invisible measuring block */}
        <div
          ref={fullTextRef}
          className="absolute invisible pointer-events-none whitespace-pre-wrap leading-7 text-base"
        >
          {fullText}
        </div>

        {/* Animated container */}
        <motion.div
          className="relative overflow-hidden"
          animate={{ height: contentHeight }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <div className="whitespace-pre-wrap text-justify leading-7 text-base text-gray-800">
            {fullText}
          </div>

          {/* gradient overlay */}
          <AnimatePresence>
            {!isExpanded && showToggle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/70 to-transparent"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toggle button */}
        {showToggle && (
          <div className="flex justify-start mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm md:text-base cursor-pointer font-medium text-teal-600 hover:text-teal-800 transition-colors"
            >
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaArrowDown className="w-3 h-3" />
              </motion.span>
              {isExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEODescription;
