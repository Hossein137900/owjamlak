"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "چگونه می‌توانم ملک خود را برای فروش در سایت شما ثبت کنم؟",
    answer:
      "برای ثبت ملک خود، ابتدا در سایت ثبت‌نام کنید و سپس از طریق پنل کاربری، گزینه «ثبت ملک جدید» را انتخاب کنید. اطلاعات ملک خود را وارد کرده و تصاویر مناسب آپلود کنید. پس از تایید کارشناسان ما، ملک شما در سایت نمایش داده خواهد شد.",
  },
  {
    question: "آیا برای مشاوره املاک باید هزینه‌ای پرداخت کنم؟",
    answer:
      "مشاوره اولیه در املاک ما کاملاً رایگان است. کارشناسان ما آماده پاسخگویی به سوالات شما هستند. هزینه‌های کارشناسی و خدمات تخصصی طبق تعرفه‌های مشخص شده دریافت می‌شود که قبل از ارائه خدمات، به اطلاع شما خواهد رسید.",
  },
  {
    question: "مدارک لازم برای خرید یا اجاره ملک چیست؟",
    answer:
      "برای خرید ملک، مدارک هویتی (شناسنامه و کارت ملی)، گواهی عدم چک برگشتی، و توانایی مالی لازم است. برای اجاره نیز علاوه بر مدارک هویتی، معرفی‌نامه شغلی، چک یا سفته به عنوان ضمانت، و ودیعه مورد نیاز است. کارشناسان ما در هر مرحله راهنمایی‌های لازم را ارائه می‌دهند.",
  },
  {
    question: "آیا املاک شما در سراسر کشور شعبه دارد؟",
    answer:
      "بله، املاک ما در اکثر شهرهای بزرگ کشور دارای شعبه است. در حال حاضر در تهران، مشهد، اصفهان، شیراز، تبریز و کرج شعبه‌های فعال داریم و به زودی در سایر شهرها نیز گسترش خواهیم یافت.",
  },
  {
    question: "چگونه می‌توانم از قیمت روز املاک در منطقه مورد نظرم مطلع شوم؟",
    answer:
      "شما می‌توانید از طریق بخش «قیمت‌گذاری هوشمند» در سایت ما، منطقه مورد نظر خود را جستجو کنید و از میانگین قیمت املاک در آن منطقه مطلع شوید. همچنین می‌توانید با کارشناسان ما تماس بگیرید تا اطلاعات دقیق‌تری در اختیار شما قرار دهند.",
  },
  {
    question: "آیا امکان بازدید از ملک قبل از خرید یا اجاره وجود دارد؟",
    answer:
      "بله، قطعاً. ما همواره توصیه می‌کنیم قبل از هرگونه تصمیم‌گیری، از ملک مورد نظر بازدید کنید. کارشناسان ما هماهنگی‌های لازم را انجام می‌دهند و در صورت تمایل، یکی از مشاوران ما می‌تواند شما را در بازدید همراهی کند.",
  },
];

const ContactFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            سوالات <span className="text-[#01ae9b]">متداول</span>
          </h2>
          <p className="text-gray-600 mt-2">
            پاسخ به سوالات رایج شما درباره خدمات املاک
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-right p-5 flex justify-between items-center"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {faq.question}
                </h3>
                <div
                  className={`p-2 rounded-full transition-colors ${
                    openIndex === index
                      ? "bg-[#01ae9b]/10 text-[#01ae9b]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {openIndex === index ? (
                    <FiMinus size={18} />
                  ) : (
                    <FiPlus size={18} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-2 border-t border-gray-100">
                      <h4 className="text-gray-600">{faq.answer}</h4>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            سوال دیگری دارید؟{" "}
            <a
              href="tel:02177222007"
              className="text-[#01ae9b] font-medium hover:underline"
            >
              با ما تماس بگیرید
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactFaq;
