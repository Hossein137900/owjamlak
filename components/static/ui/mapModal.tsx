"use client";

import   { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiX } from "react-icons/fi";
import { SiGooglemaps } from "react-icons/si";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, triggerRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, triggerRef]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleMapClick = (mapType: "google" | "neshan") => {
    if (mapType === "google") {
      const googleMapsUrl = `https://maps.app.goo.gl/YDdpBqa1a1Njm7it5`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    } else if (mapType === "neshan") {
      const neshanUrl = `https://nshn.ir/df_bv_ECyxpfxV`;
      window.open(neshanUrl, "_blank", "noopener,noreferrer");
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20000000"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[320px] max-w-[400px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#01ae9b] to-[#66308d] px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">مشاهده موقعیت</h3>
                      <p className="text-sm opacity-90">انتخاب نقشه</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                    aria-label="بستن"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {/* Google Maps Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMapClick("google")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                      <SiGooglemaps className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Google Maps
                      </h4>
                      <p className="text-sm text-gray-600">مشاهده در گوگل مپ</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </motion.button>

                  {/* Neshan Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMapClick("neshan")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                      <FiMapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-gray-800 mb-1">نشان</h4>
                      <p className="text-sm text-gray-600">
                        مشاهده در نقشه نشان
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </motion.button>
                </div>

                {/* Address Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        آدرس:
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        تهران، میدان نارمک،کوچه سجاد پلاک6 واحد 1
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MapModal;
