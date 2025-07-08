"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiMaximize,
  FiCalendar,
  FiMapPin,
  FiTrendingUp,
  FiHome,
  FiTag,
} from "react-icons/fi";
import { FaBed, FaChevronLeft, FaSitemap } from "react-icons/fa";

interface ReportageBoxProps {
  id: string;
  title: string;
  location: string;
  price: {
    totalPrice?: number;
    depositRent?: number;
    rentPrice?: number;
    pricePerMeter?: number;
  };
  features: {
    area: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt: number;
  };
  imagePath?: string; // Add this prop
  isNew?: boolean;
  isSpecialOffer?: boolean;
  isInvestment?: boolean;
  posterType?: string;
  propertyType?: string;
  tradeType?: string;
  convertible?: boolean;
  className?: string;
}

const ReportageBox: React.FC<ReportageBoxProps> = ({
  id,
  title,
  location,
  price,
  features,
  // imagePath = "/assets/images/hero.jpg", // Default image
  // isNew = false,
  // isSpecialOffer = false,
  isInvestment = false,
  propertyType = "residential",
  tradeType = "sell",
  convertible = false,
  className = "",
}) => {
  const formatPrice = (amount: number) => {
    if (amount === 0) return "توافقی";
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} میلیارد`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}  میلیون`;
    }
    return amount.toLocaleString("fa-IR");
  };

  // Helper function to get property type label in Persian
  const getPropertyTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      residential: "مسکونی",
      commercial: "تجاری",
      administrative: "اداری",
      industrial: "صنعتی",
      old: "کلنگی",
    };
    return typeLabels[type] || type;
  };

  // Helper function to get trade type label in Persian
  const getTradeTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      buy: "خرید",
      sell: "فروش",
      rent: "اجاره",
      fullRent: "اجاره کامل",
      mortgage: "رهن",
    };
    return typeLabels[type] || type;
  };

  // Check if it's a rent-type property
  const isRentType = tradeType === "rent" || tradeType === "fullRent";

  // Get the appropriate badge color based on trade type
  const getTradeTypeBadgeColor = (type: string) => {
    switch (type) {
      case "rent":
      case "fullRent":
        return "bg-blue-500/30  backdrop-blur-xl text-center border-white/30 border";
      case "sell":
        return "bg-green-500/30 backdrop-blur-xl text-center border-white/30 border";
      case "buy":
        return "bg-purple-500/30  backdrop-blur-xl text-center border-white/30 border";
      case "mortgage":
        return "bg-orange-500/30 backdrop-blur-xl text-center border-white/30 border";
      default:
        return "bg-gray-500/30 backdrop-blur-xl text-center border-white/30 border";
    }
  };

  return (
    <Link href={`/poster/${id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
      >
        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={"/assets/images/hero2.png"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* New Badge */}
       

       

            {/* Trade Type Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${getTradeTypeBadgeColor(
                tradeType
              )} text-white px-2 py-1 rounded-md text-xs font-medium`}
            >
              {getTradeTypeLabel(tradeType)}
            </motion.div>

            {/* Investment Badge */}
            {isInvestment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className=" text-white px-2 bg-orange-500/30 backdrop-blur-xl text-center border-white/30 border py-1 rounded-md text-xs font-medium flex items-center gap-1"
              >
                <FiTrendingUp size={12} />
                سرمایه‌گذاری
              </motion.div>
            )}

            {/* Convertible Badge for Rent */}
            {isRentType && convertible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-indigo-500/30 border border-white/30 text-white px-2 py-1 rounded-md text-xs font-medium"
              >
                قابل تبدیل
              </motion.div>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 right-3">
            <motion.div
              className="bg-white/60 backdrop-blur-xl rounded-xl px-4 py-3 w-fit shadow-lg border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              {isRentType ? (
                // Rent Type Pricing
                <div className="space-y-2">
                  {price.depositRent && price.depositRent > 0 && (
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#01ae9b] rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">
                          ودیعه
                        </span>
                      </div>
                      <div className="text-[#01ae9b] font-bold text-sm">
                        {formatPrice(price.depositRent)}
                        <span className="text-xs font-normal text-gray-500 mr-1">
                          تومان
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {price.rentPrice && price.rentPrice > 0 && (
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 font-medium">
                          اجاره ماهانه
                        </span>
                      </div>
                      <div className="text-blue-600 font-bold text-sm">
                        {formatPrice(price.rentPrice)}
                        <span className="text-xs font-normal text-gray-500 mr-1">
                          تومان
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {tradeType === "fullRent" && (
                    <motion.div
                      className="flex items-center justify-center mt-2 pt-2 border-t border-gray-200"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        اجاره کامل
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                // Buy/Sell Type Pricing
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#01ae9b] rounded-full"></div>
                      <span className="text-xs text-gray-600 font-medium">
                        {tradeType === "buy" ? "قیمت خرید" : "قیمت فروش"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#01ae9b] font-bold text-sm">
                        {price.totalPrice ? (
                          <>
                            {formatPrice(price.totalPrice)}
                            <span className="text-xs font-normal text-gray-500 mr-1">
                              تومان
                            </span>
                          </>
                        ) : (
                          <span className="text-orange-500 text-sm font-medium">
                            توافقی
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {price.pricePerMeter && (
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          قیمت هر متر
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs font-medium">
                        {formatPrice(price.pricePerMeter)}
                        <span className="text-xs text-gray-400 mr-2">
                          تومان/متر
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <FiMapPin size={14} />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMaximize size={16} />
              <span className="text-sm">{features.area} متر</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaBed size={16} />
              <span className="text-sm">{features.bedrooms} خواب</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaSitemap size={16} />
              <span className="text-sm">طبقه {features.bathrooms} </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar size={16} />
              <span className="text-sm">{features.yearBuilt}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiHome size={16} />
              <span className="text-sm">
                {getPropertyTypeLabel(propertyType)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiTag size={16} />
              <span className="text-sm">{getTradeTypeLabel(tradeType)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="bg-[#01ae9b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#018a7a] transition-colors duration-200 flex items-center justify-center gap-2">
              <span>مشاهده جزئیات</span>
              <FaChevronLeft className="text-xs" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ReportageBox;
