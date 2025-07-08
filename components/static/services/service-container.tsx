"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaHome,
  FaGavel,
  FaHandshake,
  FaArrowLeft,
  FaBuilding,
  FaFileContract,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

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

// Service Card Component
const ServiceCard = ({
  title,
  description,
  icon,
  image,
  link,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  link: string;
  color: string;
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-xl overflow-hidden shadow-sm h-full flex flex-col"
    >
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-${color}-900/70 to-transparent`}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className={`bg-white text-${color}-600 p-2 rounded-full`}>
              {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <Link href={link}>
          <motion.div
            whileHover={{ x: 5 }}
            className={`flex items-center justify-between text-${color}-600 font-medium mt-auto`}
          >
            <span>اطلاعات بیشتر</span>
            <FaArrowLeft size={14} />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default function ServicesPage() {
  const mainServices = [
    {
      title: "مشاوره املاک",
      description:
        "خدمات تخصصی در زمینه خرید، فروش، رهن و اجاره املاک با بهترین شرایط و قیمت",
      icon: <FaBuilding size={20} />,
      image: "/assets/images/hero.jpg",
      link: "/services/realEstateConsultation",
      color: "green",
    },
    {
      title: "مشاوره حقوقی",
      description:
        "مشاوره و خدمات حقوقی در زمینه قراردادهای ملکی، دعاوی ملکی و امور ثبتی",
      icon: <FaGavel size={20} />,
      image: "/assets/images/hero4.jpg",
      link: "/services/legalConsultation",
      color: "blue",
    },
    {
      title: "همکاری با ما",
      description:
        "فرصت‌های همکاری و سرمایه‌گذاری در پروژه‌های ساختمانی و معاملات ملکی",
      icon: <FaHandshake size={20} />,
      image: "/assets/images/hero.jpg",
      link: "/services/Collaboration",
      color: "purple",
    },
  ];

  const otherServices = [
    {
      title: "تنظیم قراردادها",
      description:
        "تنظیم انواع قراردادهای ملکی با رعایت کامل اصول حقوقی و قانونی",
      icon: <FaFileContract size={20} />,
      color: "blue",
    },
    {
      title: "مشاوره سرمایه‌گذاری",
      description: "مشاوره تخصصی برای سرمایه‌گذاری در بازار املاک و مستغلات",
      icon: <FaChartLine size={20} />,
      color: "green",
    },
    {
      title: "مدیریت املاک",
      description: "خدمات مدیریت املاک برای مالکان و سرمایه‌گذاران",
      icon: <FaHome size={20} />,
      color: "purple",
    },
    {
      title: "ارزیابی قیمت",
      description: "ارزیابی تخصصی قیمت ملک بر اساس موقعیت، متراژ و شرایط بازار",
      icon: <FaMoneyBillWave size={20} />,
      color: "green",
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
        <motion.div variants={fadeIn} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            خدمات ما
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            مجموعه امانی با ارائه خدمات متنوع و تخصصی در حوزه املاک و مستغلات،
            همراه شما در تمامی مراحل خرید، فروش، اجاره و سرمایه‌گذاری است.
          </p>
        </motion.div>

        {/* Main Services */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">خدمات اصلی</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mainServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                image={service.image}
                link={service.link}
                color={service.color}
              />
            ))}
          </div>
        </motion.div>

        {/* Other Services */}
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">سایر خدمات</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherServices.map((service, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div
                  className={`bg-${service.color}-100 text-${service.color}-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}
                >
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

     
      </motion.div>
    </main>
  );
}
