"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHandshake,
  FaArrowLeft,
  FaCheck,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaGraduationCap,
  FaBuilding,
  FaFileUpload,
} from "react-icons/fa";
import ContactForm, {
  CustomFormData,
  FormSubmissionResponse,
} from "./contactForm";
import toast from "react-hot-toast";
interface CollaborationFormData extends CustomFormData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  description: string;
  type: "Consultation" | "LegalConsultation" | "Investor" | "Others";
  education: "Diploma" | "Bachelor" | "Master" | "Phd";
  file: string | null;
  experience: string;
  availability: "FullTime" | "PartTime" | "Freelance";
  expectedSalary: number;
  startDate: string;
}

interface FormValidationErrors {
  [key: string]: string;
}
const collaborationFaqs = [
  {
    question: "شرایط پرداخت حقوق و پورسانت چگونه است؟",
    answer:
      "پرداخت حقوق به صورت ماهانه انجام می‌شود. پورسانت مشاوران بر اساس میزان فروش و عملکرد آنها محاسبه شده و به صورت ماهانه پرداخت می‌گردد. جزئیات بیشتر در جلسه مصاحبه به اطلاع شما خواهد رسید.",
  },
  {
    question: "آیا امکان همکاری به صورت پاره‌وقت وجود دارد؟",
    answer:
      "بله، ما شرایط همکاری به صورت پاره‌وقت را نیز فراهم کرده‌ایم. ساعات کاری و شرایط همکاری در جلسه مصاحبه مورد بررسی قرار خواهد گرفت.",
  },
  {
    question: "حداقل سرمایه برای همکاری به عنوان سرمایه‌گذار چقدر است؟",
    answer:
      "میزان سرمایه‌گذاری بسته به نوع پروژه متفاوت است. ما پروژه‌های متنوعی با سطوح مختلف سرمایه‌گذاری داریم. برای اطلاعات دقیق‌تر، درخواست خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند.",
  },
  {
    question: "چه مدارکی برای شروع همکاری نیاز است؟",
    answer:
      "مدارک هویتی (شناسنامه و کارت ملی)، مدرک تحصیلی، گواهی عدم سوء پیشینه، عکس شخصی، و رزومه کاری مورد نیاز است. برای سمت‌های تخصصی، مدارک و گواهینامه‌های مرتبط نیز ضروری است.",
  },
  {
    question: "آیا دوره‌های آموزشی برای همکاران جدید برگزار می‌شود؟",
    answer:
      "بله، ما دوره‌های آموزشی جامعی برای همکاران جدید در زمینه‌های مختلف املاک، فروش، مذاکره، و قوانین مرتبط برگزار می‌کنیم. این دوره‌ها به صورت رایگان و اجباری برای تمام همکاران جدید است.",
  },
  {
    question: "امکانات رفاهی و بیمه برای همکاران چگونه است؟",
    answer:
      "همکاران تمام‌وقت از بیمه تأمین اجتماعی، بیمه تکمیلی، پاداش عملکرد، مرخصی استحقاقی، و سایر مزایای رفاهی بهره‌مند می‌شوند. همکاران پاره‌وقت نیز بسته به نوع قرارداد از برخی مزایا استفاده خواهند کرد.",
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -10,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: { scale: 0.98 },
};

// Collaboration Card Component
const CollaborationCard = ({
  title,
  description,
  icon,
  benefits,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-xl overflow-hidden shadow-sm p-6 h-full flex flex-col"
    >
      <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <div className="mt-auto">
        <h4 className="font-semibold text-gray-700 mb-2">مزایا:</h4>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-gray-600 text-sm"
            >
              <FaCheck className="text-purple-500 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default function CollaborationPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleFormSubmit = async (
    formData: CustomFormData
  ): Promise<FormSubmissionResponse> => {
    // Cast the formData to CollaborationFormData for type safety
    const collaborationData = formData as CollaborationFormData;

    // Validate required fields according to the model
    const errors: FormValidationErrors = {};

    // Check required fields
    if (!collaborationData.name?.toString().trim()) {
      errors.name = "نام الزامی است";
    }
    if (!collaborationData.lastName?.toString().trim()) {
      errors.lastName = "نام خانوادگی الزامی است";
    }
    if (!collaborationData.phone?.toString().trim()) {
      errors.phone = "شماره تماس الزامی است";
    }
    if (!collaborationData.description?.toString().trim()) {
      errors.description = "توضیحات الزامی است";
    }
    // if (!collaborationData.file) {
    //   errors.file = "آپلود رزومه الزامی است";
    // }
    if (!collaborationData.type) {
      errors.type = "نوع همکاری الزامی است";
    }

    // Validate phone format (Iranian mobile number format)
    if (
      collaborationData.phone &&
      !/^(\+98|0)?9\d{9}$/.test(
        collaborationData.phone.toString().replace(/\s/g, "")
      )
    ) {
      errors.phone = "فرمت شماره تماس صحیح نیست";
    }

    // Validate email format if provided
    if (
      collaborationData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collaborationData.email.toString())
    ) {
      errors.email = "فرمت ایمیل صحیح نیست";
    }

    // Validate type is one of the allowed enum values
    const allowedTypes: CollaborationFormData["type"][] = [
      "Consultation",
      "LegalConsultation",
      "Investor",
      "Others",
    ];
    if (
      collaborationData.type &&
      !allowedTypes.includes(collaborationData.type)
    ) {
      errors.type = "نوع همکاری نامعتبر است";
    }

    // Validate education if provided
    if (
      collaborationData.education &&
      !["Diploma", "Bachelor", "Master", "Phd"].includes(
        collaborationData.education
      )
    ) {
      errors.education = "سطح تحصیلات نامعتبر است";
    }

    // Validate expected salary is a positive number if provided
    if (
      collaborationData.expectedSalary !== undefined &&
      collaborationData.expectedSalary !== null
    ) {
      if (
        isNaN(Number(collaborationData.expectedSalary)) ||
        Number(collaborationData.expectedSalary) < 0
      ) {
        errors.expectedSalary = "حقوق مورد انتظار باید عدد مثبت باشد";
      }
    }

    // Validate name and lastName length
    if (
      collaborationData.name &&
      collaborationData.name.toString().length < 2
    ) {
      errors.name = "نام باید حداقل 2 کاراکتر باشد";
    }
    if (
      collaborationData.lastName &&
      collaborationData.lastName.toString().length < 2
    ) {
      errors.lastName = "نام خانوادگی باید حداقل 2 کاراکتر باشد";
    }

    // Validate description length
    if (
      collaborationData.description &&
      collaborationData.description.toString().length < 10
    ) {
      errors.description = "توضیحات باید حداقل 10 کاراکتر باشد";
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return { success: false, errors };
    }

    try {
      // Prepare data for API according to the employRequest model
      const apiData = {
        name: collaborationData.name.toString(),
        lastName: collaborationData.lastName.toString(),
        phone: collaborationData.phone.toString(),
        email: collaborationData.email?.toString() || "",
        description: collaborationData.description.toString(),
        file: collaborationData.file,
        type: collaborationData.type.toString(),
        education: collaborationData.education?.toString() || "",
      };

      console.log("Sending collaboration API data:", apiData);

      // Submit to API
      const response = await fetch("/api/request", {
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
        toast.success("درخواست همکاری شما با موفقیت ثبت شد");
        setFormSubmitted(true);

        return {
          success: true,
          message: "درخواست همکاری شما با موفقیت ثبت شد",
        };
      } else {
        // Handle different error scenarios
        const errorMessage = result.message || "خطا در ثبت درخواست همکاری";
        toast.error(errorMessage);

        return {
          success: false,
          errors: result.errors || { general: errorMessage },
        };
      }
    } catch (error) {
      console.error("Error submitting collaboration form:", error);

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

  const collaborationTypes = [
    {
      title: "مشاور املاک",
      description:
        "به عنوان مشاور املاک با ما همکاری کنید و از مزایای کار در یک مجموعه حرفه‌ای بهره‌مند شوید.",
      icon: <FaBuilding size={24} />,
      benefits: [
        "دسترسی به شبکه گسترده مشتریان",
        "پورسانت رقابتی",
        "آموزش‌های تخصصی مستمر",
        "امکان پیشرفت شغلی",
      ],
    },
    {
      title: "کارشناس حقوقی",
      description:
        "به تیم حقوقی ما بپیوندید و در زمینه قراردادهای ملکی و مشاوره حقوقی فعالیت کنید.",
      icon: <FaBriefcase size={24} />,
      benefits: [
        "همکاری با تیم حقوقی متخصص",
        "حقوق و مزایای مناسب",
        "محیط کاری پویا و حرفه‌ای",
        "امکان ارتقاء شغلی",
      ],
    },
    {
      title: "سرمایه‌گذار",
      description:
        "در پروژه‌های ساختمانی و معاملات ملکی سودآور با ما سرمایه‌گذاری کنید.",
      icon: <FaHandshake size={24} />,
      benefits: [
        "بازدهی مناسب سرمایه",
        "مشاوره تخصصی در انتخاب پروژه",
        "نظارت دقیق بر روند اجرا",
        "تضمین بازگشت سرمایه",
      ],
    },
  ];

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
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                <FaHandshake size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">همکاری با ما</h1>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ما همواره به دنبال افراد با استعداد و متخصص برای همکاری هستیم. اگر
              به دنبال فرصت‌های شغلی در حوزه املاک هستید یا قصد سرمایه‌گذاری در
              این بخش را دارید، می‌توانید به تیم ما بپیوندید و از مزایای همکاری
              با یک مجموعه حرفه‌ای بهره‌مند شوید.
            </p>
            <Link href="#contact-form">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                ثبت درخواست همکاری
                <FaArrowLeft size={16} />
              </motion.button>
            </Link>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-auto rounded-xl overflow-hidden">
            <Image
              src="/assets/images/hero.jpg"
              alt="همکاری با ما"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </motion.div>

        {/* Collaboration Types */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            انواع همکاری
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {collaborationTypes.map((type, index) => (
              <CollaborationCard
                key={index}
                title={type.title}
                description={type.description}
                icon={type.icon}
                benefits={type.benefits}
              />
            ))}
          </div>
        </motion.div>

        {/* Why Work With Us */}
        <motion.div
          variants={fadeIn}
          className="mb-16 bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            چرا با ما همکاری کنید؟
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="bg-white text-purple-600 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  رشد و پیشرفت
                </h3>
                <p className="text-gray-600">
                  ما به رشد و پیشرفت همکاران خود اهمیت می‌دهیم و فرصت‌های آموزشی
                  و ارتقاء شغلی را فراهم می‌کنیم.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-white text-purple-600 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  محیط کاری پویا
                </h3>
                <p className="text-gray-600">
                  در یک محیط کاری پویا و حرفه‌ای فعالیت خواهید کرد که به نوآوری
                  و خلاقیت ارزش می‌دهد.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-white text-purple-600 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  درآمد مناسب
                </h3>
                <p className="text-gray-600">
                  سیستم پرداخت ما بر اساس عملکرد و تلاش شما طراحی شده و امکان
                  کسب درآمد بالا را فراهم می‌کند.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-white text-purple-600 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  اعتبار برند
                </h3>
                <p className="text-gray-600">
                  همکاری با یک برند معتبر در صنعت املاک، فرصت‌های بیشتری را برای
                  موفقیت شما فراهم می‌کند.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            شرایط همکاری
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-purple-600" />
                  شرایط عمومی
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      حداقل مدرک تحصیلی دیپلم
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      آشنایی با کامپیوتر و نرم‌افزارهای آفیس
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      روابط عمومی بالا و مهارت‌های ارتباطی قوی
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      تمایل به یادگیری و پیشرفت مداوم
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-purple-600" />
                  شرایط تخصصی
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      آشنایی با بازار املاک (برای مشاوران)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      مدرک تحصیلی مرتبط با حقوق (برای کارشناسان حقوقی)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      توانایی تحلیل بازار و ریسک (برای سرمایه‌گذاران)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      داشتن روحیه کار تیمی و مسئولیت‌پذیری
                    </span>
                  </li>
                </ul>
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
            فرم درخواست همکاری
          </h2>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-purple-50 border border-purple-200 text-purple-700 p-6 rounded-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaCheck size={30} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                درخواست شما با موفقیت ثبت شد
              </h3>
              <p className="mb-4">
                تیم ما درخواست شما را بررسی کرده و در اسرع وقت با شما تماس
                خواهند گرفت.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                ثبت درخواست جدید
              </button>
            </motion.div>
          ) : (
            <ContactForm
              onSubmit={handleFormSubmit}
              serviceTypes="collaboration"
              primaryColor="purple"
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
                  label: "نوع همکاری",
                  type: "select",
                  icon: <FaFileUpload />,

                  options: [
                    { value: "Consultation", label: "مشاور املاک" },
                    { value: "LegalConsultation", label: "کارشناس حقوقی" },
                    { value: "Investor", label: "سرمایه‌گذار" },
                    { value: "Others", label: "سایر موارد" },
                  ],
                  required: true,
                },
                {
                  name: "education",
                  label: "تحصیلات",
                  type: "select",
                  icon: <FaFileUpload />,

                  options: [
                    { value: "Diploma", label: "دیپلم" },
                    { value: "Bachelor", label: "کارشناسی" },
                    { value: "Master", label: "کارشناسی ارشد" },
                    { value: "Phd", label: "دکترا" },
                  ],
                  required: false,
                },
                {
                  name: "availability",
                  label: "نوع همکاری",
                  type: "select",
                  icon: <FaFileUpload />,
                  options: [
                    { value: "FullTime", label: "تمام وقت" },
                    { value: "PartTime", label: "پاره وقت" },
                    { value: "Freelance", label: "پروژه‌ای" },
                  ],
                  required: false,
                },
                {
                  name: "experience",
                  label: "سابقه کار (سال)",
                  type: "number",
                  icon: <FaBriefcase />,
                  required: false,
                  placeholder: "مثال: 5",
                  validation: {
                    min: 0,
                    max: 50,
                  },
                },
                {
                  name: "expectedSalary",
                  label: "حقوق مورد انتظار (تومان)",
                  type: "number",
                  icon: <FaBriefcase />,
                  required: false,
                  placeholder: "مثال: 15000000",
                  validation: {
                    min: 0,
                  },
                },
                // {
                //   name: "file",
                //   label: "آپلود رزومه",
                //   type: "file",
                //   icon: <FaFileUpload />,
                //   required: false,
                // },
                {
                  name: "description",
                  label: "توضیحات",
                  type: "textarea",
                  icon: <FaFileUpload />,
                  required: true,
                  placeholder:
                    "لطفاً درباره خود، تجربیات و انگیزه همکاری با ما بنویسید...",
                  validation: {
                    minLength: 10,
                    maxLength: 1000,
                  },
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
            {collaborationFaqs.map((faq, index) => (
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
                با تیم منابع انسانی ما تماس بگیرید
              </a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
export type { CollaborationFormData, FormValidationErrors };
