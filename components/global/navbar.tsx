"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  dropdownItemVariants,
  dropdownVariants,
  itemVariants,
  logoVariants,
  mobileMenuVariants,
  navItems,
} from "../../lib/navbar";
import Image from "next/image";
import Link from "next/link";
import {
  FiChevronDown,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { User } from "@/types/type";
import TopBar from "../static/ui/topBar";
import MapModal from "../static/ui/mapModal";
import { usePathname } from "next/navigation";

// JWT decode function
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.log("Error decoding JWT:", error);
    return null;
  }
};
const Navbar = () => {
  const mapButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // Add user state
  const [user, setUser] = useState<User | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Check user authentication by decoding JWT token
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoadingUser(false);
        return;
      }

      try {
        const decodedToken = decodeJWT(token);

        if (decodedToken) {
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.removeItem("token");
            setUser(null);
          } else {
            // Token is valid, set user data
            setUser({
              name: decodedToken.name,
              role: decodedToken.role,
              password: decodedToken.password,
              phone: decodedToken.phone,
            });
          }
        } else {
          // Invalid token
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuth();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    // Set active item based on current path
    setActiveItem(window.location.pathname);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }

      // Handle user dropdown click outside
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lastScrollY]);

  const toggleDropdown = (href: string) => {
    setOpenDropdown((prevState) => (prevState === href ? null : href));
  };

  useEffect(() => {
    if (!isOpen) {
      setOpenDropdown(null);
    }
  }, [isOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsUserDropdownOpen(false);
    window.location.href = "/";
  };

  if (pathname === "/auth" || pathname === "/admin") {
    return null;
  }

  return (
    <>
      {/* Top Contact Bar - Now responsive for all devices */}
      <TopBar scrolled={scrolled} />
      <MapModal
        isOpen={isMapModalOpen}
        onClose={closeMapModal}
        triggerRef={mapButtonRef as React.RefObject<HTMLElement>}
      />
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#01ae9b] to-[#66308d] origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Main Navbar */}
      <motion.header
        dir="rtl"
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={`fixed ${
          pathname === "/" ? "top-0" : "-top-10"
        }  w-full z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/50 backdrop-blur-sm shadow-lg border-b border-gray-100"
            : "bg-white/50 backdrop-blur-sm"
        }`}
        style={{
          marginTop: scrolled ? "0" : "40px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              animate={scrolled ? "scrolled" : "normal"}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  className="relative h-10 w-10 lg:h-12 lg:w-12 overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/assets/images/logo (2).png"
                    alt="املاک لوگو"
                    width={80}
                    height={80}
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex  items-center">
              <div className="flex items-center  gap-2 ml-12">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    className="relative"
                    ref={item.hasDropdown ? dropdownRef : null}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.hasDropdown ? (
                      <div className="relative group">
                        <motion.button
                          onClick={() => toggleDropdown(item.href)}
                          className="flex items-center gap-2 text-sm lg:text-base text-gray-700 hover:text-[#01ae9b] font-medium transition-all duration-300 py-2 px-3 rounded-lg hover:bg-gray-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.name}
                          <motion.div
                            animate={{
                              rotate: openDropdown === item.href ? 180 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <FiChevronDown size={16} />
                          </motion.div>
                        </motion.button>

                        {/* Enhanced Dropdown Menu */}
                        <AnimatePresence>
                          {openDropdown === item.href && (
                            <motion.div
                              className="absolute top-full right-0 mt-3 w-72 origin-top-right"
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              <div className="relative">
                                {/* Enhanced arrow */}
                                <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-r border-gray-200 shadow-sm"></div>

                                {/* Enhanced dropdown content */}
                                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                  <div className="p-4 bg-gradient-to-r from-[#01ae9b] to-[#66308d] text-white">
                                    <h3 className="text-sm font-bold">
                                      خدمات ویژه املاک
                                    </h3>
                                    <p className="text-xs opacity-90 mt-1">
                                      بهترین خدمات برای شما
                                    </p>
                                  </div>

                                  <div className="p-2">
                                    {item.dropdownItems?.map(
                                      (dropdownItem, index) => (
                                        <motion.div
                                          key={dropdownItem.href}
                                          custom={index}
                                          variants={dropdownItemVariants}
                                          initial="hidden"
                                          animate="visible"
                                          whileHover="hover"
                                        >
                                          <Link
                                            href={dropdownItem.href}
                                            className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#01ae9b] hover:bg-gray-50 transition-all duration-200 rounded-xl m-1"
                                            onClick={() =>
                                              setOpenDropdown(null)
                                            }
                                          >
                                            <span className="text-xl text-[#01ae9b]">
                                              {dropdownItem.icon && (
                                                <dropdownItem.icon />
                                              )}
                                            </span>
                                            <div>
                                              <span className="text-sm font-medium block">
                                                {dropdownItem.name}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                خدمات تخصصی
                                              </span>
                                            </div>
                                          </Link>
                                        </motion.div>
                                      )
                                    )}
                                  </div>

                                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                                    <Link
                                      href="/services"
                                      className="block text-center text-sm text-[#01ae9b] hover:text-[#66308d] font-medium transition-colors duration-200"
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      مشاهده همه خدمات →
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link href={item.href} className="relative group">
                        <motion.span
                          className={`text-sm lg:text-base font-medium transition-all duration-300 py-3 px-4 rounded-xl block relative overflow-hidden ${
                            activeItem === item.href
                              ? "text-gray-700"
                              : "text-gray-700 hover:text-[#01ae9b] "
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="relative z-10">{item.name}</span>
                        </motion.span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
                ref={userDropdownRef}
              >
                {isLoadingUser ? (
                  <div className="w-8 h-8 border-2 border-[#01ae9b] border-t-transparent rounded-full animate-spin"></div>
                ) : user ? (
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-between gap-3 rounded-2xl  bg-white text-gray-800 px-4 py-3  hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-[#01ae9b]/10 hover:to-[#66308d]/10 focus:outline-none focus:ring-2 focus:ring-[#01ae9b]/50 min-w-[140px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-[#01ae9b] to-[#66308d] p-2 rounded-xl shadow-sm">
                          <FiUser size={16} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-800 truncate max-w-[80px]">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            کاربر سایت
                          </span>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-gray-500"
                      >
                        <FiChevronDown size={16} />
                      </motion.div>
                    </motion.button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          className="absolute top-full left-0 mt-3 w-56 origin-top-left"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <div className="relative">
                            <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200 shadow-sm"></div>

                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                              <div className="p-4 bg-gradient-to-r from-[#01ae9b] to-[#66308d] text-white">
                                <h3 className="text-sm font-bold">خوش آمدید</h3>
                                <p className="text-xs opacity-90 mt-1">
                                  {user.name}
                                </p>
                              </div>

                              <div className="p-2">
                                {
                                  <motion.div
                                    variants={dropdownItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                  >
                                    <Link
                                      href="/admin"
                                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#01ae9b] hover:bg-gray-50 transition-all duration-200 rounded-xl m-1"
                                      onClick={() =>
                                        setIsUserDropdownOpen(false)
                                      }
                                    >
                                      <FiSettings className="text-xl text-[#01ae9b]" />
                                      <div>
                                        <span className="text-sm font-medium block">
                                          پنل مدیریت
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          مدیریت سایت
                                        </span>
                                      </div>
                                    </Link>
                                  </motion.div>
                                }

                                <motion.div
                                  variants={dropdownItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover="hover"
                                >
                                  <button
                                    aria-label="logout"
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl m-1 w-full text-right"
                                  >
                                    <FiLogOut className="text-xl text-red-500" />
                                    <div>
                                      <span className="text-sm font-medium block">
                                        خروج از حساب
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        خروج ایمن
                                      </span>
                                    </div>
                                  </button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/auth">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(1, 174, 155, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-[#01ae9b] to-[#66308d] hover:from-[#66308d] hover:to-[#01ae9b] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <FiUser size={16} className="text-white" />
                      </div>
                      ورود / ثبت نام
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <FiX size={24} className="text-gray-700" />
                  ) : (
                    <FiMenu size={24} className="text-gray-700" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Menu Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.nav
              className="fixed top-0 right-0 h-full w-screen bg-white shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              dir="rtl"
            >
              {/* Mobile Header - Fixed at top */}
              <div className="flex-shrink-0 flex items-center justify-center p-4 bg-gradient-to-r from-[#01ae9b] to-[#66308d] shadow-lg relative">
                {/* Centered Logo and Brand */}
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden  ">
                    <Image
                      src="/assets/images/logo (2).png"
                      alt="املاک لوگو"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white">
                      املاک
                    </span>
                    <p className="text-xs text-white/80">مشاور املاک</p>
                  </div>
                </div>

                {/* Close Button - Positioned Absolutely */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute left-4 p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <FiX size={18} />
                </motion.button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* User Section - If logged in */}
                {user && (
                  <div className="flex-shrink-0 p-3 bg-gray-50 border-b border-gray-100">
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#01ae9b] to-[#66308d] rounded-full flex items-center justify-center">
                          <FiUser className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">کاربر سایت</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Scrollable Menu Items */}
                <div className="py-2">
                  <motion.div className="px-3 space-y-1 flex flex-col justify-center">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        variants={itemVariants}
                        custom={index}
                      >
                        {item.hasDropdown ? (
                          <div>
                            <motion.button
                              onClick={() => {
                                setOpenDropdown((prev) =>
                                  prev === item.href ? null : item.href
                                );
                              }}
                              className={`flex items-center justify-between w-full text-sm py-3 px-4 rounded-xl transition-all duration-200 ${
                                activeItem.startsWith(item.href) ||
                                openDropdown === item.href
                                  ? "text-[#01ae9b] bg-[#01ae9b]/10 font-semibold shadow-sm"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-medium">{item.name}</span>
                              <motion.div
                                animate={{
                                  rotate: openDropdown === item.href ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <FiChevronDown size={16} />
                              </motion.div>
                            </motion.button>

                            <AnimatePresence>
                              {openDropdown === item.href && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-1 mr-2 space-y-1">
                                    {item.dropdownItems?.map(
                                      (dropdownItem, subIndex) => (
                                        <motion.div
                                          key={dropdownItem.href}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: subIndex * 0.05,
                                            duration: 0.2,
                                          }}
                                        >
                                          <Link
                                            href={dropdownItem.href}
                                            className="flex items-center gap-3 py-2 px-3 text-gray-600 hover:text-[#01ae9b] hover:bg-[#01ae9b]/5 transition-all duration-150 rounded-lg text-sm"
                                            onClick={() => {
                                              setOpenDropdown(null);
                                              setIsOpen(false);
                                            }}
                                          >
                                            <span className="text-[#01ae9b]">
                                              {dropdownItem.icon && (
                                                <dropdownItem.icon size={14} />
                                              )}
                                            </span>
                                            <span className="font-medium">
                                              {dropdownItem.name}
                                            </span>
                                          </Link>
                                        </motion.div>
                                      )
                                    )}

                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                      className="pt-1"
                                    >
                                      <Link
                                        href="/services"
                                        className="block text-center py-2 px-3 text-xs text-[#01ae9b] hover:text-[#66308d] font-medium bg-[#01ae9b]/5 hover:bg-[#01ae9b]/10 rounded-lg transition-all duration-150"
                                        onClick={() => {
                                          setOpenDropdown(null);
                                          setIsOpen(false);
                                        }}
                                      >
                                        مشاهده همه →
                                      </Link>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={`block text-sm py-3 px-4 rounded-xl transition-all duration-200 font-medium ${
                              activeItem === item.href
                                ? "text-[#01ae9b] bg-[#01ae9b]/10 font-semibold shadow-sm"
                                : "text-gray-700 hover:bg-gray-50 hover:text-[#01ae9b]"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.span
                              whileTap={{ x: 3 }}
                              transition={{ duration: 0.1 }}
                            >
                              {item.name}
                            </motion.span>
                          </Link>
                        )}
                      </motion.div>
                    ))}
                    {/* Bottom Action Section - Fixed at bottom */}
                    <div className="w-full p-3 border-t border-gray-100 bg-white">
                      <motion.div variants={itemVariants}>
                        {isLoadingUser ? (
                          <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-[#01ae9b] border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : user ? (
                          <div className="flex items-center w-full justify-around gap-1">
                            <Link href="/admin">
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                className=" bg-[#01ae9b] px-6 hover:bg-[#01ae9b]/80 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                                onClick={() => setIsOpen(false)}
                              >
                                <FiSettings size={16} />
                                پنل مدیریت
                              </motion.button>
                            </Link>

                            <motion.button
                              onClick={handleLogout}
                              whileTap={{ scale: 0.98 }}
                              className=" bg-red-500 px-6  hover:bg-red-600 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                              <FiLogOut size={16} />
                              خروج از حساب
                            </motion.button>
                          </div>
                        ) : (
                          <Link href="/auth">
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-gradient-to-r from-[#01ae9b] to-[#66308d] hover:from-[#01ae9b]/90 hover:to-[#66308d]/90 text-white py-3 rounded-xl font-bold shadow-lg text-sm transition-all"
                              onClick={() => setIsOpen(false)}
                            >
                              ورود / ثبت نام
                            </motion.button>
                          </Link>
                        )}
                      </motion.div>
                    </div>

                    {/* Compact Footer - Fixed at bottom */}
                    <div className="flex-shrink-0 py-3 mb-20  text-center border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        © 2024 املاک - تمامی حقوق محفوظ است
                      </p>
                    </div>
                  </motion.div>

                  {/* Content spacer for better scrolling */}
                  <div className="h-6"></div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
