"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaHandshake,
  FaKey,
  FaChartLine,
  FaBuilding,
  FaBalanceScale,
  FaCalculator,
  FaArrowLeft,
} from "react-icons/fa";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

const ServiceCard: React.FC<{
  service: Service;
  index: number;
  hoveredService: string | null;
  onMouseEnter: (serviceId: string) => void;
  onMouseLeave: () => void;
}> = ({ service, index, hoveredService, onMouseEnter, onMouseLeave }) => {
  const IconComponent = service.icon;
  const isHovered = hoveredService === service.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "backOut" }}
      onMouseEnter={() => onMouseEnter(service.id)}
      onMouseLeave={onMouseLeave}
      className="group relative h-full"
      style={{ perspective: 1000 }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative h-full p-6 lg:p-8 rounded-2xl lg:rounded-3xl text-right overflow-hidden cursor-pointer bg-white/80 shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <div className="relative z-10 flex items-start gap-4 lg:gap-6 h-full">
          <div className="flex-1 min-h-0">
            <motion.h3
              animate={{ color: isHovered ? service.color : "#1f2937" }}
              className="text-xl lg:text-2xl font-bold mb-4"
            >
              {service.title}
            </motion.h3>

            <motion.p
              animate={{ color: isHovered ? "#374151" : "#6b7280" }}
              className="leading-relaxed mb-6 text-sm lg:text-base"
            >
              {service.description}
            </motion.p>
          </div>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex-shrink-0 relative"
          >
            <div
              className="relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full text-white shadow-lg"
              style={{ backgroundColor: service.color }}
            >
              <IconComponent className="text-2xl lg:text-3xl" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.03 : 0 }}
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl lg:rounded-3xl`}
        />
      </motion.div>
    </motion.div>
  );
};

const BusinessServices = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const services: Service[] = [
    {
      id: "buy-sell",
      title: "خرید و فروش",
      description:
        "مشاوره تخصصی و همراهی در تمام مراحل خرید و فروش املاک مسکونی، تجاری و اداری",
      icon: FaHandshake,
      color: "#01ae9b",
      gradient: "from-green-500 to-purple-700",
    },
    {
      id: "rent",
      title: "اجاره و رهن",
      description:
        "ارائه خدمات جامع برای اجاره و رهن انواع املاک با شرایط مناسب و قراردادهای محکم",
      icon: FaKey,
      color: "#66308d",
      gradient: "from-purple-500 to-green-700",
    },
    {
      id: "consultation",
      title: "مشاوره سرمایه گذاری",
      description:
        "تحلیل بازار و ارائه مشاوره تخصصی برای سرمایه گذاری مطمئن در بازار املاک",
      icon: FaChartLine,
      color: "#01ae9b",
      gradient: "from-green-500 to-purple-700",
    },
    {
      id: "construction",
      title: "ساخت و ساز",
      description:
        "مشارکت در ساخت و مدیریت پروژههای ساختمانی با بهترین کیفیت و استانداردها",
      icon: FaBuilding,
      color: "#66308d",
      gradient: "from-purple-500 to-green-700",
    },
    {
      id: "legal",
      title: "خدمات حقوقی",
      description:
        "ارائه مشاوره و خدمات حقوقی در زمینه معاملات ملکی، سند و مالکیت",
      icon: FaBalanceScale,
      color: "#01ae9b",
      gradient: "from-green-500 to-purple-700",
    },
    {
      id: "valuation",
      title: "ارزیابی و کارشناسی",
      description:
        "ارزیابی تخصصی و کارشناسی قیمت املاک با استفاده از روش های علمی و دقیق",
      icon: FaCalculator,
      color: "#66308d",
      gradient: "from-purple-500 to-green-700",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br md:px-20 from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-teal-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 0.8, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-[#66308d] relative">خدمات</span>
            <span className="text-gray-800"> حرفهای ما</span>
          </h2>

          <div className="h-1 bg-gradient-to-r from-[#66308d] to-[#01ae9b] mx-auto mb-6 rounded-full w-20" />

          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            ما مجموعهای از خدمات تخصصی املاک را با بالاترین استانداردها و
            تکنولوژی های روز دنیا ارائه میدهیم
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              hoveredService={hoveredService}
              onMouseEnter={setHoveredService}
              onMouseLeave={() => setHoveredService(null)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
          className="mt-16 lg:mt-20 text-center"
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl font-medium text-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #66308d 0%, #01ae9b 100%)",
              }}
            >
              <span className="relative cursor-pointer z-10 flex items-center gap-3 text-lg">
                مشاهده همه خدمات
                <FaArrowLeft className="group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
          className="mt-20 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {[
            { number: "500+", label: "پروژه موفق", icon: FaBuilding },
            { number: "1000+", label: "مشتری راضی", icon: FaHandshake },
            { number: "5+", label: "سال تجربه", icon: FaChartLine },
            { number: "24/7", label: "پشتیبانی", icon: FaKey },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-[#66308d] to-[#01ae9b] text-white"
              >
                <stat.icon className="text-xl" />
              </motion.div>
              <div className="text-2xl lg:text-3xl font-bold text-[#66308d] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessServices;
