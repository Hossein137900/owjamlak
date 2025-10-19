"use client";
import { useEffect, useRef, useState } from "react";
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
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes menuSlideIn {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .search-bar-container {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .location-menu {
          animation: menuSlideIn 0.3s ease-out forwards;
        }

        .expandable-section {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          margin-top: 0;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s ease-out, margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .expandable-section.expanded {
          max-height: 1000px;
          opacity: 1;
          margin-top: 16px;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s 0.1s ease-out,
            margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-button {
          transform: translateY(-8px) scale(0.9);
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .toggle-button.expanded {
          transform: translateY(8px) scale(1);
        }

        .toggle-button:active {
          transform: scale(0.9);
        }

        .chevron-icon {
          transition: transform 0.3s ease-in-out;
        }

        .chevron-icon.expanded {
          transform: rotate(180deg);
        }

        .search-button:hover {
          transform: scale(1.05);
          background-color: #8b3bc7;
        }

        .search-button:active {
          transform: scale(0.95);
        }

        .filter-button {
          transition: all 0.3s ease;
        }

        .filter-button:hover {
          transform: translateY(-2px);
        }

        .filter-button:active {
          transform: scale(0.95);
        }

        .filter-button.active {
          transform: scale(1.05);
        }

        .main-search-button:active {
          transform: scale(0.98);
        }

        .bg-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bg-overlay.visible {
          opacity: 1;
        }

        @keyframes filterFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-option {
          opacity: 0;
        }

        .filter-option.visible {
          animation: filterFadeIn 0.4s ease-out forwards;
        }

        .filter-grid.visible,
        .action-buttons.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .filter-grid,
        .action-buttons {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        .filter-grid.visible {
          transition-delay: 0.2s;
        }

        .action-buttons.visible {
          transition-delay: 0.5s;
        }
      `}</style>

      <div
        className={`search-bar-container bg-white/10 mb-3 backdrop-blur-[2px] mt-2 md:mt-0 rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 relative ${className}`}
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
                <div
                  ref={menuRef}
                  className="location-menu absolute -top-20 right-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto mt-2"
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
                </div>
              )}

              {/* Quick search button for compact mode */}
              {compact && (
                <button
                  className="search-button text-gray-400 h-full px-4 sm:px-6 flex items-center justify-center transition-all duration-300"
                  onClick={handleSearch}
                >
                  <FaSearch className="text-sm sm:text-base" />
                </button>
              )}
            </div>
          </div>

          {/* Toggle expand/collapse button for compact mode */}
          {compact && (
            <button
              className={`toggle-button ${
                expanded ? "expanded" : ""
              } absolute -bottom-5 left-1/2 transform bg-[#A14BE0] -translate-x-1/2 text-white p-3 sm:p-4 rounded-full z-10`}
              onClick={() => setExpanded(!expanded)}
              aria-label={
                expanded ? "بستن گزینه‌های جستجو" : "باز کردن گزینه‌های جستجو"
              }
            >
              <div className={`chevron-icon ${expanded ? "expanded" : ""}`}>
                <FaChevronDown className="text-sm sm:text-base" />
              </div>
            </button>
          )}

          {/* Expandable section */}
          <div
            className={`expandable-section ${
              expanded ? "expanded" : ""
            } w-full`}
          >
            <div>
              {/* Filter Options */}
              <div
                className={`filter-grid ${
                  expanded ? "visible" : ""
                } grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-3 mb-6`}
              >
                {filterOptions.map((option, index) => (
                  <button
                    key={option.id}
                    className={`filter-button filter-option ${
                      expanded ? "visible" : ""
                    } ${
                      activeFilter === option.id ? "active" : ""
                    } flex flex-col items-center justify-center w-full p-2 rounded-xl ${
                      activeFilter === option.id
                        ? "md:bg-[#A14BE0] bg-[#A14BE0] border text-white shadow-lg"
                        : "md:bg-white/5 text-[#fff] md:text-black border border-white/20 hover:bg-white/50 hover:shadow-md"
                    }`}
                    onClick={() =>
                      setActiveFilter(
                        option.id === activeFilter ? null : option.id
                      )
                    }
                    style={{
                      animationDelay: expanded ? `${0.3 + index * 0.1}s` : "0s",
                    }}
                  >
                    <option.icon className="text-sm sm:text-base mb-2 sm:mb-3" />
                    <span className="text-xs  text-nowrap font-medium">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div
                className={`action-buttons ${
                  expanded ? "visible" : ""
                } flex gap-3`}
              >
                {/* Main search button for expanded state */}
                {(!compact || expanded) && (
                  <button
                    className="main-search-button flex-1 cursor-pointer bg-gradient-to-r from-[#00BC9B] to-[#00a589] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold flex items-center justify-center hover:from-[#00a589] hover:to-[#008f7a] transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handleSearch}
                  >
                    <FaSearch className="ml-2 sm:ml-3 text-sm sm:text-base" />
                    <span className="text-sm sm:text-base">جستجو</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Background overlay for better visual separation when expanded */}
        <div
          className={`bg-overlay ${
            expanded ? "visible" : ""
          } absolute inset-0 bg-white/5 rounded-2xl -z-10`}
        />
      </div>
    </>
  );
}
