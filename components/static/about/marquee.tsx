"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface MarqueeProps {
  images: string[];
  /**
   * Duration (in seconds) to move one full cycle (one full set -> -50%).
   * Smaller = faster. Default 20s.
   */
  speed?: number;
  pauseOnHover?: boolean;
  imageHeight?: number;
  title?: string;
  description?: string;
}

export default function InfiniteMarquee({
  images,
  speed = 20,
  pauseOnHover = true,
  imageHeight = 220,
  title = "گواهینامه‌ها و مدارک رسمی ما",
  description = "در این بخش می‌توانید بخشی از گواهینامه‌ها، مجوزها و افتخارات مجموعه ما را مشاهده کنید. برای دیدن جزئیات هر مدرک کافیست روی آن کلیک کنید.",
}: MarqueeProps) {
  const [hoverPaused, setHoverPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // unique animation name to prevent collision if multiple components on page
  const animNameRef = useRef(
    `marquee_${Math.random().toString(36).slice(2, 9)}`
  );

  useEffect(() => {
    // respect prefers-reduced-motion
    if (typeof window !== "undefined" && "matchMedia" in window) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(mq.matches);
      const handler = () => setReduceMotion(mq.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, []);

  const paused = hoverPaused || selectedIndex !== null || reduceMotion;

  // keyboard for modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft")
        setSelectedIndex((s) =>
          s === null ? null : (s - 1 + images.length) % images.length
        );
      if (e.key === "ArrowRight")
        setSelectedIndex((s) => (s === null ? null : (s + 1) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, images.length]);

  return (
    <section
      aria-label={title}
      className="relative w-full overflow-hidden py-12"
    >
      {/* inject unique keyframes for this instance */}
      <style>{`
        @keyframes ${animNameRef.current} {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* header */}
      <div className="text-center max-w-3xl mx-auto mb-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* viewport */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => pauseOnHover && setHoverPaused(true)}
        onMouseLeave={() => pauseOnHover && setHoverPaused(false)}
      >
        {/* gradient edges (optional) */}
        <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* marquee track: two copies of images */}
        {/* marquee track: چند نسخه از لیست تصاویر برای پوشش کامل */}
        <div
          style={{
            animation: `${animNameRef.current} ${speed}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
          className="flex gap-6 items-center whitespace-nowrap"
        >
          {[...images, ...images, ...images].map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i % images.length)}
              className="flex-shrink-0 rounded-2xl overflow-hidden bg-white p-1 shadow hover:shadow-lg transition"
              style={{
                height: imageHeight,
                width: Math.round(imageHeight * 0.7),
              }}
              aria-label={`باز کردن تصویر ${(i % images.length) + 1}`}
            >
              <Image
                src={src}
                alt={`certificate-${i % images.length}`}
                width={600}
                height={800}
                className="h-full w-full object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      </div>

      {/* modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <div className="absolute inset-0 bg-black/70" />
            <motion.div
              className="relative max-w-4xl w-full z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className=" rounded-2xl   overflow-hidden">
                <div className="relative">
                  <Image
                    src={images[selectedIndex]}
                    alt={`certificate-large-${selectedIndex}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto max-h-[80vh] object-contain "
                  />
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full  "
                    aria-label="بستن"
                  >
                    <FiX className="text-black" size={20} />
                  </button>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedIndex((s) =>
                            s === null
                              ? null
                              : (s - 1 + images.length) % images.length
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
                        aria-label="عکس قبلی"
                      >
                        <FiChevronLeft className="text-black" size={20} />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedIndex((s) =>
                            s === null ? null : (s + 1) % images.length
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
                        aria-label="عکس بعدی"
                      >
                        <FiChevronRight className="text-black" size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
