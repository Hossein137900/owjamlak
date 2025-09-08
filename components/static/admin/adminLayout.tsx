"use client";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiFileText,
  // FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBriefcase,
  FiMessageSquare,
  FiLayers,
  FiMail,
  FiVideo,
  FiBook,
  FiHeart,
  FiPlus,
  FiUserCheck,
  FiStar,
  FiPhone,
  FiEdit,
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
import Link from "next/link";

const AdminLayout: React.FC = () => {
  const { hasAccess, logout } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Handle URL hash changes and browser navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial section from URL hash
      const initialHash = window.location.hash.slice(1);
      if (initialHash && allMenuItems.some((item) => item.id === initialHash)) {
        setActiveSection(initialHash);
      }

      // Handle browser back/forward navigation
      const handlePopState = () => {
        const hash = window.location.hash.slice(1);
        if (hash && allMenuItems.some((item) => item.id === hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection("dashboard");
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  // Update URL when activeSection changes
  useEffect(() => {
    if (typeof window !== "undefined" && activeSection) {
      const currentHash = window.location.hash.slice(1);
      if (currentHash !== activeSection) {
        window.history.pushState(null, "", `#${activeSection}`);
      }
    }
  }, [activeSection]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);

      // Auto-collapse sidebar on mobile
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
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
      roles: ["admin", "superadmin"],
    },
    {
      id: "properties",
      icon: <FiLayers />,
      label: "آگهی های ملک",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "Myproperties",
      icon: <FiEdit />,
      label: "آگهی های من",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "Addposter",
      icon: <FiPlus />,
      label: "ساخت آگهی",
      roles: ["admin", "superadmin", "consultant", "user"],
    },
    {
      id: "real-estate-requests",
      icon: <FiHome />,
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
      icon: <FiPhone />,
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
      icon: <FiStar />,
      label: "مشاور برتر",
      roles: ["superadmin"],
    },
    {
      id: "Consultant",
      icon: <FiUserCheck />,
      label: "مشاورین",
      roles: ["superadmin"],
    },
    { id: "users", icon: <FiUsers />, label: "کاربران", roles: ["superadmin"] },
    {
      id: "video",
      icon: <FiVideo />,
      label: "ویدیو ها",
      roles: ["admin", "superadmin"],
    },
    // {
    //   id: "settings",
    //   icon: <FiSettings />,
    //   label: "تنظیمات",
    //   roles: ["admin", "superadmin", "consultant", "user"],
    // },
  ];

  const menuItems = allMenuItems.filter((item) => hasAccess(item.roles));

  // Handle menu item click with URL update
  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

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
        return <Dashboard onNavigate={setActiveSection} />;
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
        return hasAccess(["admin", "superadmin"]) ? (
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
    open: {
      width: "280px",
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    closed: {
      width: "72px",
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const labelVariants = {
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { delay: 0.15, duration: 0.3, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      x: -20,
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const textClass = isDarkMode ? "text-gray-100" : "text-gray-700";
  const borderClass = isDarkMode ? "border-gray-700/50" : "border-gray-200/80";
  const headerBgClass = isDarkMode
    ? "bg-gray-900/20 backdrop-blur-lg"
    : "bg-white/20 backdrop-blur-lg";
  const sidebarBgClass = isDarkMode
    ? "bg-gray-900/98 backdrop-blur-xl"
    : "bg-white/98 backdrop-blur-xl";
  const mainBgClass = isDarkMode ? "bg-gray-950" : "bg-gray-50";
  const hoverBgClass = isDarkMode
    ? "hover:bg-gray-800/80"
    : "hover:bg-gray-100/80";
  const activeBgClass = isDarkMode
    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20"
    : "bg-gradient-to-r from-blue-50 to-indigo-50";
  const activeTextClass = isDarkMode ? "text-blue-400" : "text-blue-600";
  const iconActiveClass = isDarkMode ? "text-blue-400" : "text-blue-600";
  const iconInactiveClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`min-h-screen relative ${mainBgClass} flex flex-col transition-colors duration-300`}
    >
      <header
        className={`${headerBgClass} fixed top-0 w-full shadow-sm z-20 transition-colors duration-300`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 ">
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
                className={`p-2 rounded-full ${hoverBgClass} transition-colors duration-200`}
                aria-label="Navigate to home"
              >
                <Link href="/">
                  <FiHome className={`w-5 h-5 ${textClass}`} />
                </Link>
              </button>
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
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-9999 md:hidden"
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
                    className="p-2 rounded-full text-gray-500 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
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
                          handleMenuClick(item.id);
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
          className={`hidden md:flex md:flex-col ${sidebarBgClass} border-l ${borderClass} transition-all duration-500 relative z-10 shadow-2xl`}
          style={{
            boxShadow: isDarkMode
              ? "4px 0 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)"
              : "4px 0 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <nav className="flex-1 px-3 mt-12 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{
                      scale: 1.02,
                      x: isSidebarOpen ? 4 : 0,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden ${
                      activeSection === item.id
                        ? `${activeBgClass} ${activeTextClass} shadow-lg border border-blue-200/50 dark:border-blue-500/30`
                        : `${textClass} ${hoverBgClass} hover:shadow-md    `
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <motion.div
                      className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                        activeSection === item.id
                          ? "  shadow-sm"
                          : "group-hover:text-blue-500 dark:group-hover:text-blue-500"
                      }`}
                    >
                      <span
                        className={`transition-all duration-300 ${
                          activeSection === item.id
                            ? iconActiveClass
                            : `${iconInactiveClass} group-hover:text-gray-600 dark:group-hover:text-gray-300`
                        }`}
                      >
                        {item.icon}
                      </span>
                    </motion.div>

                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          variants={labelVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="mr-3 font-semibold text-sm tracking-wide"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {activeSection === item.id && isSidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="absolute left-3 w-2 h-2 bg-blue-500 rounded-full shadow-sm"
                      />
                    )}
                  </motion.button>

                  {!isSidebarOpen && (
                    <motion.div
                      className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                    >
                      <div
                        className={`px-3 py-2 text-sm font-semibold rounded-xl shadow-2xl border backdrop-blur-sm ${
                          isDarkMode
                            ? "bg-gray-800/95 text-gray-100 border-gray-700/50"
                            : "bg-white/95 text-gray-800 border-gray-200/50"
                        } whitespace-nowrap`}
                      >
                        {item.label}
                        <div
                          className={`absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-r border-b ${
                            isDarkMode
                              ? "bg-gray-800/95 border-gray-700/50"
                              : "bg-white/95 border-gray-200/50"
                          }`}
                        ></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 p-4">
            <div className="relative group w-full">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  x: isSidebarOpen ? 4 : 0,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className={`flex items-center w-full px-4 py-3.5 rounded-2xl transition-all duration-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md group border border-transparent hover:border-red-200/50 dark:hover:border-red-500/30`}
              >
                <motion.div className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group-hover:bg-red-100 dark:group-hover:bg-red-900/30">
                  <FiLogOut className="h-5 w-5 transition-all duration-300" />
                </motion.div>

                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      variants={labelVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="mr-3 text-sm font-semibold tracking-wide"
                    >
                      خروج
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {!isSidebarOpen && (
                <motion.div
                  className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  <div className="px-3 py-2 text-sm font-semibold rounded-xl bg-red-500 text-white shadow-2xl border border-red-400/50 backdrop-blur-sm whitespace-nowrap">
                    خروج
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-red-500 border-r border-b border-red-400/50"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 mt-16 md:mt-10 lg:p-8 ${mainBgClass} transition-colors duration-300`}
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
