"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface GalleryProps {
  images: string[];
  imageHeight?: number;
  title?: string;
  description?: string;
}

export default function CertificatesGallery({
  images,
  imageHeight = 220,
  title = "گواهینامه‌ها و مدارک رسمی ما",
  description = "در این بخش می‌توانید بخشی از گواهینامه‌ها، مجوزها و افتخارات مجموعه ما را مشاهده کنید. برای دیدن جزئیات هر مدرک کافیست روی آن کلیک کنید.",
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // keyboard navigation for modal
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
    <section aria-label={title} className="relative w-full py-12">
      {/* header */}
      <div className="text-center max-w-3xl mx-auto mb-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* horizontal scrollable row */}
      <div className="relative w-full overflow-x-auto scrollbar-hide px-4">
        <div className="flex gap-1 items-center">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="flex-shrink-0 rounded-2xl overflow-hidden bg-white p-1 shadow hover:shadow-lg transition"
              style={{
                height: imageHeight,
                width: Math.round(imageHeight * 0.7),
              }}
              aria-label={`باز کردن تصویر ${i + 1}`}
            >
              <Image
                src={src}
                alt={`certificate-${i}`}
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
              <div className="rounded-2xl overflow-hidden">
                <div className="relative">
                  <Image
                    src={images[selectedIndex]}
                    alt={`certificate-large-${selectedIndex}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full"
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
