"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX } from "react-icons/fi";

interface CertificateMarqueeProps {
  images: string[]; // آرایه URL تصاویر گواهینامه‌ها
  speed?: number; // سرعت حرکت (پیکسل در ثانیه)
  direction?: "left" | "right"; // جهت حرکت (پیش‌فرض: left)
  pauseOnHover?: boolean; // متوقف کردن روی هاور (پیش‌فرض: true)
}

export default function CertificateMarquee({
  images,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
}: CertificateMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // محاسبه عرض لیست تصاویر برای لووپ
  useEffect(() => {
    if (marqueeRef.current) {
      setWidth(marqueeRef.current.scrollWidth / 2);
    }
  }, [images]);

  // انیمیشن لووپ بی‌نهایت
  const marqueeVariants = {
    animate: {
      x: direction === "left" ? [0, -width] : [-width, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: width / speed,
          ease: "linear",
        },
      },
    },
    paused: { x: direction === "left" ? 0 : -width },
  };

  // انیمیشن‌های هدر
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // باز کردن مودال
  const openModal = (img: string) => {
    setSelectedImage(img);
    setIsPaused(true);
  };

  // بستن مودال
  const closeModal = () => {
    setSelectedImage(null);
    setIsPaused(false);
  };

  return (
    <div className="w-full py-12 bg-gradient-to-br from-[#f5f7fa] to-[#e2e8f0] relative overflow-hidden">
      {/* هدر با تایتل و دیسکریپشن */}
      <motion.div
        className="max-w-7xl mx-auto mb-8 text-center flex flex-col items-center px-4"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            گواهینامه‌ها و افتخارات اوج املاک
          </h2>
        </div>
        <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          ما در اوج املاک به حرفه‌ای بودن و اعتماد شما افتخار می‌کنیم.
          گواهینامه‌های ما نشان‌دهنده تعهد ما به ارائه خدمات باکیفیت در حوزه
          املاک است. برای مشاهده جزئیات، روی هر گواهینامه کلیک کنید!
        </p>
      </motion.div>

      {/* مارکی تصاویر */}
      <div
        className="w-full overflow-hidden relative"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        onTouchStart={() => pauseOnHover && setIsPaused(true)}
        onTouchEnd={() => pauseOnHover && setIsPaused(false)}
      >
        <motion.div
          className="flex whitespace-nowrap"
          variants={marqueeVariants}
          animate={isPaused ? "paused" : "animate"}
          ref={marqueeRef}
        >
          {/* لیست اول */}
          {images.map((img, index) => (
            <motion.div
              key={`first-${index}`}
              className="inline-block mx-4 cursor-pointer transform transition-all duration-300  hover:shadow-2xl"
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal(img)}
            >
              <Image
                src={img}
                alt={`گواهینامه ${index + 1}`}
                width={1000}
                height={1000}
                className="object-contain rounded-xl shadow-lg border border-gray-300 max-h-48"
              />
            </motion.div>
          ))}
          {/* لیست دوم برای لووپ */}
          {images.map((img, index) => (
            <motion.div
              key={`second-${index}`}
              className="inline-block mx-4 cursor-pointer transform transition-all duration-300  hover:shadow-2xl"
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal(img)}
            >
              <Image
                src={img}
                alt={`گواهینامه ${index + 1}`}
                width={1000}
                height={1000}
                className="object-contain rounded-xl shadow-lg border border-gray-300 max-h-48"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* مودال بزرگ‌نمایی تصویر */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className="relative w-11/12 h-11/12 md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-4/5"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={selectedImage}
                alt="گواهینامه بزرگ‌شده"
                fill
                className="object-contain rounded-2xl shadow-2xl"
              />
              <motion.button
                className="absolute top-4 right-4 bg-white/90 text-black p-3 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300"
                onClick={closeModal}
                aria-label="بستن مودال"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={28} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
