"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
} from "react-icons/fa";
import { useEffect } from "react";

interface GalleryModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectImage: (index: number) => void;
  title: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSelectImage,
  title,
}) => {
  // For swipe/drag functionality

  // Handle keyboard navigation (RTL corrected)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev(); // RTL: Left arrow goes to previous
      if (e.key === "ArrowRight") onNext(); // RTL: Right arrow goes to next
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
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-500 flex flex-col justify-center items-center"
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
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center touch-pan-x"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing" }}
          onDragEnd={(e, { offset, velocity }) => {
            const dragThreshold = 100;
            const velocityThreshold = 500;

            // Simple and reliable swipe detection
            if (
              Math.abs(offset.x) > dragThreshold ||
              Math.abs(velocity.x) > velocityThreshold
            ) {
              if (offset.x > 0 || velocity.x > 0) {
                onPrev(); // Swipe right = previous (RTL)
              } else {
                onNext(); // Swipe left = next (RTL)
              }
            }
          }}
        >
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Image
              src={images[currentIndex]}
              alt={`تصویر ${title}`}
              fill
              className="object-contain select-none"
              sizes="100vw"
              priority
              draggable={false}
            />
          </div>
        </motion.div>

        {/* Navigation buttons (visible on desktop/tablet) - RTL corrected */}
        <motion.button
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors hidden md:block"
          onClick={onNext}
        >
          <FaChevronLeft size={24} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors hidden md:block"
          onClick={onPrev}
        >
          <FaChevronRight size={24} />
        </motion.button>
      </div>

      {/* Thumbnails with active indicator and smooth scrolling */}
      <div className="w-full  bg-black/70 py-3 mt-auto">
        <div className="w-full max-w-5xl mx-auto overflow-x-auto hide-scrollbar px-4">
          <div className="flex gap-2 py-2" dir="rtl">
            {images.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  currentIndex === index
                    ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black shadow-lg"
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
                {currentIndex === index && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-md" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-40 lg:bottom-43 right-4 bg-black/50 text-white p-2 rounded-full"
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
