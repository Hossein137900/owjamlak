"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaChevronDown,
  FaKey,
  FaHammer,
} from "react-icons/fa";

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

export default function SearchBar({
  className = "",
  compact = true,
}: SearchBarProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(compact);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLocationMenu(false);
        setSelectedDistrict(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const expandVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
        opacity: { duration: 0.3 },
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: 16,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  const buttonVariants = {
    collapsed: {
      y: -8,
      scale: 0.9,
    },
    expanded: {
      y: 8,
      scale: 1,
    },
  };

  const iconVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
  };

  const filterOptions = [
    { id: "residentialSale", icon: FaHome, label: "فروش مسکونی" },
    { id: "residentialRent", icon: FaKey, label: "اجاره مسکونی" },
    { id: "commercialSale", icon: FaBuilding, label: "فروش تجاری" },
    { id: "commercialRent", icon: FaWarehouse, label: "اجاره تجاری" },
    { id: "shortTermRent", icon: FaKey, label: " کوتاه مدت" },
    { id: "ConstructionProject", icon: FaHammer, label: "پروژه ساخت" },
  ];

  const locationData: { [key: string]: string[] } = {
    "منطقه 15": [
      "افسریه",
      "مسعودیه",
      "کیان‌شهر",
      "مشیریه",
      "بیسیم",
      "مینابی",
      "شهید بروجردی",
      "خاورشهر",
      "اتابک",
      "ابوذر پل چهارم تا ششم",
      "هاشم‌آباد",
      "طیب",
      "زمزم",
      "آهنگ",
    ],
    "منطقه 14": [
      "چهارصد دستگاه",
      "آهنگ شرقی",
      "نبی‌اکرم",
      "دولاب",
      "پرستار",
      "تاکسیرانی",
      "پیروزی",
      "ابوذر پل اول تا سوم",
      "شهید محلاتی",
      "پاسدار گمنام",
      "سرآسیاب",
    ],

    "منطقه 13": [
      "تهران نو",
      "نیروی هوایی",
      "اشراقی",
      "سی متری نیروی هوایی",
      "حافظیه",
      "امامت",
      "دماوند",
      "قاسم آباد",
    ],

    "منطقه 8": [
      "نارمک",
      "نارمک جنوبی",
      "مجیدیه جنوبی",
      "مدائن",
      "فدک",
      "دردشت",
      "هفت‌حوض",
      "گلبرگ",
      "لشگر",
      "ثانی",
      "تسلیحات",
    ],

    "منطقه 4": [
      "تهرانپارس شرقی",
      "تهرانپارس غربی",
      "حکیمیه",
      "قنات کوثر",
      "شمیران‌نو",
      "مجیدیه شمالی",
      "لویزان",
      "هروی",
      "شیان",
      "مبارک‌آباد",
      "خاک‌سفید",
      "اوقاف",
      "فرجام",
      "نارمک شمالی",
      "علم و صنعت",
    ],
    "منطقه 3": [
      "قلهک",
      "دروس",
      "زرگنده",
      "ونک",
      "آرارت",
      "اختیاریه",
      "دیباجی",
      "جردن",
      "داوودیه",
      "کاووسیه",
      "سیدخندان",
      "میرداماد",
      "پاسداران",
      "جلفا",
    ],
    "منطقه 7": [
      "نظام آباد",
      "سبلان",
      "بهشتی",
      "اجاره دار",
      "ارامنه",
      "گرگان",
      "خواجه نصیر",
      "خواجه نظام",
      "سهروردی",
      "شارق شرقی",
      "مرودشت",
      "هفت تیر",
      "سیدخندان",
      "مفتح جنوبی",
      "دروازه دولت",
    ],
    "منطقه 12": [
      " بازار",
      "شوش",
      "پامنار",
      " بهارستان",
      "سنگ لج",
      "دروازه شمیران",
      "خیابان ایران",
      "آبشار",
      "کوثر",
      "قیام",
      "امین حضور",
      "امام حسین",
      "صفا",
    ],
  };

  // ✅ تابع جستجو
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedNeighborhood) {
      params.append("query", selectedNeighborhood);
    }

    if (activeFilter) {
      params.append("parentType", activeFilter);
    }

    router.push(`/poster?${params.toString()}`);
  };

  return (
    <motion.div
      className={`bg-white/10 mb-3 backdrop-blur-[2px] mt-2 md:mt-0 rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 relative ${className}`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col justify-center items-center">
        {/* Main search input - Always visible */}
        <div className="flex items-center justify-between w-full relative">
          <div className="flex items-center flex-1 rounded-xl mb-6 overflow-hidden border-2 border-[#A14BE0] bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaMapMarkerAlt className="text-[#A14BE0] text-lg sm:text-xl ml-3 sm:ml-4 mr-2 sm:mr-3" />
            <input
              type="text"
              placeholder="محله یا منطقه مورد نظر را وارد کنید"
              value={selectedNeighborhood}
              onClick={() => setShowLocationMenu((prev) => !prev)}
              readOnly
              className="flex-1 py-3 sm:py-4 text-gray-600 px-2 text-right bg-transparent outline-none text-sm sm:text-base placeholder:text-gray-400"
            />
            {showLocationMenu && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-20 right-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto mt-2"
              >
                {!selectedDistrict ? (
                  Object.keys(locationData).map((district) => (
                    <button
                      key={district}
                      onClick={() => setSelectedDistrict(district)}
                      className="w-full text-right text-black px-4 py-3 hover:bg-gray-100 transition text-sm sm:text-base"
                    >
                      {district}
                    </button>
                  ))
                ) : (
                  <>
                    {locationData[selectedDistrict].map((neighborhood) => (
                      <button
                        key={neighborhood}
                        onClick={() => {
                          setSelectedNeighborhood(neighborhood);
                          setShowLocationMenu(false);
                          setSelectedDistrict(null);
                        }}
                        className="w-full text-right text-black px-4 py-3 hover:bg-gray-100 transition text-sm sm:text-base"
                      >
                        {neighborhood}
                      </button>
                    ))}
                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => setSelectedDistrict(null)}
                        className="w-full text-right px-4 py-3 text-[#A14BE0] hover:bg-gray-100 transition text-sm sm:text-base"
                      >
                        ← بازگشت به لیست مناطق
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Quick search button for compact mode */}
            {compact && (
              <motion.button
                className="text-gray-400  h-full px-4 sm:px-6 flex items-center justify-center  transition-all duration-300"
                onClick={handleSearch}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#8B3BC7",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch className="text-sm sm:text-base" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Toggle expand/collapse button for compact mode */}
        {compact && (
          <motion.button
            className="absolute -bottom-5 left-1/2 transform bg-[#A14BE0] -translate-x-1/2  text-white p-3 sm:p-4 rounded-full z-10 transition-all duration-300"
            onClick={() => setExpanded(!expanded)}
            variants={buttonVariants}
            animate={expanded ? "expanded" : "collapsed"}
            whileTap={{ scale: 0.9 }}
            aria-label={
              expanded ? "بستن گزینه‌های جستجو" : "باز کردن گزینه‌های جستجو"
            }
          >
            <motion.div
              variants={iconVariants}
              animate={expanded ? "expanded" : "collapsed"}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FaChevronDown className="text-sm sm:text-base" />
            </motion.div>
          </motion.button>
        )}

        {/* Expandable section */}
        <motion.div
          className="w-full"
          initial={compact ? "collapsed" : "expanded"}
          animate={expanded ? "expanded" : "collapsed"}
          variants={expandVariants}
        >
          <div className="">
            {/* Filter Options */}
            <motion.div
              className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: expanded ? 1 : 0,
                y: expanded ? 0 : 20,
              }}
              transition={{
                duration: 0.4,
                delay: expanded ? 0.2 : 0,
                ease: "easeOut",
              }}
            >
              {filterOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  className={`flex flex-col items-center justify-center w-full p-2  rounded-xl transition-all duration-300 ${
                    activeFilter === option.id
                      ? "md:bg-[#A14BE0]  bg-[#A14BE0] border text-white shadow-lg transform scale-105"
                      : "md:bg-white/5 text-[#fff] md:text-black border  border-white/20 hover:bg-whote/50 hover:shadow-md hover:scale-102"
                  }`}
                  onClick={() =>
                    setActiveFilter(
                      option.id === activeFilter ? null : option.id
                    )
                  }
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: expanded ? 1 : 0,
                    y: expanded ? 0 : 30,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: expanded ? 0.3 + index * 0.1 : 0,
                    ease: "easeOut",
                  }}
                >
                  <option.icon className="text-sm sm:text-base mb-2 sm:mb-3" />
                  <span className="text-sm sm:text-sm font-medium">
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: expanded ? 1 : 0,
                y: expanded ? 0 : 20,
              }}
              transition={{
                duration: 0.4,
                delay: expanded ? 0.5 : 0,
                ease: "easeOut",
              }}
            >
              {/* Main search button for expanded state */}
              {(!compact || expanded) && (
                <motion.button
                  className="flex-1 bg-gradient-to-r from-[#00BC9B] to-[#00a589] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold flex items-center justify-center hover:from-[#00a589] hover:to-[#008f7a] transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={handleSearch}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSearch className="ml-2 sm:ml-3 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">جستجو</span>
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background overlay for better visual separation when expanded */}
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-2xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
