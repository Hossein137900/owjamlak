"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { AnimatePresence, motion } from "framer-motion";
import {
  FaBalanceScale,
  FaArrowLeft,
  FaCheck,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";
import ContactForm, {
  CustomFormData,
  FormSubmissionResponse,
} from "./contactForm";

// Define the interface for Legal Consultation form data
interface LegalConsultationFormData extends CustomFormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  description: string;
  type: "Contract" | "Solve" | "DocumentReview" | "Other";
  urgency: "Low" | "Medium" | "High";
  caseDetails: string;
  preferredContactTime: string;
  hasDocuments: boolean;
  documentTypes: string;
  budget: number;
  previousLegalAction: boolean;
  courtLocation: string;
}

interface FormValidationErrors {
  [key: string]: string;
}

const legalFaqs = [
  {
    question: "چه مدارکی برای مشاوره حقوقی نیاز است؟",
    answer:
      "برای مشاوره حقوقی اولیه، نیازی به مدارک خاصی نیست. اما برای بررسی دقیق‌تر، به اسناد مالکیت، قراردادهای قبلی، و سایر مدارک مرتبط با موضوع نیاز خواهد بود که کارشناسان ما در جلسه اول به شما اعلام می‌کنند.",
  },
  {
    question: "هزینه مشاوره حقوقی چقدر است؟",
    answer:
      "هزینه مشاوره بسته به نوع خدمات و پیچیدگی موضوع متفاوت است. جلسه اول مشاوره به صورت رایگان برگزار می‌شود و پس از آن، هزینه‌ها بر اساس نوع خدمات مورد نیاز به شما اعلام خواهد شد.",
  },
  {
    question: "نحوه پرداخت هزینه مشاوره چگونه است؟",
    answer:
      "پرداخت هزینه‌ها به صورت نقدی، کارت به کارت، یا از طریق درگاه‌های پرداخت آنلاین امکان‌پذیر است. همچنین امکان پرداخت اقساطی برای پروژه‌های بزرگ نیز وجود دارد.",
  },
  {
    question: "آیا امکان مشاوره آنلاین وجود دارد؟",
    answer:
      "بله، ما امکان مشاوره آنلاین از طریق تماس تصویری یا تلفنی را فراهم کرده‌ایم تا در هر کجا که هستید بتوانید از خدمات حقوقی ما بهره‌مند شوید. همچنین امکان ارسال مدارک به صورت دیجیتال نیز وجود دارد.",
  },
  {
    question: "مدت زمان رسیدگی به پرونده چقدر است؟",
    answer:
      "مدت زمان رسیدگی بسته به نوع و پیچیدگی پرونده متفاوت است. پرونده‌های ساده معمولاً در کمتر از یک هفته بررسی می‌شوند، اما پرونده‌های پیچیده ممکن است چندین هفته زمان نیاز داشته باشند.",
  },
  {
    question: "آیا مشاوره شما شامل نمایندگی در دادگاه می‌شود؟",
    answer:
      "بله، تیم وکلای ما آماده نمایندگی از شما در دادگاه‌های مختلف هستند. این خدمات شامل تنظیم لوایح، حضور در جلسات دادگاه، و پیگیری کامل پرونده تا رسیدن به نتیجه نهایی می‌باشد.",
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
    <div className="bg-green-100 text-green-600 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function LegalConsultationPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleFormSubmit = async (
    formData: CustomFormData
  ): Promise<FormSubmissionResponse> => {
    // Cast the formData to LegalConsultationFormData for type safety
    const legalData = formData as LegalConsultationFormData;

    // Validate required fields according to the model
    const errors: FormValidationErrors = {};

    // Check required fields
    if (!legalData.name?.toString().trim()) {
      errors.name = "نام الزامی است";
    }
    if (!legalData.lastName?.toString().trim()) {
      errors.lastName = "نام خانوادگی الزامی است";
    }
    if (!legalData.phone?.toString().trim()) {
      errors.phone = "شماره تماس الزامی است";
    }
    if (!legalData.description?.toString().trim()) {
      errors.description = "توضیحات الزامی است";
    }
    if (!legalData.type) {
      errors.type = "نوع مشاوره الزامی است";
    }

    // Validate phone format (Iranian mobile number format)
    if (
      legalData.phone &&
      !/^(\+98|0)?9\d{9}$/.test(legalData.phone.toString().replace(/\s/g, ""))
    ) {
      errors.phone = "فرمت شماره تماس صحیح نیست";
    }

    // Validate email format if provided
    if (
      legalData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(legalData.email.toString())
    ) {
      errors.email = "فرمت ایمیل صحیح نیست";
    }

    // Validate type is one of the allowed enum values
    const allowedTypes: LegalConsultationFormData["type"][] = [
      "Contract",
      "Solve",
      "DocumentReview",
      "Other",
    ];
    if (legalData.type && !allowedTypes.includes(legalData.type)) {
      errors.type = "نوع مشاوره نامعتبر است";
    }

    // Validate urgency if provided
    if (
      legalData.urgency &&
      !["Low", "Medium", "High"].includes(legalData.urgency)
    ) {
      errors.urgency = "سطح اولویت نامعتبر است";
    }

    // Validate budget is a positive number if provided
    if (legalData.budget !== undefined && legalData.budget !== null) {
      if (isNaN(Number(legalData.budget)) || Number(legalData.budget) < 0) {
        errors.budget = "بودجه باید عدد مثبت باشد";
      }
    }

    // Validate name and lastName length
    if (legalData.name && legalData.name.toString().length < 2) {
      errors.name = "نام باید حداقل 2 کاراکتر باشد";
    }
    if (legalData.lastName && legalData.lastName.toString().length < 2) {
      errors.lastName = "نام خانوادگی باید حداقل 2 کاراکتر باشد";
    }

    // Validate description length
    if (legalData.description && legalData.description.toString().length < 10) {
      errors.description = "توضیحات باید حداقل 10 کاراکتر باشد";
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return { success: false, errors };
    }

    try {
      // Prepare data for API according to the model
      const apiData = {
        name: legalData.name.toString(),
        lastName: legalData.lastName.toString(),
        phone: legalData.phone.toString(),
        email: legalData.email?.toString() || "",
        description: legalData.description.toString(),
        type: legalData.type.toString(),
      };

      console.log("Sending legal consultation API data:", apiData);

      // Submit to API
      const response = await fetch("/api/legal-request", {
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
        toast.success("درخواست مشاوره حقوقی شما با موفقیت ثبت شد");
        setFormSubmitted(true);

        return {
          success: true,
          message: "درخواست مشاوره حقوقی شما با موفقیت ثبت شد",
        };
      } else {
        // Handle different error scenarios
        const errorMessage =
          result.message || "خطا در ثبت درخواست مشاوره حقوقی";
        toast.error(errorMessage);

        return {
          success: false,
          errors: result.errors || { general: errorMessage },
        };
      }
    } catch (error) {
      console.log("Error submitting legal consultation form:", error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error
          ? `خطا در ارسال فرم: ${error.message}`
          : "خطای غیرمنتظره در ارسال فرم";

      toast.error(errorMessage);

      return {
        success: false,
        errors: { general: errorMessage },
      };
    }
  };

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
                <FaBalanceScale size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                مشاوره حقوقی املاک
              </h1>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              تیم حقوقی ما متشکل از وکلا و کارشناسان با تجربه در زمینه حقوق
              املاک آماده ارائه مشاوره و خدمات حقوقی در تمامی مراحل معاملات ملکی
              به شما هستند. از تنظیم قرارداد تا حل اختلافات، ما در کنار شما
              هستیم.
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
              src="/assets/images/hero.jpg"
              alt="مشاوره حقوقی املاک"
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
            خدمات حقوقی ما
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ServiceFeature
              icon={<FaFileAlt />}
              title="تنظیم و بررسی قراردادها"
              description="تنظیم انواع قراردادهای خرید، فروش، رهن و اجاره با رعایت تمامی جوانب حقوقی و قانونی"
            />
            <ServiceFeature
              icon={<FaCheck />}
              title="استعلام و بررسی اسناد"
              description="بررسی اصالت اسناد ملکی، استعلام از مراجع ذیربط و اطمینان از صحت معاملات"
            />
            <ServiceFeature
              icon={<FaInfoCircle />}
              title="حل اختلافات ملکی"
              description="مشاوره و وکالت در پرونده‌های حقوقی مربوط به اختلافات ملکی و دعاوی مرتبط"
            />
            <ServiceFeature
              icon={<FaUser />}
              title="نمایندگی حقوقی"
              description="نمایندگی حقوقی در مراجع قضایی، ثبتی و اداری برای پیگیری امور ملکی"
            />
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            فرآیند مشاوره حقوقی
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
                  بررسی موضوع حقوقی و ارائه راهنمایی‌های اولیه رایگان
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  بررسی مدارک
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  بررسی دقیق اسناد و مدارک مربوط به پرونده شما
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  تدوین استراتژی
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  تدوین بهترین استراتژی حقوقی برای حل موضوع شما
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm relative z-10">
                <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800 mb-2">
                  اجرا و پیگیری
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  اجرای استراتژی و پیگیری تا رسیدن به نتیجه مطلوب
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          variants={fadeIn}
          className="bg-gray-50 p-6 rounded-xl mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            چرا مشاوره حقوقی ما؟
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-green-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">
                تیم متخصص
              </h3>
              <p className="text-gray-600 text-sm">
                تیم ما متشکل از وکلا و کارشناسان با تجربه در زمینه حقوق املاک
                است.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-green-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">
                پاسخگویی سریع
              </h3>
              <p className="text-gray-600 text-sm">
                ما در کوتاه‌ترین زمان ممکن به درخواست‌های مشاوره شما پاسخ
                می‌دهیم.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-green-600 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-black text-lg mb-2">
                قیمت منصفانه
              </h3>
              <p className="text-gray-600 text-sm">
                خدمات حقوقی ما با قیمت‌های منصفانه و متناسب با نیاز شما ارائه
                می‌شود.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        {/* <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            نظرات مشتریان ما
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/assets/images/hero.jpg"
                  alt="احمد رضایی"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">احمد رضایی</h4>
                  <p className="text-gray-500 text-sm">مالک ملک</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                مشاوره حقوقی عالی و دقیق. در حل اختلاف ملکی من کمک شایانی کردند
                و توانستم به حق خود برسم.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/assets/images/hero4.jpg"
                  alt="فاطمه احمدی"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">فاطمه احمدی</h4>
                  <p className="text-gray-500 text-sm">خریدار ملک</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                قرارداد خرید خانه‌ام را با دقت و تخصص تنظیم کردند. از حرفه‌ای
                بودن تیم حقوقی بسیار راضی هستم.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/assets/images/hero.jpg"
                  alt="محمد کریمی"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">محمد کریمی</h4>
                  <p className="text-gray-500 text-sm">سرمایه‌گذار</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                در بررسی اسناد ملک سرمایه‌گذاری‌ام دقت فوق‌العاده‌ای داشتند و از
                خرید ملک مشکل‌دار جلوگیری کردند.
              </p>
            </div>
          </div>
        </motion.div> */}

        {/* Contact Form */}
        <motion.div
          id="contact-form"
          variants={fadeIn}
          className="bg-white           p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            درخواست مشاوره حقوقی
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
                کارشناسان حقوقی ما در اسرع وقت با شما تماس خواهند گرفت.
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
              serviceTypes="legal"
              primaryColor="green"
              fields={[
                {
                  name: "name",
                  label: "نام",
                  type: "text",
                  icon: <FaUser />,
                  required: true,
                  validation: {
                    minLength: 2,
                    maxLength: 50,
                  },
                },
                {
                  name: "lastName",
                  label: "نام خانوادگی",
                  type: "text",
                  icon: <FaUser />,
                  required: true,
                  validation: {
                    minLength: 2,
                    maxLength: 50,
                  },
                },
                {
                  name: "phone",
                  label: "شماره تماس",
                  type: "tel",
                  icon: <FaPhone />,
                  required: true,
                  placeholder: "09123456789",
                  validation: {
                    pattern: /^(\+98|0)?9\d{9}$/,
                  },
                },
                {
                  name: "email",
                  label: "ایمیل",
                  type: "email",
                  icon: <FaEnvelope />,
                  required: false,
                  placeholder: "example@email.com",
                },
                {
                  name: "type",
                  label: "نوع مشاوره",
                  type: "select",
                  icon: <FaBalanceScale />,
                  options: [
                    { value: "Contract", label: "تنظیم قرارداد" },
                    { value: "Solve", label: "حل اختلاف" },
                    { value: "DocumentReview", label: "بررسی اسناد" },
                    { value: "Other", label: "سایر موارد" },
                  ],
                  required: true,
                },

                {
                  name: "description",
                  label: "توضیحات کامل پرونده",
                  type: "textarea",
                  icon: <FaFileAlt />,
                  required: true,
                  placeholder:
                    "لطفاً جزئیات کامل موضوع حقوقی خود را شرح دهید...",
                  validation: {
                    minLength: 10,
                    maxLength: 1000,
                  },
                },

                {
                  name: "previousLegalAction",
                  label: "آیا قبلاً اقدام حقوقی انجام داده‌اید؟",
                  type: "select",
                  icon: <FaBalanceScale />,
                  options: [
                    { value: "yes", label: "بله" },
                    { value: "no", label: "خیر" },
                  ],
                  required: false,
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
            {legalFaqs.map((faq, index) => (
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
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-content-${index}`}
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
                      id={`faq-content-${index}`}
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
              href="tel:02177222007"
              className="text-[#01ae9b] font-medium hover:underline"
            >
                با کارشناسان حقوقی ما تماس بگیرید
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={fadeIn}
          className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            اطلاعات تماس
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
                <FaPhone size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">تماس تلفنی</h3>
              <p className="text-gray-600">021-12345678</p>
              <p className="text-gray-600">09120000000</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
                <FaEnvelope size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">ایمیل</h3>
              <p className="text-gray-600">legal@amalak.com</p>
              <p className="text-gray-600">info@amalak.com</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
                <FaInfoCircle size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">ساعات کاری</h3>
              <p className="text-gray-600">شنبه تا چهارشنبه: 8-17</p>
              <p className="text-gray-600">پنج‌شنبه: 8-13</p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          variants={fadeIn}
          className="mt-8 bg-red-50 border border-red-200 p-4 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 text-red-600 p-2 rounded-full">
              <FaPhone size={16} />
            </div>
            <h3 className="font-semibold text-red-800">تماس اضطراری</h3>
          </div>
          <p className="text-red-700 text-sm">
            برای موارد فوری و خارج از ساعات اداری: 09120000000
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}

// Additional helper functions for the component
export const legalConsultationUtils = {
  // Format phone number for display
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("09")) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(
        7
      )}`;
    }
    return phone;
  },

  // Validate Iranian national code (if needed for legal forms)
  validateNationalCode: (code: string): boolean => {
    if (!/^\d{10}$/.test(code)) return false;
    const check = parseInt(code[9]);
    const sum = code
      .slice(0, 9)
      .split("")
      .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
    const remainder = sum % 11;
    return remainder < 2 ? check === remainder : check === 11 - remainder;
  },

  // Get urgency level color
  getUrgencyColor: (urgency: LegalConsultationFormData["urgency"]): string => {
    switch (urgency) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  },

  // Get consultation type label in Persian
  getConsultationTypeLabel: (
    type: LegalConsultationFormData["type"]
  ): string => {
    const typeLabels: Record<LegalConsultationFormData["type"], string> = {
      Contract: "تنظیم قرارداد",
      Solve: "حل اختلاف",
      DocumentReview: "بررسی اسناد",
      Other: "سایر موارد",
    };
    return typeLabels[type] || type;
  },

  // Sanitize and validate form data before submission
  sanitizeFormData: (
    data: Partial<LegalConsultationFormData>
  ): Partial<LegalConsultationFormData> => {
    return {
      ...data,
      name: data.name?.toString().trim(),
      lastName: data.lastName?.toString().trim(),
      phone: data.phone?.toString().replace(/\D/g, ""),
      email: data.email?.toString().trim().toLowerCase(),
      description: data.description?.toString().trim(),
      caseDetails: data.caseDetails?.toString().trim(),
      courtLocation: data.courtLocation?.toString().trim(),
    };
  },

  // Generate form submission payload for API
  generateSubmissionPayload: (formData: LegalConsultationFormData) => {
    return {
      personalInfo: {
        name: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
      },
      consultationDetails: {
        type: formData.type,
        description: formData.description,
        urgency: formData.urgency || "Medium",
        caseDetails: formData.caseDetails,
        budget: formData.budget,
      },
      preferences: {
        preferredContactTime: formData.preferredContactTime,
        hasDocuments: formData.hasDocuments,
        previousLegalAction: formData.previousLegalAction,
        courtLocation: formData.courtLocation,
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        serviceType: "legal-consultation",
        source: "website-form",
      },
    };
  },
};

// Export types for use in other components
export type { LegalConsultationFormData, FormValidationErrors };

// Default export
