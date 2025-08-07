"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaPhone, FaStar } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineBriefcase } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import { MdRealEstateAgent } from "react-icons/md";
import { Consultant } from "@/types/type";

interface ConsultantCardProps {
  consultant: Consultant;
  index?: number;
  showActions?: boolean;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({
  consultant,
  index = 0,
  showActions = true,
}) => {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `https://wa.me/98${consultant.whatsapp.substring(1)}`,
      "_blank"
    );
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`tel:${consultant.phone}`, "_self");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <Link href={`/consultant/${consultant._id}`} target="_blank" className="block">
        {/* Consultant Image */}
        <div className="relative h-48">
          <Image
            src={consultant.image || "/assets/images/default-consultant.jpg"}
            alt={consultant.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {consultant.rating && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
              <FaStar className="text-xs" />
              <span>{consultant.rating}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Consultant Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800  hover:text-[#01ae9b] transition-colors">
            {consultant.name}
          </h3>

          {consultant.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {consultant.description}
            </p>
          )}

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <BiTime className="text-[#01ae9b] flex-shrink-0" />
              <span className="font-medium">
                {consultant.experienceYears} سال تجربه
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <MdRealEstateAgent className="text-[#01ae9b] flex-shrink-0" />
              <span className="font-medium">{consultant.posterCount} آگهی</span>
            </div>
          </div> */}

          {/* Work Areas */}
          {/* <div className="mb-4 ">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineLocationMarker className="text-[#01ae9b] text-sm" />
              <span className="text-sm font-medium text-gray-700">
                مناطق فعالیت:
              </span>
            </div>
            <div className="flex flex-row gap-1">
              {consultant.workAreas.slice(0, 3).map((area, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200"
                >
                  {area}
                </span>
              ))}
              {consultant.workAreas.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                  +{consultant.workAreas.length - 3} منطقه
                </span>
              )}
            </div>
          </div> */}

          {/* Specialties */}
          {/* {consultant.specialties && consultant.specialties.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineBriefcase className="text-[#01ae9b] text-sm" />
                <span className="text-sm font-medium text-gray-700">
                  تخصص‌ها:
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {consultant.specialties.slice(0, 2).map((specialty, idx) => (
                  <span
                    key={idx}
                    className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium border border-green-200"
                  >
                    {specialty}
                  </span>
                ))}
                {consultant.specialties.length > 2 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                    +{consultant.specialties.length - 2}
                  </span>
                )}
              </div>
            </div>
          )} */}
        </div>
      </Link>

      {/* Contact Buttons */}
      {showActions && (
        <div className="px-6 pb-6">
          <div className="flex gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex-1 text-sm font-medium"
            >
              <FaWhatsapp />
              <span>واتساپ</span>
            </button>

            <button
              onClick={handlePhoneClick}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex-1 text-sm font-medium"
            >
              <FaPhone />
              <span>تماس</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ConsultantCard;
