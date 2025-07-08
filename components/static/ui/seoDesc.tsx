"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const SEODescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const mainDescription =
    "املاک اوج، پیشرو در ارائه خدمات جامع مشاوره املاک با بیش از ۱۰ سال تجربه در زمینه خرید، فروش و اجاره املاک مسکونی، تجاری و اداری در سراسر کشور. ما با تیمی از کارشناسان مجرب و متخصص، بهترین گزینه‌های ملکی را متناسب با بودجه و نیازهای شما ارائه می‌دهیم.";

  const expandedDescription =
    "خدمات جامع املاک ما شامل ارزیابی دقیق املاک توسط کارشناسان رسمی، مشاوره حقوقی تخصصی با وکلای پایه یک دادگستری، کمک در تنظیم قراردادهای خرید و فروش، بررسی اسناد مالکیت و استعلام رسمی، راهنمایی در امور وام مسکن و تسهیلات بانکی، و پشتیبانی کامل در تمام مراحل معامله می‌باشد. با استفاده از جدیدترین تکنولوژی‌ها، سیستم‌های هوشمند قیمت‌گذاری، و روش‌های نوین بازاریابی دیجیتال، ما تضمین می‌کنیم که ملک شما در کمترین زمان ممکن و با بهترین قیمت بازار به فروش برسد یا ملک مورد نظرتان را با مناسب‌ترین شرایط پیدا کنید. تیم متخصص ما در شهرهای بزرگ کشور شامل تهران، مشهد، اصفهان، شیراز، تبریز، کرج، اهواز، قم، کرمان و تبریز آماده خدمت‌رسانی به شما عزیزان است. ما همچنین خدمات تخصصی در زمینه خرید و فروش انواع املاک شامل آپارتمان‌های لوکس و اقتصادی، ویلاهای شهری و ساحلی، زمین‌های مسکونی و تجاری، مغازه و واحدهای تجاری، دفاتر کار و مجتمع‌های اداری، انبارها و کارخانه‌های صنعتی، باغ و باغچه، و پروژه‌های نیمه‌کاره را ارائه می‌دهیم. کارشناسان مجرب ما در زمینه‌های مختلف از جمله ارزیابی املاک با استفاده از روش‌های علمی، مشاوره سرمایه‌گذاری و تحلیل بازدهی، تحلیل عمیق بازار املاک و پیش‌بینی قیمت‌ها، مشاوره تخصصی وام مسکن و تسهیلات بانکی، بررسی دقیق قراردادها و مسائل حقوقی، مدیریت املاک و خدمات پس از فروش، و مشاوره در امور مالیاتی فعالیت می‌کنند. با افتخار به بیش از ۱۰۰۰۰ معامله موفق، رضایت ۹۹ درصدی مشتریان، و دریافت گواهینامه‌های معتبر از اتحادیه مشاوران املاک، ما به عنوان یکی از معتبرترین و پیشروترین مشاوران املاک در سراسر کشور شناخته می‌شویم. خدمات ویژه ما شامل مشاوره کاملاً رایگان در مرحله اول، بازدید تخصصی همراه با کارشناس، ارزیابی دقیق و علمی قیمت ملک، کمک در اخذ وام بانکی با بهترین شرایط، انجام کلیه تشریفات قانونی و اداری، پیگیری مراحل انتقال سند، و خدمات پس از فروش تا تحویل نهایی ملک است. همچنین امکانات مدرن شامل مشاوره آنلاین از طریق ویدیو کال، تور مجازی و بازدید ۳۶۰ درجه از املاک، سیستم هوشمند جستجو و فیلتر پیشرفته، اپلیکیشن موبایل اختصاصی، و خدمات ۲۴ ساعته در تمام روزهای هفته برای مشتریان عزیز فراهم شده است.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 py-8"
      dir="rtl"
    >
      <div className="relative">
        {/* Main Description - Always Visible */}
        <motion.p
          className="text-gray-700 leading-relaxed text-base md:text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {mainDescription}
        </motion.p>

        {/* Expandable Content */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
                marginTop: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
                marginTop: 16,
              }}
              exit={{
                height: 0,
                opacity: 0,
                marginTop: 0,
              }}
              transition={{
                duration: 0.4,
                ease: [0.04, 0.62, 0.23, 0.98],
              }}
              className="overflow-hidden"
            >
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="text-gray-600 leading-relaxed text-base md:text-lg"
              >
                {expandedDescription}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.button
            onClick={toggleExpanded}
            className="group flex items-center gap-2 px-6 py-3 text-[#01ae9b] font-medium text-sm md:text-base hover:text-[#018a7a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/20 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="relative">
              {isExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#01ae9b] origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              />
            </span>

            <motion.div
              animate={{
                rotate: isExpanded ? 180 : 0,
                scale: isExpanded ? 1.1 : 1,
              }}
              transition={{
                duration: 0.3,
                ease: [0.04, 0.62, 0.23, 0.98],
              }}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-[#01ae9b]/10 group-hover:bg-[#01ae9b]/20 transition-colors duration-200"
            >
              <FiChevronDown size={14} className="text-[#01ae9b]" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-[#01ae9b]/5 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-[#01ae9b]/5 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "املاک ایران",
            description: mainDescription + " " + expandedDescription,
            url: "https://yourwebsite.com",
            areaServed: ["تهران", "کرج"],
            serviceType: [
              "خرید املاک",
              "فروش املاک",
              "اجاره املاک",
              "مشاوره املاک",
              "ارزیابی املاک",
            ],
            foundingDate: "2014",
            yearsInOperation: 10,
          }),
        }}
      />
    </motion.div>
  );
};

export default SEODescription;
