"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHome,
  FaArrowLeft,
  FaCheck,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaSearchLocation,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";
import ContactForm, { CustomFormData } from "./contactForm";
import toast from "react-hot-toast";

interface RealEstateFormData extends CustomFormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  description: string;
  type: "Apartment" | "Villa" | "EmptyEarth" | "Commercial" | "Other";
  serviceType: "Buy" | "Sell" | "Rent" | "Mortgage" | "Pricing";
  budget: number;
  location: string;
  area: number;
  rooms: number;
  preferredContactTime: string;
  urgency: "Low" | "Medium" | "High";
}

interface FormValidationErrors {
  [key: string]: string;
}

interface FormSubmissionResponse {
  success: boolean;
  errors?: FormValidationErrors;
  message?: string;
}

const realEstateFaqs = [
  {
    question: "هزینه مشاوره املاک چقدر است؟",
    answer:
      "مشاوره اولیه رایگان است. هزینه‌های بعدی بر اساس نوع خدمات (خرید، فروش، اجاره) و طبق تعرفه‌های رسمی اتحادیه مشاوران املاک محاسبه می‌شود.",
  },
  {
    question: "چگونه می‌توانم از قیمت واقعی ملک مطمئن شوم؟",
    answer:
      "کارشناسان ما با بررسی دقیق ملک، موقعیت آن، امکانات، متراژ و مقایسه با معاملات مشابه در منطقه، ارزیابی دقیقی از قیمت واقعی ملک ارائه می‌دهند.",
  },
  {
    question: "چه مدت طول می‌کشد تا ملک مناسب پیدا کنم؟",
    answer:
      "این زمان بسته به شرایط بازار، نیازهای شما و بودجه‌تان متفاوت است. معمولاً بین یک هفته تا یک ماه زمان نیاز است، اما ما تلاش می‌کنیم در کوتاه‌ترین زمان ممکن بهترین گزینه‌ها را به شما معرفی کنیم.",
  },
  {
    question: "آیا امکان بازدید از ملک قبل از تصمیم‌گیری وجود دارد؟",
    answer:
      "بله، قطعاً. ما همواره توصیه می‌کنیم قبل از هرگونه تصمیم‌گیری، از ملک مورد نظر بازدید کنید. کارشناسان ما هماهنگی‌های لازم را انجام می‌دهند و در صورت تمایل، یکی از مشاوران ما می‌تواند شما را در بازدید همراهی کند.",
  },
  {
    question: "مدارک لازم برای خرید ملک چیست؟",
    answer:
      "مدارک هویتی (شناسنامه و کارت ملی)، گواهی عدم چک برگشتی، فیش حقوقی یا گواهی درآمد، و در صورت نیاز به وام، مدارک مربوط به توانایی مالی مورد نیاز است. کارشناسان ما راهنمایی کاملی در این زمینه ارائه می‌دهند.",
  },
  {
    question: "آیا خدمات پس از فروش ارائه می‌دهید؟",
    answer:
      "بله، ما خدمات پس از فروش شامل راهنمایی برای انتقال سند، کمک در امور اداری، معرفی متخصصان بازسازی و تعمیرات، و پشتیبانی در حل مسائل احتمالی را ارائه می‌دهیم.",
  },
];

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ServiceFeature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    variants={fadeIn}
    className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="bg-gray-100 text-green-600 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function RealEstateConsultationPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleFormSubmit = async (
    formData: CustomFormData
  ): Promise<FormSubmissionResponse> => {
    setIsSubmitting(true);

    try {
      // Cast the formData to RealEstateFormData for type safety
      const realEstateData = formData as RealEstateFormData;

      // Validate required fields according to the model
      const errors: Record<string, string> = {};

      // Check required fields
      if (!realEstateData.name?.toString().trim())
        errors.name = "نام الزامی است";
      if (!realEstateData.lastName?.toString().trim())
        errors.lastName = "نام خانوادگی الزامی است";
      if (!realEstateData.phone?.toString().trim())
        errors.phone = "شماره تماس الزامی است";
      if (!realEstateData.description?.toString().trim())
        errors.description = "توضیحات الزامی است";
      if (!realEstateData.type) errors.type = "نوع ملک الزامی است";
      if (!realEstateData.serviceType)
        errors.serviceType = "نوع خدمات الزامی است";

      // Validate phone format (simple validation)
      if (
        realEstateData.phone &&
        !/^(0|\+98)?9\d{9}$/.test(realEstateData.phone.toString())
      ) {
        errors.phone = "فرمت شماره تماس صحیح نیست";
      }

      // Validate email format if provided
      if (
        realEstateData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(realEstateData.email.toString())
      ) {
        errors.email = "فرمت ایمیل صحیح نیست";
      }

      // If there are validation errors, return them
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      // Prepare data for API
      const apiData = {
        name: realEstateData.name.toString(),
        lastName: realEstateData.lastName.toString(),
        phone: realEstateData.phone.toString(),
        email: realEstateData.email?.toString() || "",
        description: realEstateData.description.toString(),
        type: realEstateData.type.toString(),
        serviceType: realEstateData.serviceType.toString(),
        budget: realEstateData.budget ? Number(realEstateData.budget) : 0,
      };

      console.log("Sending API data:", apiData);

      // Submit to API
      const response = await fetch("/api/real-state-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        toast.success("درخواست شما با موفقیت ثبت شد");
        setFormSubmitted(true);

        return {
          success: true,
        };
      } else {
        // Handle different error scenarios
        const errorMessage = result.message || "خطا در ثبت درخواست";
        toast.error(errorMessage);
        
        return {
          success: false,
          errors: result.errors || { general: errorMessage },
        };
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error 
        ? `خطا در ارسال فرم: ${error.message}` 
        : "خطای غیرمنتظره در ارسال فرم";
      
      toast.error(errorMessage);
      
      return {
        success: false,
        errors: {
          general: errorMessage,
        },
      };
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto mt-20" dir="rtl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col md:flex-row gap-6 mb-12"
        >
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <FaHome size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">مشاوره املاک</h1>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              تیم مشاوران املاک ما با سال‌ها تجربه در بازار مسکن، آماده ارائه
              بهترین خدمات مشاوره در زمینه خرید، فروش، رهن و اجاره املاک هستند.
              ما به شما کمک می‌کنیم تا بهترین انتخاب را با توجه به نیازها و
              بودجه خود داشته باشید.
            </p>
            <Link href="#contact-form">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                درخواست مشاوره
                <FaArrowLeft size={16} />
              </motion.button>
            </Link>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-auto rounded-xl overflow-hidden">
            <Image
              src="/assets/images/hero4.jpg"
              alt="مشاوره املاک"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </motion.div>

        {/* Services List */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            خدمات مشاوره املاک ما
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ServiceFeature
              icon={<FaSearchLocation />}
              title="جستجوی ملک"
              description="جستجو و معرفی املاک متناسب با نیازها و بودجه شما با بهترین موقعیت و شرایط"
            />
            <ServiceFeature
              icon={<FaMoneyBillWave />}
              title="ارزیابی قیمت"
              description="ارزیابی تخصصی قیمت ملک شما بر اساس موقعیت، متراژ، امکانات و شرایط بازار"
            />
            <ServiceFeature
              icon={<FaClipboardList />}
              title="مشاوره معاملات"
              description="مشاوره تخصصی در زمینه خرید، فروش، رهن و اجاره املاک با بهترین شرایط"
            />
            <ServiceFeature
              icon={<FaCheck />}
              title="بازدید ملک"
              description="هماهنگی و همراهی در بازدید از املاک مورد نظر و بررسی تخصصی شرایط ملک"
            />
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            فرآیند مشاوره املاک
          </h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="hidden md:block absolute left-0 right-0 top-24 h-1 bg-green-100 z-0"></div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  مشاوره اولیه
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  بررسی نیازها و خواسته‌های شما و ارائه راهنمایی‌های اولیه
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  جستجو و معرفی
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  جستجو و معرفی گزینه‌های مناسب بر اساس نیازهای شما
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  بازدید ملک
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  هماهنگی و همراهی در بازدید از املاک انتخاب شده
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  نهایی‌سازی معامله
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  مذاکره، تنظیم قرارداد و پیگیری امور تا نهایی شدن معامله
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          id="contact-form"
          variants={fadeIn}
          className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            درخواست مشاوره املاک
          </h2>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheck size={30} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                درخواست شما با موفقیت ثبت شد
              </h3>
              <p className="mb-4">
                کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                ثبت درخواست جدید
              </button>
            </motion.div>
          ) : (
            <ContactForm
              onSubmit={handleFormSubmit}
              serviceTypes="سس"
              primaryColor="green"
              isSubmitting={isSubmitting}
              fields={[
                {
                  name: "name",
                  label: "نام",
                  type: "text",
                  icon: <FaUser />,
                  required: true,
                },
                {
                  name: "lastName",
                  label: "نام خانوادگی",
                  type: "text",
                  icon: <FaUser />,
                  required: true,
                },
                {
                  name: "phone",
                  label: "شماره تماس",
                  type: "tel",
                  icon: <FaPhone />,
                  required: true,
                },
                {
                  name: "email",
                  label: "ایمیل",
                  type: "email",
                  icon: <FaEnvelope />,
                  required: false,
                },
                {
                  name: "type",
                  label: "نوع ملک",
                  type: "select",
                  icon: <FaHome />,
                  options: [
                    { value: "Apartment", label: "آپارتمان" },
                    { value: "Villa", label: "ویلا" },
                    { value: "EmptyEarth", label: "زمین" },
                    { value: "Commercial", label: "تجاری" },
                    { value: "Other", label: "سایر" },
                  ],
                  required: true,
                },
                {
                  name: "serviceType",
                  label: "نوع خدمات",
                  type: "select",
                  icon: <FaClipboardList />,
                  options: [
                    { value: "Buy", label: "خرید" },
                    { value: "Sell", label: "فروش" },
                    { value: "Rent", label: "اجاره" },
                    { value: "Mortgage", label: "رهن" },
                    { value: "Pricing", label: "قیمت گذاری" },
                  ],
                  required: true,
                },
                {
                  name: "budget",
                  label: "بودجه تقریبی (تومان)",
                  type: "number",
                  icon: <FaMoneyBillWave />,
                  required: false,
                },
                {
                  name: "description",
                  label: "توضیحات",
                  type: "textarea",
                  icon: <FaClipboardList />,
                  required: true,
                },
              ]}
            />
          )}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={fadeIn}
          className="mt-16 text-black"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            سوالات متداول
          </motion.h2>

          <div className="space-y-4">
            {realEstateFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-right p-5 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-800 pr-2">
                    {faq.question}
                  </h3>
                  <div
                    className={`p-2 rounded-full transition-all duration-300 ${
                      openIndex === index
                        ? "bg-[#01ae9b]/10 text-[#01ae9b] rotate-180"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <motion.svg
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      fill="none"
                      height="18"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="18"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </motion.svg>
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="p-5 pt-0 border-t border-gray-100"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
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
                href="tel:09120000000"
                className="text-[#01ae9b] font-medium hover:underline transition-all duration-200"
              >
                با مشاوران املاک ما تماس بگیرید
              </a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
