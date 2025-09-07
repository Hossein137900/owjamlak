"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiBookOpen } from "react-icons/fi";
import Image from "next/image";

interface PdfDownloadProps {
  bookImage: string;
  pdfUrl: string;
  title: string;
  description?: string;
}

export default function PdfDownload({
  bookImage,
  pdfUrl,
  title,
  description = "با این کتاب، قدرت داستان‌سرایی را کشف کنید و مهارت‌های خود را به سطحی جدید ببرید!",
}: PdfDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // پاراگراف خلاصه‌شده برای پیش‌نمایش
  const teaserText =
    "برای استفاده از قدرت داستان‌سرایی، باید ماهیت منحصر به فرد این هنر را درک کنید. این کتاب شما را با ابزارهای عملی برای خلق داستان‌های تأثیرگذار آماده می‌کند...";

  // انیمیشن‌ها
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="w-full min-h-[600px] bg-gradient-to-br from-[#f5f7fa] to-[#e2e8f0] py-12 px-4 md:px-8 lg:px-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* بخش متن (سمت چپ) */}
        <div className="lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <FiBookOpen size={32} className="text-[#01ae9b]" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">{description}</p>

          {/* پیش‌نمایش پاراگراف */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiBookOpen size={20} className="text-[#01ae9b]" />
              گزیده‌ای از کتاب
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              {teaserText}
            </p>
            <p className="text-[#01ae9b] text-base font-medium">
              برای خواندن ادامه، کتاب را رایگان دانلود کنید!
            </p>
          </div>

          {/* دکمه دانلود */}
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full lg:w-auto bg-gradient-to-r from-[#01ae9b] to-[#66308d] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال دانلود...
              </>
            ) : (
              <>
                <FiDownload size={24} />
                دانلود رایگان کتاب
              </>
            )}
          </motion.button>
        </div>

        {/* تصویر کتاب (سمت راست) */}
        <motion.div
          className="lg:w-1/2 relative"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-full max-w-3xl mx-auto lg:mx-0 h-[200px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl  ">
            <Image
              src={bookImage}
              alt={title}
              width={4000}
              height={4000}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
