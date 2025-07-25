"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaHome, FaUsers, FaHeadset, FaTimes } from "react-icons/fa";
import Link from "next/link";

// پیام
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
  // position = "bottom-right",
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem("chat_visited");
    const hasSeenServices = localStorage.getItem("services_seen");
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem("chat_visited", "true");
      setTimeout(() => {
        setIsOpen(true);
        if (!hasSeenServices) setShowServiceBoxes(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  const quickQuestions = [
    "چگونه می‌توانم ملک خود را ثبت کنم؟",
    "آیا خدمات مشاوره رایگان است؟",
    "چگونه با تیم پشتیبانی تماس بگیرم؟",
  ];
  const autoResponses: Record<string, string> = {
    "چگونه می‌توانم ملک خود را ثبت کنم؟":
      "برای ثبت ملک به بخش آگهی‌های ملک در پنل مدیریت بروید و فرم را تکمیل کنید.",
    "آیا خدمات مشاوره رایگان است؟": "بله، مشاوره اولیه ما کاملاً رایگان است.",
    "چگونه با تیم پشتیبانی تماس بگیرم؟":
      "می‌توانید از طریق شماره 021-12345678 با ما تماس بگیرید.",
    default: "سوال شما دریافت شد. تیم ما در اسرع وقت پاسخ می‌دهد.",
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && !showServiceBoxes) {
      setMessages([
        {
          id: "welcome",
          text: "سلام! به پشتیبانی آنلاین خوش آمدید. چطور می‌توانم کمکتان کنم؟",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, showServiceBoxes]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInputValue("");
    setShowQuickQuestions(false);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          text: autoResponses[text] || autoResponses.default,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickQuestion = (q: string) => handleSendMessage(q);
  const handleCloseServiceBoxes = () => {
    setShowServiceBoxes(false);
    localStorage.setItem("services_seen", "true");
    setMessages([
      {
        id: "welcome",
        text: "سلام! به پشتیبانی آنلاین خوش آمدید. چطور می‌توانم کمکتان کنم؟",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const mobileModalVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  };
  const desktopModalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div
      className={`absolute right-6  z-999  `}
      dir="rtl"
    >
      {/* دکمه چت */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} // شروع نرم
            animate={{ opacity: 1, scale: 1 }} // نمایان شدن نرم
            exit={{ opacity: 0, scale: 0.8 }} // هنگام بسته شدن نرم و ثابت
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-25 md:bottom-10 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, #01ae9b)`,
            }}
          >
            <FiMessageCircle className="w-7 h-7 relative z-10" />
            {isFirstVisit && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* بک‌دراپ موبایل */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* چت مودال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={isMobile ? mobileModalVariants : desktopModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              isMobile
                ? "fixed inset-0 w-full h-full rounded-none"
                : "w-96 h-[500px] rounded-2xl"
            } bg-white/90 md:mt-20 backdrop-blur-md shadow-2xl  flex flex-col overflow-hidden`}
          >
            {/* هدر */}
            <div
              className={`text-white relative shadow-md ${
                isMobile ? "p-6 pt-12" : "p-4"
              }`}
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, #01ae9b)`,
              }}
            >
              <div className="flex items-center justify-between">
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
                      {showServiceBoxes ? "خدمات ویژه" : "پشتیبانی آنلاین"}
                    </h3>
                    <p
                      className={`opacity-90 ${
                        isMobile ? "text-base" : "text-sm"
                      }`}
                    >
                      {showServiceBoxes
                        ? "بهترین سرویس‌ها برای شما"
                        : "سوالی داری؟ بپرس!"}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full bg-white/20 hover:bg-white/30 transition-colors ${
                    isMobile ? "w-10 h-10" : "w-8 h-8"
                  } flex items-center justify-center`}
                >
                  <FiX className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                </motion.button>
              </div>
            </div>

            {/* بدنه */}
            <div
              className={`flex-1 overflow-y-auto bg-gray-50 ${
                isMobile ? "p-6" : "p-4"
              }`}
            >
              <AnimatePresence mode="wait">
                {showServiceBoxes ? (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-4 mb-6"
                  >
                    <h4 className="text-center text-lg font-bold text-gray-800 mb-4">
                      خدمات ویژه ما 🎉
                    </h4>
                    {serviceBoxes.map((service, i) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        <Link
                          href={service.link}
                          className="flex items-start gap-4"
                        >
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}
                          >
                            <service.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {service.title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                    <div className="flex justify-center pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCloseServiceBoxes}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
                      >
                        <FaTimes className="w-4 h-4" />
                        <span>بستن و شروع چت</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-4"
                  >
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${
                          m.sender === "user" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                            m.sender === "user"
                              ? "bg-white text-gray-800 rounded-br-md"
                              : "text-white rounded-bl-md"
                          }`}
                          style={{
                            backgroundColor:
                              m.sender === "bot" ? primaryColor : undefined,
                          }}
                        >
                          <p className="leading-relaxed text-sm">{m.text}</p>
                          <p
                            className={`mt-1 text-[11px] ${
                              m.sender === "user"
                                ? "text-gray-400"
                                : "text-white/70"
                            }`}
                          >
                            {m.timestamp.toLocaleTimeString("fa-IR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-end">
                        <div
                          className="p-3 rounded-2xl rounded-bl-md text-white shadow-md flex gap-1"
                          style={{ backgroundColor: primaryColor }}
                        >
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
                    )}
                    {showQuickQuestions && messages.length <= 1 && (
                      <div className="space-y-3">
                        <p className="text-gray-600 text-center text-sm">
                          سوالات پرتکرار:
                        </p>
                        {quickQuestions.map((q, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickQuestion(q)}
                            className="w-full text-right bg-white text-black border border-gray-200 rounded-xl p-3 text-sm hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all"
                          >
                            {q}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ورودی */}
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
                    className="flex-1 border placeholder:text-gray-400 text-black border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputValue.trim()}
                    className="rounded-xl flex items-center justify-center text-white w-12 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, #01ae9b)`,
                    }}
                  >
                    <FiSend className="w-4 h-4" />
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
