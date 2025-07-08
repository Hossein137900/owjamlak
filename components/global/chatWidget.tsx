"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
    default:
      "سوال شما دریافت شد. تیم پشتیبانی ما در اسرع وقت با شما تماس خواهد گرفت. آیا سوال دیگری دارید؟",
  };

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: "سلام! به پنل مدیریت املاک خوش آمدید. چطور می‌توانم کمکتان کنم؟",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

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
    <div className={`fixed ${positionClasses[position]} z-50`} dir="rtl">
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
            className={`relative w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white overflow-hidden ${
              isOpen ? "hidden" : ""
            } group`}
            style={{ backgroundColor: primaryColor }}
          >
            {/* Gradient overlay */}

            {/* Icon */}
            <FiMessageCircle className="w-7 h-7 relative z-10" />

            {/* Pulse animation */}

            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
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
                      پشتیبانی آنلاین
                    </h3>
                    <p
                      className={`opacity-90 ${
                        isMobile ? "text-base" : "text-sm"
                      }`}
                    >
                      همیشه در خدمت شما
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

            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto space-y-4 bg-gray-50 ${
                isMobile ? "p-6" : "p-4"
              }`}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl ${
                      isMobile ? "p-4" : "p-3"
                    } ${
                      message.sender === "user"
                        ? "bg-white text-gray-800 rounded-br-md"
                        : "text-white rounded-bl-md"
                    }`}
                    style={{
                      backgroundColor:
                        message.sender === "bot" ? primaryColor : undefined,
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
                      className={`mt-1 ${isMobile ? "text-sm" : "text-xs"} ${
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
                    className={`rounded-2xl rounded-bl-md text-white ${
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
                        hover:border-purple-300 hover:bg-purple-50 transition-all duration-200
                        ${isMobile ? "p-4 text-base" : "p-3 text-sm"}
                      `}
                    >
                      {question}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
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
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isMobile ? "w-14 h-14" : "w-12 h-12"}
                  `}
                  style={{ backgroundColor: primaryColor }}
                >
                  <FiSend className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
