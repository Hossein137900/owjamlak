"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiShield,
  FiFileText,
  FiUsers,
  FiDollarSign,
  FiHome,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import Link from "next/link";

const termsData = [
  {
    id: "general",
    title: "شرایط عمومی",
    icon: <FiFileText />,
    content: [
      {
        subtitle: "تعاریف",
        text: "در این قوانین، منظور از «شرکت» یا «املاک ایران»، شرکت مشاوره املاک است که خدمات خرید، فروش، اجاره و مشاوره املاک را ارائه می‌دهد. منظور از «مشتری» یا «کاربر»، هر شخص حقیقی یا حقوقی است که از خدمات این شرکت استفاده می‌کند.",
      },
      {
        subtitle: "پذیرش قوانین",
        text: "با استفاده از خدمات املاک ایران، شما تأیید می‌کنید که این قوانین و مقررات را مطالعه کرده و با تمام بندهای آن موافقت دارید. در صورت عدم موافقت با هر یک از بندها، از استفاده از خدمات خودداری نمایید.",
      },
      {
        subtitle: "تغییرات قوانین",
        text: "شرکت حق تغییر، اصلاح یا به‌روزرسانی این قوانین را در هر زمان محفوظ می‌دارد. تغییرات از طریق وب‌سایت اعلام شده و از تاریخ انتشار قابل اجرا خواهد بود.",
      },
    ],
  },
  {
    id: "services",
    title: "خدمات و تعهدات",
    icon: <FiHome />,
    content: [
      {
        subtitle: "خدمات ارائه شده",
        text: "املاک ایران خدمات مشاوره املاک شامل خرید، فروش، اجاره، ارزیابی، مشاوره حقوقی، و کمک در تنظیم قراردادها را ارائه می‌دهد. تمام خدمات بر اساس استانداردهای حرفه‌ای و قوانین مربوطه انجام می‌شود.",
      },
      {
        subtitle: "تعهدات شرکت",
        text: "شرکت متعهد است اطلاعات دقیق و به‌روز از املاک ارائه دهد، مشاوره صادقانه و حرفه‌ای ارائه کند، و منافع مشتری را در اولویت قرار دهد. همچنین حفظ اطلاعات شخصی مشتریان از تعهدات اصلی شرکت است.",
      },
      {
        subtitle: "محدودیت‌های خدمات",
        text: "شرکت در قبال تغییرات قیمت بازار، تصمیمات شخصی مشتری، یا عوامل خارج از کنترل مسئولیتی ندارد. همچنین تضمین فروش یا خرید در زمان مشخص ارائه نمی‌شود.",
      },
    ],
  },
  {
    id: "customer",
    title: "حقوق و تعهدات مشتری",
    icon: <FiUsers />,
    content: [
      {
        subtitle: "حقوق مشتری",
        text: "مشتری حق دریافت اطلاعات دقیق و کامل از ملک، مشاوره رایگان اولیه، بازدید از ملک، دریافت گزارش ارزیابی، و لغو قرارداد در مهلت قانونی را دارد.",
      },
      {
        subtitle: "تعهدات مشتری",
        text: "مشتری موظف است اطلاعات صحیح و کامل ارائه دهد، مدارک معتبر ارائه کند، هزینه‌های توافق شده را پرداخت نماید، و از قوانین و مقررات پیروی کند.",
      },
      {
        subtitle: "ممنوعیت‌ها",
        text: "مشتری نمی‌تواند اطلاعات نادرست ارائه دهد، از خدمات برای اهداف غیرقانونی استفاده کند، یا حقوق مالکیت معنوی شرکت را نقض نماید.",
      },
    ],
  },
  {
    id: "financial",
    title: "شرایط مالی",
    icon: <FiDollarSign />,
    content: [
      {
        subtitle: "هزینه‌های خدمات",
        text: "هزینه‌های خدمات بر اساس تعرفه‌های مصوب اتحادیه مشاوران املاک محاسبه می‌شود. مشاوره اولیه رایگان بوده و سایر هزینه‌ها قبل از ارائه خدمات اعلام می‌شود.",
      },
      {
        subtitle: "نحوه پرداخت",
        text: "پرداخت‌ها به صورت نقدی، کارت به کارت، یا از طریق درگاه‌های پرداخت معتبر امکان‌پذیر است. برای پروژه‌های بزرگ امکان پرداخت اقساطی وجود دارد.",
      },
      {
        subtitle: "استرداد وجه",
        text: "در صورت عدم ارائه خدمات توافق شده یا نقص در خدمات، مشتری حق استرداد وجه را دارد. درخواست استرداد باید کتباً و با دلایل موجه ارائه شود.",
      },
    ],
  },
  {
    id: "privacy",
    title: "حریم خصوصی",
    icon: <FiShield />,
    content: [
      {
        subtitle: "جمع‌آوری اطلاعات",
        text: "شرکت اطلاعات شخصی مشتریان را تنها برای ارائه خدمات و بهبود کیفیت جمع‌آوری می‌کند. این اطلاعات شامل نام، شماره تماس، آدرس، و اطلاعات مالی مرتبط است.",
      },
      {
        subtitle: "استفاده از اطلاعات",
        text: "اطلاعات جمع‌آوری شده صرفاً برای ارائه خدمات، ارتباط با مشتری، و بهبود خدمات استفاده می‌شود. هیچ‌گونه اطلاعات شخصی بدون اجازه مشتری به اشخاص ثالث ارائه نمی‌شود.",
      },
      {
        subtitle: "امنیت اطلاعات",
        text: "شرکت از روش‌های امنیتی پیشرفته برای حفاظت از اطلاعات مشتریان استفاده می‌کند و متعهد است این اطلاعات را در برابر دسترسی غیرمجاز محافظت نماید.",
      },
    ],
  },
  {
    id: "legal",
    title: "مسائل حقوقی",
    icon: <FiAlertCircle />,
    content: [
      {
        subtitle: "قانون حاکم",
        text: "این قرارداد تحت قوانین جمهوری اسلامی ایران تنظیم شده و هرگونه اختلاف بر اساس قوانین کشور حل و فصل خواهد شد.",
      },
      {
        subtitle: "حل اختلاف",
        text: "در صورت بروز اختلاف، ابتدا تلاش برای حل مسالمت‌آمیز انجام می‌شود. در صورت عدم توافق، موضوع به مراجع قضایی صالح ارجاع خواهد شد.",
      },
      {
        subtitle: "مسئولیت‌ها",
        text: "مسئولیت شرکت محدود به میزان خدمات ارائه شده بوده و شامل خسارات غیرمستقیم یا تبعی نمی‌شود. حداکثر مسئولیت برابر با مبلغ دریافتی بابت خدمات است.",
      },
    ],
  },
];

