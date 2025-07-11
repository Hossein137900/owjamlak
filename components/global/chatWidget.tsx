"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaHome, FaUsers, FaHeadset, FaTimes } from "react-icons/fa";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
  primaryColor?: string;
}

interface ServiceBox {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  link: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = "bottom-right",
  primaryColor = "#66308d",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showServiceBoxes, setShowServiceBoxes] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Service boxes data
  const serviceBoxes: ServiceBox[] = [
    {
      id: "property-management",
      title: "مشاوره املاک",
      description: "خدمات کامل مدیریت و اجاره املاک شما",
      icon: FaHome,
      color: "from-blue-500 to-blue-600",
      link: "/services/realEstateConsultation",
    },
    {
      id: "consultation",
      title: "همکاری با ما",
      description: "همکاری با ما در توسعه کسب و کار",
      icon: FaUsers,
      color: "from-green-500 to-green-600",
      link: "/services/Collaboration",
    },
    {
      id: "support",
      title: "خدمات حقوقی",
      description: "مشاوره و پشتیبانی حقوقی",
      icon: FaHeadset,
      color: "from-purple-500 to-purple-600",
      link: "/services/legalConsultation",
    },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check for first visit and auto-open chat
  useEffect(() => {
    const hasVisited = localStorage.getItem("owjamlak_chat_visited");
    const hasSeenServices = localStorage.getItem("owjamlak_services_seen");

    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem("owjamlak_chat_visited", "true");

      // Auto-open chat after a short delay
      setTimeout(() => {
        setIsOpen(true);
        if (!hasSeenServices) {
          setShowServiceBoxes(true);
        }
      }, 2000);
    }
  }, []);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  // Default questions
  const quickQuestions = [
    "چگونه می‌توانم ملک خود را ثبت کنم؟",
    "آیا خدمات مشاوره رایگان است؟",
    "چگونه با تیم پشتیبانی تماس بگیرم؟",
  ];

  // Auto responses
  const autoResponses: Record<string, string> = {
    "چگونه می‌توانم ملک خود را ثبت کنم؟":
      "برای ثبت ملک، به بخش 'آگهی‌های ملک' در پنل مدیریت بروید و روی دکمه 'افزودن آگهی جدید' کلیک کنید. سپس فرم مربوطه را تکمیل کنید.",
    "آیا خدمات مشاوره رایگان است؟":
      "بله، مشاوره اولیه ما کاملاً رایگان است. برای مشاوره‌های تخصصی‌تر، تیم ما با شما تماس خواهد گرفت.",
    "چگونه با تیم پشتیبانی تماس بگیرم؟":
      "می‌توانید از طریق شماره 021-12345678 یا ایمیل support@amalak.com با تیم پشتیبانی ما در تماس باشید.",
    "درباره مدیریت املاک بیشتر بدانم":
      "خدمات مدیریت املاک ما شامل: اجاره‌دهی، نگهداری، تعمیرات، وصول اجاره و گزارش‌دهی ماهانه می‌باشد. آیا سوال خاصی در این زمینه دارید؟",
    "درباره مشاوره تخصصی بیشتر بدانم":
      "تیم مشاوران ما در زمینه‌های خرید، فروش، اجاره، ارزیابی املاک و سرمایه‌گذاری آماده خدمت‌رسانی هستند. برای رزرو جلسه مشاوره رایگان با ما تماس بگیرید.",
    "درباره پشتیبانی بیشتر بدانم":
      "تیم پشتیبانی ما ۲۴ ساعته آماده پاسخگویی به سوالات شما است. می‌توانید از طریق چت، تلفن یا ایمیل با ما در ارتباط باشید.",
    default:
      "سوال شما دریافت شد. تیم پشتیبانی ما در اسرع وقت با شما تماس خواهد گرفت. آیا سوال دیگری دارید؟",
  };

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0 && !showServiceBoxes) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: "سلام! به پنل مدیریت املاک خوش آمدید. چطور می‌توانم کمکتان کنم؟",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, showServiceBoxes]);

  // Scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !showServiceBoxes) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, showServiceBoxes]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowQuickQuestions(false);
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: autoResponses[text] || autoResponses.default,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleCloseServiceBoxes = () => {
    setShowServiceBoxes(false);
    localStorage.setItem("owjamlak_services_seen", "true");

    // Show welcome message after closing service boxes
    const welcomeMessage: Message = {
      id: "welcome",
      text: "سلام! به پنل مدیریت املاک خوش آمدید. چطور می‌توانم کمکتان کنم؟",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  // Mobile animations
  const mobileModalVariants = {
    hidden: {
      opacity: 0,
      y: "100%",
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: "100%",
      transition: { duration: 0.3 },
    },
  };

  // Desktop animations
  const desktopModalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50000 lg:mb-20`}
      dir="rtl"
    >
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`relative w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white overflow-hidden group`}
            style={{ backgroundColor: primaryColor }}
          >
            <FiMessageCircle className="w-7 h-7 relative z-10" />

            {/* Pulse animation for first-time visitors */}
            {isFirstVisit && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Notification badge */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-xs text-white font-bold">!</span>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={isMobile ? mobileModalVariants : desktopModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden
              ${
                isMobile
                  ? "fixed inset-0 w-full h-full rounded-none"
                  : "w-96 h-[500px] rounded-2xl"
              }
            `}
          >
            {/* Header */}
            <div
              className={`text-white relative overflow-hidden ${
                isMobile ? "p-6 pt-12" : "p-4"
              }`}
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, #01ae9b)`,
              }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white transform -translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white transform translate-x-8 translate-y-8" />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={`bg-white/20 rounded-full flex items-center justify-center ${
                      isMobile ? "w-12 h-12" : "w-10 h-10"
                    }`}
                  >
                    <BsRobot
                      className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isMobile ? "text-lg" : "text-base"
                      }`}
                    >
                      {showServiceBoxes ? "خدمات ما" : "پشتیبانی آنلاین"}
                    </h3>
                    <p
                      className={`opacity-90 ${
                        isMobile ? "text-base" : "text-sm"
                      }`}
                    >
                      {showServiceBoxes
                        ? "خدمات ویژه برای شما"
                        : "همیشه در خدمت شما"}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors ${
                    isMobile ? "w-10 h-10" : "w-8 h-8"
                  }`}
                >
                  <FiX className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                </motion.button>
              </div>
            </div>

            {/* Service Boxes or Messages */}
            <div
              className={`flex-1 overflow-y-auto bg-gray-50 ${
                isMobile ? "p-6" : "p-4"
              }`}
            >
              <AnimatePresence mode="wait">
                {showServiceBoxes ? (
                  <motion.div
                    key="service-boxes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 z-500000 mb-12"
                  >
                    {/* Welcome Message for Services */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-6"
                    >
                      <h4 className="text-lg font-bold text-gray-800 mb-2">
                        به اوج املاک خوش آمدید! 🎉
                      </h4>
                      <p className="text-sm text-gray-600">
                        خدمات ویژه ما را کشف کنید
                      </p>
                    </motion.div>

                    {/* Service Boxes */}
                    {serviceBoxes.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
                      >
                        <Link href={service.link}>
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}
                            >
                              <service.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">
                                {service.title}
                              </h5>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}

                    {/* Close Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex justify-center pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCloseServiceBoxes}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
                      >
                        <FaTimes className="w-4 h-4" />
                        <span>بستن و شروع چت</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-messages"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Messages */}
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl ${
                            isMobile ? "p-4" : "p-3"
                          } ${
                            message.sender === "user"
                              ? "bg-white text-gray-800 rounded-br-md shadow-md"
                              : "text-white rounded-bl-md shadow-md"
                          }`}
                          style={{
                            backgroundColor:
                              message.sender === "bot"
                                ? primaryColor
                                : undefined,
                          }}
                        >
                          <p
                            className={`leading-relaxed ${
                              isMobile ? "text-base" : "text-sm"
                            }`}
                          >
                            {message.text}
                          </p>
                          <p
                            className={`mt-1 ${
                              isMobile ? "text-sm" : "text-xs"
                            } ${
                              message.sender === "user"
                                ? "text-gray-500"
                                : "text-white/70"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString("fa-IR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end"
                      >
                        <div
                          className={`rounded-2xl rounded-bl-md text-white shadow-md ${
                            isMobile ? "p-4" : "p-3"
                          }`}
                          style={{ backgroundColor: primaryColor }}
                        >
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Quick questions */}
                    {showQuickQuestions && messages.length <= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                      >
                        <p
                          className={`text-gray-600 text-center ${
                            isMobile ? "text-base" : "text-sm"
                          }`}
                        >
                          سوالات پرتکرار:
                        </p>
                        {quickQuestions.map((question, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickQuestion(question)}
                            className={`
                              w-full text-right bg-white text-black border border-gray-200 rounded-xl 
                              hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md
                              ${isMobile ? "p-4 text-base" : "p-3 text-sm"}
                            `}
                          >
                            {question}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input - Only show when not displaying service boxes */}
            {!showServiceBoxes && (
              <div
                className={`bg-white border-t border-gray-200 ${
                  isMobile ? "p-6 pb-8" : "p-4"
                }`}
              >
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className={`
                      flex-1 border placeholder:text-gray-400 text-black border-gray-300 rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      ${isMobile ? "p-4 text-base" : "p-3 text-sm"}
                    `}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputValue.trim()}
                    className={`
                      rounded-xl flex items-center justify-center text-white 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                      ${isMobile ? "w-14 h-14" : "w-12 h-12"}
                    `}
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FiSend className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
