"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
} from "react-icons/fa";
import React from "react";

interface GalleryModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectImage: (index: number) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSelectImage,
}) => {
  // For swipe/drag functionality
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onNext();
      if (e.key === "ArrowRight") onPrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex flex-col justify-center items-center"
    >
      {/* Header with close button and counter */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
        <div className="text-white text-sm md:text-base font-medium">
          {currentIndex + 1} / {images.length}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <FaTimes size={20} />
        </motion.button>
      </div>

      {/* Main image with swipe functionality */}
      <div className="relative w-full h-[70vh] mt-20 overflow-hidden">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            initial={{ opacity: 0, x: 300 * (currentIndex > 0 ? 1 : -1) }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 * (currentIndex > 0 ? 1 : -1) }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                onNext();
              } else if (swipe > swipeConfidenceThreshold) {
                onPrev();
              }
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`تصویر ${currentIndex + 1}`}
              fill
              className="object-contain select-none"
              sizes="100vw"
              priority
              draggable="false"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay instructions for mobile */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 md:hidden">
          <div className="bg-black/30 text-white text-xs p-2 rounded-full opacity-70">
            ← بکشید
          </div>
          <div className="bg-black/30 text-white text-xs p-2 rounded-full opacity-70">
            بکشید →
          </div>
        </div>

        {/* Navigation buttons (visible on desktop/tablet) */}
        <motion.button
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors hidden md:block"
          onClick={onPrev}
        >
          <FaChevronLeft size={24} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors hidden md:block"
          onClick={onNext}
        >
          <FaChevronRight size={24} />
        </motion.button>
      </div>

      {/* Thumbnails with active indicator and smooth scrolling */}
      <div className="w-full bg-black/70 py-3 mt-auto">
        <div className="w-full max-w-5xl mx-auto overflow-x-auto hide-scrollbar px-4">
          <div className="flex gap-2 py-2">
            {images.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  currentIndex === index
                    ? "ring-2 ring-green-500 ring-offset-2 ring-offset-black"
                    : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => onSelectImage(index)}
              >
                <Image
                  src={img}
                  alt={`تصویر ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                  sizes="80px"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-20 right-4 bg-black/50 text-white p-2 rounded-full"
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
              console.log(
                `Error attempting to enable fullscreen: ${err.message}`
              );
            });
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
        }}
      >
        <FaExpand size={18} />
      </motion.button>
    </motion.div>
  );
};

export default GalleryModal;
