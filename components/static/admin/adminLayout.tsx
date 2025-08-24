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
  FiMail,
  FiVideo,
  FiUser,
  FiBook,
  FiHeart,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuth } from "../../../contexts/AdminAuthContext";
import Dashboard from "./dashboard";
import LegalRequests from "./legalConsultationRequests/legalRequests";
import UsersManagement from "./users/usersManagement";
import EmployRequests from "./employRequest/employRequests";
import RealStateRequests from "./realEstateConsultation/realStateRequests";
import NewsletterManagement from "./newsletter/newsletterManagement";
import VideoManagement from "./video/videoManagement";
import PosterForm from "./posters/posterForm";
import CreateConsultantForm from "./consultant-champion/addTopConsultant";
import BlogManagement from "./blogs/blogManagement";
import ConsultantManager from "./consultant/consultantManager";
import PropertyListings from "./posters/propertyListings";
import AdminFavoritesPage from "./favorites/page";
import MessagesPage from "./contactForm/messagesPage";
import PosterById from "./posters/posterById";
import ChatAdminList from "./chat/adminChatList";

const AdminLayout: React.FC = () => {
  const { hasAccess, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedSection = sessionStorage.getItem("activeAdminSection");
    if (storedSection) {
      setActiveSection(storedSection);
    }

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

  useEffect(() => {
    if (activeSection) {
      sessionStorage.setItem("activeAdminSection", activeSection);
    }
  }, [activeSection]);

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

  const allMenuItems = [
    {
      id: "dashboard",
      icon: <FiHome />,
      label: "داشبورد",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "chat",
      icon: <FiMessageSquare />,
      label: "چت آنلاین",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "properties",
      icon: <FiLayers />,
      label: "آگهی های ملک",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "Myproperties",
      icon: <FiLayers />,
      label: "آگهی های من",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "Addposter",
      icon: <FiHome />,
      label: "ساخت آگهی",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "real-estate-requests",
      icon: <FiMessageSquare />,
      label: "درخواستهای مشاوره املاک",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "legal-requests",
      icon: <FiFileText />,
      label: "درخواستهای مشاوره حقوقی",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "employment-requests",
      icon: <FiBriefcase />,
      label: "درخواستهای همکاری",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "favorite",
      icon: <FiHeart />,
      label: "علاقه مندی ها",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "contact",
      icon: <FiBook />,
      label: "پیام های ارتباط",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "blogs",
      icon: <FiBook />,
      label: "وبلاگ",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "newsletter",
      icon: <FiMail />,
      label: "خبرنامه",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "ConsultantChampion",
      icon: <FiUser />,
      label: "مشاور برتر",
      roles: ["superadmin"],
    },
    {
      id: "Consultant",
      icon: <FiUser />,
      label: "مشاورین",
      roles: ["superadmin"],
    },
    { id: "users", icon: <FiUsers />, label: "کاربران", roles: ["superadmin"] },
    {
      id: "video",
      icon: <FiVideo />,
      label: "ویدیو ها",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "settings",
      icon: <FiSettings />,
      label: "تنظیمات",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
  ];

  const menuItems = allMenuItems.filter((item) => hasAccess(item.roles));

  const renderActiveComponent = () => {
    const currentItem = allMenuItems.find((item) => item.id === activeSection);
    if (currentItem && !hasAccess(currentItem.roles)) {
      return (
        <div className="p-8 text-center text-red-500">
          شما دسترسی به این بخش را ندارید
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "properties":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <PropertyListings />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "real-estate-requests":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <RealStateRequests />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "legal-requests":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <LegalRequests />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "employment-requests":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <EmployRequests />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "users":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <UsersManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "chat":
        return hasAccess(["admin", "superadmin"]) ? (
          <ChatAdminList />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "newsletter":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <NewsletterManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "Myproperties":
        return <PosterById />;
      case "Consultant":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <ConsultantManager />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "favorite":
        return <AdminFavoritesPage />;
      case "contact":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <MessagesPage />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "video":
        return hasAccess(["admin", "superadmin", "user"]) ? (
          <VideoManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "Addposter":
        return <PosterForm />;
      case "ConsultantChampion":
        return hasAccess(["superadmin"]) ? (
          <CreateConsultantForm />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      case "blogs":
        return hasAccess(["admin", "superadmin"]) ? (
          <BlogManagement />
        ) : (
          <div className="p-8 text-center text-red-500">دسترسی محدود</div>
        );
      default:
        return <Dashboard />;
    }
  };

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
      <header
        className={`${headerBgClass} shadow-sm z-20 transition-colors duration-300`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1
                    className={`text-xl font-bold ${textClass} transition-colors duration-300`}
                  >
                    پنل مدیریت املاک
                  </h1>
                  <div className={`text-xs ${textClass} font-bold opacity-40`}>
                    امروز {new Date().toLocaleDateString("fa-IR")}
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
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
                className={`fixed inset-y-0 right-0 flex flex-col w-72 max-w-xs ${sidebarBgClass} shadow-2xl z-100000 md:hidden transition-colors duration-300 overflow-hidden`}
                style={{
                  borderTopLeftRadius: "16px",
                  borderBottomLeftRadius: "16px",
                }}
              >
                <div className="flex flex-row-reverse items-center mt-2 justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMobileSidebar}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMobileSidebar}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
                  >
                    املاک اوج
                  </motion.span>
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
                  <div className="flex-shrink-0 flex mt-2 border-t pt-1 border-gray-400 dark:border-gray-700 px-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="flex items-center w-full px-3 py-2 rounded-lg text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <FiLogOut className="h-5 w-5" />
                      <span className="mr-2 text-sm font-medium">خروج</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.h2
                    variants={labelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className={`mr-3 text-xl font-semibold ${textClass} tracking-wide`}
                  >
                    املاک اوج
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
                onClick={logout}
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