const TermsAndConditions = () => {
  const [openSection, setOpenSection] = useState<string | null>("general");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen   py-30" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div {...fadeIn} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-[#01ae9b]/10 rounded-full">
              <FiFileText className="w-8 h-8 text-[#01ae9b]" />
            </div>
          </div>
          <h1 className="md:text-4xl text-2xl font-bold text-gray-800 mb-4">
            قوانین و مقررات املاک اوج
          </h1>
          <p className="md:text-lg text-sm text-gray-600 max-w-2xl mx-auto">
            لطفاً قوانین و مقررات استفاده از خدمات املاک اوج را با دقت مطالعه
            فرمایید
          </p>
          <div className="mt-6 text-sm text-gray-500">
            آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-4 mb-8">
          {termsData.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-right p-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      openSection === section.id
                        ? "bg-[#01ae9b]/10 text-[#01ae9b]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {section.title}
                  </h2>
                </div>
                <motion.div
                  animate={{ rotate: openSection === section.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    openSection === section.id
                      ? "bg-[#01ae9b]/10 text-[#01ae9b]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FiChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="space-y-6 pt-6">
                        {section.content.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: itemIndex * 0.1,
                            }}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <FiCheckCircle className="text-[#01ae9b] w-5 h-5" />
                              {item.subtitle}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-justify">
                              {item.text}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">
                نکته مهم
              </h3>
              <p className="text-amber-700 leading-relaxed">
                این قوانین و مقررات بخشی جدایی‌ناپذیر از قرارداد خدمات محسوب
                می‌شود. با استفاده از خدمات املاک ایران، شما تأیید می‌کنید که
                این مقررات را مطالعه کرده و با آن‌ها موافقت دارید. در صورت
                هرگونه سؤال یا ابهام، لطفاً با تیم پشتیبانی ما تماس بگیرید.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Acceptance Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#01ae9b] border-2 border-gray-300 rounded focus:ring-[#01ae9b] focus:ring-2"
            />
            <label
              htmlFor="acceptTerms"
              className="text-gray-700 leading-relaxed cursor-pointer"
            >
              تأیید می‌کنم که قوانین و مقررات فوق را مطالعه کرده‌ام و با تمام
              بندهای آن موافقت دارم. همچنین متعهد می‌شوم که از خدمات املاک ایران
              مطابق با این مقررات استفاده کنم.
            </label>
          </div>

          {acceptedTerms && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-green-700">
                <FiCheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  با تشکر! شما قوانین و مقررات را پذیرفته‌اید.
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#01ae9b] text-white rounded-lg hover:bg-[#018a7a] transition-colors duration-200 font-medium"
            >
              بازگشت به صفحه اصلی
            </Link>
            <Link
              href="/contactUs"
              className="px-6 py-3 border-2 border-[#01ae9b] text-[#01ae9b] rounded-lg hover:bg-[#01ae9b] hover:text-white transition-colors duration-200 font-medium"
            >
              تماس با ما
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
