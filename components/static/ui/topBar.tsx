"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMapPin } from "react-icons/fi";
import {
  RiTelegramLine,
  RiWhatsappLine,
  RiInstagramLine,
} from "react-icons/ri";
import MapModal from "../ui/mapModal";
import Link from "next/link";

interface TopBarProps {
  scrolled: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ scrolled }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const mapButtonRef = useRef<HTMLButtonElement>(null);

  const handleMapClick = () => {
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: scrolled ? -40 : 0, opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#01ae9b] text-white py-3 md:py-2 text-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <Link href="tel:021-88776655">021-88776655</Link>{" "}
              </div>
              <button
                ref={mapButtonRef}
                onClick={handleMapClick}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                aria-label="نشان"
              >
                <FiMapPin className="w-4 h-4" />
                <span>تهران، میدان نارمک، پلاک 123</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs">
                ساعات کاری: شنبه تا پنج‌شنبه 9:00 - 20:00
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2">
                <Link
                  href="https://t.me/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="تلگرام"
                >
                  <RiTelegramLine className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link
                  href="https://wa.me/989123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="واتساپ"
                >
                  <RiWhatsappLine className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link
                  href="https://instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="اینستاگرام"
                >
                  <RiInstagramLine className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-center ">
            {/* First Row - Phone and Address */}
            <div className="flex items-center gap-2 justify-between text-[8px]">
              <div className="flex items-center gap-2">
                <FiPhone className="w-3 h-3" />
                <Link href="tel:021-88776655">021-88776655</Link>
              </div>
            </div>
            <span className="mx-2">|</span>

            {/* Second Row - Working Hours and Social Media */}
            <div className="flex items-center justify-between">
              <div className="text-center text-[10px] opacity-90 ">
                ساعات کاری: شنبه تا پنج‌شنبه 9:00 - 20:00
              </div>
              <span className="mx-2">|</span>

              {/* Social Media Icons for Mobile */}
              <div className="flex items-center gap-1">
                <button
                  ref={mapButtonRef}
                  onClick={handleMapClick}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                  aria-label="نشان"
                  rel="noopener noreferrer"
                >
                  <FiMapPin className="w-3 h-3" />
                </button>
                <Link
                  href="https://t.me/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                  aria-label="تلگرام"
                >
                  <RiTelegramLine className="w-3 h-3" />
                </Link>
                <Link
                  href="https://wa.me/989123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                  aria-label="واتساپ"
                >
                  <RiWhatsappLine className="w-3 h-3" />
                </Link>
                <Link
                  href="https://instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                  aria-label="اینستاگرام"
                >
                  <RiInstagramLine className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Tablet Layout */}
          <div className="hidden sm:flex md:hidden justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <Link href="tel:021-88776655">021-88776655</Link>{" "}
              </div>
              <button
                onClick={handleMapClick}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
                aria-label="نشان"
              >
                <FiMapPin className="w-4 h-4" />
                <span className="text-sm">تهران، ولیعصر</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs">9:00 - 20:00</div>

              {/* Social Media Icons for Tablet */}
              <div className="flex items-center gap-1">
                <Link
                  href="https://t.me/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="تلگرام"
                >
                  <RiTelegramLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link
                  href="https://wa.me/989123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="واتساپ"
                >
                  <RiWhatsappLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link
                  href="https://instagram.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                  aria-label="اینستاگرام"
                >
                  <RiInstagramLine className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Modal */}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={closeMapModal}
        triggerRef={mapButtonRef as React.RefObject<HTMLElement>}
      />
    </>
  );
};

export default TopBar;
