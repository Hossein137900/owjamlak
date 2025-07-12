"use client";
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBriefcase,
  FiMessageSquare,
  FiLayers,
  FiChevronDown,
  FiMail,
  FiVideo,
  FiUser,
  FiBook,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "./dashboard";
import LegalRequests from "./legalConsultationRequests/legalRequests";
import UsersManagement from "./users/usersManagement";
import EmployRequests from "./employRequest/employRequests";
import RealStateRequests from "./realEstateConsultation/realStateRequests";
import PropertyListings from "./propertyListings";
import NewsletterManagement from "./newsletter/newsletterManagement";
import VideoManagement from "./video/videoManagement";
import PosterForm from "./posters/posterForm";
import CreateConsultantForm from "./consultant-champion/addTopConsultant";
import BlogManagement from "./blogs/blogManagement";
import CategoryManager from "./category/categoriesPage";
import ConsultantManager from "./consultant/consultantManager";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    // Check if there's a stored active section when component mounts
    const storedSection = sessionStorage.getItem("activeAdminSection");
    if (storedSection) {
      setActiveSection(storedSection);
    }

    // Listen for admin section changes from mobile footer
    const handleAdminSectionChange = (event: CustomEvent) => {
      setActiveSection(event.detail.section);
    };

    window.addEventListener(
      "adminSectionChange",
      handleAdminSectionChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "adminSectionChange",
        handleAdminSectionChange as EventListener
      );
    };
  }, []);

  // Also add this useEffect to keep sessionStorage in sync with current active section
  useEffect(() => {
    if (activeSection) {
      sessionStorage.setItem("activeAdminSection", activeSection);
    }
  }, [activeSection]);

  // Check for user's preferred color scheme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const menuItems = [
    { id: "dashboard", icon: <FiHome />, label: "داشبورد" },
    { id: "properties", icon: <FiLayers />, label: "آگهی‌های ملک" },
    { id: "Addposter", icon: <FiHome />, label: "ساخت آگهی" },
    {
      id: "real-estate-requests",
      icon: <FiMessageSquare />,
      label: "درخواست‌های مشاوره املاک",
    },
    {
      id: "legal-requests",
      icon: <FiFileText />,
      label: "درخواست‌های مشاوره حقوقی",
    },
    {
      id: "employment-requests",
      icon: <FiBriefcase />,
      label: "درخواست‌های همکاری",
    },
    {
      id: "blogs",
      icon: <FiBook />,
      label: "وبلاگ",
    },
    { id: "newsletter", icon: <FiMail />, label: "خبرنامه" },
    { id: "category", icon: <FiMail />, label: "ساخت دسته‌بندی" },
    { id: "ConsultantChampion", icon: <FiUser />, label: "مشاور برتر" },
    { id: "Consultant", icon: <FiUser />, label: "مشاورین" },
    { id: "users", icon: <FiUsers />, label: "کاربران" },
    { id: "video", icon: <FiVideo />, label: "ویدیو ها" },
    { id: "settings", icon: <FiSettings />, label: "تنظیمات" },
  ];

  // Render the active component based on the selected section
  const renderActiveComponent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "properties":
        return <PropertyListings />;
      case "real-estate-requests":
        return <RealStateRequests />;
      case "legal-requests":
        return <LegalRequests />;
      case "employment-requests":
        return <EmployRequests />;
      case "users":
        return <UsersManagement />;
      case "newsletter":
        return <NewsletterManagement />;
      case "category":
        return <CategoryManager />;
      case "Consultant":
        return <ConsultantManager />;

      case "video":
        return <VideoManagement />;
      case "Addposter":
        return <PosterForm />;
      case "ConsultantChampion":
        return <CreateConsultantForm />;
      case "blogs":
        return <BlogManagement />;
      default:
        return <Dashboard />;
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: { width: "16rem", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: "5rem", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const menuItemVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
  };

  const labelVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.1, duration: 0.2 },
    },
    closed: {
      opacity: 0,
      x: -10,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2 },
    },
  };

  const bgClass = isDarkMode ? "bg-gray-900" : "bg-white";
  const textClass = isDarkMode ? "text-gray-200" : "text-gray-800";
  const borderClass = isDarkMode ? "border-gray-700" : "border-gray-200";
  const headerBgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const sidebarBgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const mainBgClass = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const hoverBgClass = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const activeBgClass = isDarkMode ? "bg-blue-900/30" : "bg-blue-100";
  const activeTextClass = isDarkMode ? "text-blue-400" : "text-blue-600";

  return (
    <div
      className={`min-h-screen ${mainBgClass} flex flex-col transition-colors duration-300`}
    >
      {/* Top Navigation Bar */}
      <header
        className={`${headerBgClass} shadow-sm z-20 transition-colors duration-300`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileSidebarOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiX className="block h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMenu className="block h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={toggleSidebar}
                className="hidden md:inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <motion.div
                  animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiMenu className="block h-6 w-6" />
                </motion.div>
              </button>

              <div className="flex-shrink-0 flex items-center mr-4">
                <motion.h1
                  className={`text-xl font-bold ${textClass} transition-colors duration-300`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  پنل مدیریت املاک
                </motion.h1>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${hoverBgClass} transition-colors duration-200`}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: isDarkMode ? 40 : 0 }}
                  transition={{ duration: 0.5 }}
                  className={isDarkMode ? "text-yellow-300" : "text-gray-500"}
                >
                  {isDarkMode ? (
                    <>
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </>
                  ) : (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  )}
                </motion.svg>
              </button>

              {/* User profile */}
              <div className="relative ">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 space-x-reverse focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="flex items-center ">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <svg
                            className="h-full w-full text-gray-300 dark:text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                      </div>
                    </div>
                    <div className="mr-3 hidden md:block">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-sm font-medium ${textClass} transition-colors duration-300`}
                      >
                        مدیر سیستم
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown
                      className={`h-4 w-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-2 w-48 origin-top-right rounded-md shadow-lg"
                    >
                      <div
                        className={`rounded-md ${bgClass} shadow-xs ${borderClass} border`}
                      >
                        <div className="py-1">
                          <a
                            href="#profile"
                            className={`block px-4 py-2 text-sm ${textClass} ${hoverBgClass} transition-colors duration-200`}
                          >
                            پروفایل
                          </a>
                          <a
                            href="#settings"
                            className={`block px-4 py-2 text-sm ${textClass} ${hoverBgClass} transition-colors duration-200`}
                          >
                            تنظیمات
                          </a>
                          <div className="border-t border-gray-200 dark:border-gray-700"></div>
                          <a
                            href="#logout"
                            className={`block px-4 py-2 text-sm text-red-600 dark:text-red-400 ${hoverBgClass} transition-colors duration-200`}
                          >
                            خروج
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden"
                onClick={toggleMobileSidebar}
              />
              <motion.div
                variants={{
                  closed: { x: "100%", opacity: 0 },
                  open: { x: 0, opacity: 1 },
                }}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                className={`fixed inset-y-0 right-0 flex flex-col w-72 max-w-xs ${sidebarBgClass} shadow-2xl z-40 md:hidden transition-colors duration-300 overflow-hidden`}
                style={{
                  borderTopLeftRadius: "16px",
                  borderBottomLeftRadius: "16px",
                }}
              >
                <div className="flex items-center mt-2 justify-end h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMobileSidebar}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="flex-1 overflow-y-auto pt-5 pb-4 px-1">
                  <nav className="mt-2 px-2 space-y-1.5">
                    {menuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay:
                            menuItems.findIndex((i) => i.id === item.id) * 0.05,
                        }}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeSection === item.id
                            ? `${activeBgClass} ${activeTextClass} shadow-sm`
                            : `${textClass} ${hoverBgClass}`
                        }`}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <span
                          className={`ml-3 ${
                            activeSection === item.id
                              ? activeTextClass
                              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                          } transition-colors duration-200`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        {activeSection === item.id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute right-0 w-1 h-6 bg-blue-500 rounded-l-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span className="mr-2 text-sm font-medium">خروج</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Static sidebar for desktop */}
        <motion.div
          variants={sidebarVariants}
          initial={false}
          animate={isSidebarOpen ? "open" : "closed"}
          className={`hidden md:flex md:flex-col ${sidebarBgClass} border-l ${borderClass} transition-colors duration-300 relative z-10`}
          style={{
            boxShadow: isDarkMode
              ? "1px 0 5px rgba(0,0,0,0.1)"
              : "1px 0 5px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md"
              >
                <span className="text-white font-bold text-lg">A</span>
              </motion.div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.h2
                    variants={labelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className={`mr-3 text-xl font-semibold ${textClass} tracking-wide`}
                  >
                    املاک
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1.5">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  <motion.button
                    variants={menuItemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? `${activeBgClass} ${activeTextClass} shadow-sm`
                        : `${textClass} ${hoverBgClass}`
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span
                      className={`ml-3 ${
                        activeSection === item.id
                          ? activeTextClass
                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                      } transition-colors duration-200`}
                    >
                      {item.icon}
                    </span>
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          variants={labelVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute right-0 w-1 h-6 bg-blue-500 rounded-l-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>

                  {/* Tooltip for collapsed sidebar */}
                  {!isSidebarOpen && (
                    <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-gray-800 text-white"
                        } shadow-lg whitespace-nowrap`}
                      >
                        {item.label}
                        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-inherit"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="relative group w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200 group w-full"
              >
                <FiLogOut className="h-5 w-5 group-hover:text-red-500 transition-colors duration-200" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      variants={labelVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="mr-2 text-sm font-medium group-hover:text-red-500 transition-colors duration-200"
                    >
                      خروج
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Tooltip for logout when sidebar is collapsed */}
              {!isSidebarOpen && (
                <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div
                    className={`px-2 py-1 text-xs font-medium rounded bg-red-500 text-white shadow-lg whitespace-nowrap`}
                  >
                    خروج
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-inherit"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${mainBgClass} transition-colors duration-300`}
        >
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="h-full"
          >
            {renderActiveComponent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
