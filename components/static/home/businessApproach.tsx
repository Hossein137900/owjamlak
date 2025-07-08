"use client";
import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

// Separate component for each service card
const ServiceCard: React.FC<{
  service: Service;
  index: number;
  hoveredService: string | null;
  // onMouseMove: (event: React.MouseEvent, serviceId: string) => void;
  onMouseEnter: (serviceId: string) => void;
  onMouseLeave: () => void;
}> = ({
  service,
  // index,
  hoveredService,
  // onMouseMove,
  onMouseEnter,
  onMouseLeave,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredService === service.id) {
      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left - rect.width / 2);
      mouseY.set(event.clientY - rect.top - rect.height / 2);
    }
    // onMouseMove(event, service.id);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    onMouseLeave();
  };

  const IconComponent = service.icon;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const SVGBackground = ({ serviceId }: { serviceId: string }) => (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`pattern-${serviceId}`}
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#pattern-${serviceId})`} />
      <motion.path
        d="M0,150 Q100,50 200,150 T400,150"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: hoveredService === serviceId ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onMouseEnter(service.id)}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full"
      style={{
        perspective: 1000,
      }}
    >
      <div className="block h-full">
        <motion.div
          className="relative h-full p-6 lg:p-8 rounded-2xl lg:rounded-3xl text-right overflow-hidden cursor-pointer"
          style={{
            rotateX: hoveredService === service.id ? rotateX : 0,
            rotateY: hoveredService === service.id ? rotateY : 0,
          }}
          whileHover={{
            scale: 1.02,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          whileTap={{ scale: 0.98 }}
          animate={{
            backgroundColor:
              hoveredService === service.id
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(255, 255, 255, 0.8)",
            boxShadow:
              hoveredService === service.id
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* SVG Background */}
          <SVGBackground serviceId={service.id} />

          {/* Gradient Overlay */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 rounded-2xl lg:rounded-3xl`}
            animate={{
              opacity: hoveredService === service.id ? 0.03 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative z-10 flex items-start gap-4 lg:gap-6 h-full">
            <div className="flex-1 min-h-0">
              <motion.h3
                className="text-xl lg:text-2xl font-bold mb-4 text-gray-800 transition-colors duration-300"
                animate={{
                  color:
                    hoveredService === service.id ? service.color : "#1f2937",
                }}
              >
                {service.title}
              </motion.h3>

              <motion.p
                className="text-gray-600 leading-relaxed mb-6 text-sm lg:text-base"
                animate={{
                  color: hoveredService === service.id ? "#374151" : "#6b7280",
                }}
                transition={{ duration: 0.3 }}
              >
                {service.description}
              </motion.p>
            </div>

            {/* Icon Container */}
            <motion.div
              className="flex-shrink-0 relative"
              animate={{
                scale: hoveredService === service.id ? 1.1 : 1,
                rotate: hoveredService === service.id ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
                rotate: {
                  duration: 0.6,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.7, 1],
                },
              }}
            >
              {/* Icon Background with Pulse Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: service.color }}
                animate={{
                  scale: hoveredService === service.id ? [1, 1.3, 1] : 1,
                  opacity: hoveredService === service.id ? [0.2, 0.1, 0.2] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredService === service.id ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />

              {/* Main Icon */}
              <motion.div
                className="relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full text-white shadow-lg"
                style={{ backgroundColor: service.color }}
                whileHover={{
                  boxShadow: `0 10px 30px ${service.color}40`,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{
                    scale: hoveredService === service.id ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <IconComponent className="text-2xl lg:text-3xl" />
                </motion.div>
              </motion.div>

              {/* Floating Particles */}
              {hoveredService === service.id && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{ backgroundColor: service.color }}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        x: 0,
                        y: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, (i - 1) * 30],
                        y: [0, -20 - i * 10],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -bottom-8 -left-8 w-24 h-24 lg:w-32 lg:h-32 rounded-full opacity-5"
            style={{ backgroundColor: service.color }}
            animate={{
              scale: hoveredService === service.id ? 1.2 : 1,
              opacity: hoveredService === service.id ? 0.1 : 0.05,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <motion.div
            className="absolute -top-12 -right-12 w-32 h-32 lg:w-40 lg:h-40 rounded-full opacity-5"
            style={{ backgroundColor: service.color }}
            animate={{
              scale: hoveredService === service.id ? 1.3 : 1,
              opacity: hoveredService === service.id ? 0.08 : 0.03,
              rotate: hoveredService === service.id ? 180 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Border Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent"
            animate={{
              borderColor:
                hoveredService === service.id
                  ? `${service.color}30`
                  : "transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
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
      title: "مشاوره سرمایه‌گذاری",
      description:
        "تحلیل بازار و ارائه مشاوره تخصصی برای سرمایه‌گذاری مطمئن در بازار املاک",
      icon: FaChartLine,
      color: "#01ae9b",
      gradient: "from-green-500 to-purple-700",
    },
    {
      id: "construction",
      title: "ساخت و ساز",
      description:
        "مشارکت در ساخت و مدیریت پروژه‌های ساختمانی با بهترین کیفیت و استانداردها",
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
        "ارزیابی تخصصی و کارشناسی قیمت املاک با استفاده از روش‌های علمی و دقیق",
      icon: FaCalculator,
      color: "#66308d",
      gradient: "from-purple-500 to-green-700",
    },
  ];

  // const handleMouseMove = (event: React.MouseEvent, serviceId: string) => {};
  // This function is now handled in the ServiceCard component

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-teal-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="text-[#66308d] relative">خدمات</span>
            <span className="text-gray-800"> حرفه‌ای ما</span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-[#66308d] to-[#01ae9b] mx-auto mb-6 rounded-full"
          />

          <motion.p
            className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            ما مجموعه‌ای از خدمات تخصصی املاک را با بالاترین استانداردها و
            تکنولوژی‌های روز دنیا ارائه می‌دهیم
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              hoveredService={hoveredService}
              // onMouseMove={handleMouseMove}
              onMouseEnter={setHoveredService}
              onMouseLeave={() => setHoveredService(null)}
            />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          className="mt-16 lg:mt-20 text-center"
        >
          <Link href="/services">
            <motion.button
              className="group relative px-8 py-4 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl font-medium text-white overflow-hidden shadow-lg"
              style={{
                background: "linear-gradient(135deg, #66308d 0%, #01ae9b 100%)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(102, 48, 141, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Button Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#01ae9b] to-[#66308d]"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {/* Button Content */}
              <span className="relative cursor-pointer z-10 flex items-center gap-3 text-lg">
                مشاهده همه خدمات
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaArrowLeft className="group-hover:rotate-12 transition-transform duration-300" />
                </motion.div>
              </span>

              {/* Ripple Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl lg:rounded-2xl"
                initial={{ scale: 0, opacity: 0.5 }}
                whileHover={{
                  scale: 1,
                  opacity: 0,
                }}
                transition={{ duration: 0.6 }}
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {[
            { number: "500+", label: "پروژه موفق", icon: FaBuilding },
            { number: "1000+", label: "مشتری راضی", icon: FaHandshake },
            { number: "15+", label: "سال تجربه", icon: FaChartLine },
            { number: "24/7", label: "پشتیبانی", icon: FaKey },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <motion.div
                className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-[#66308d] to-[#01ae9b] text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="text-xl" />
              </motion.div>
              <motion.div
                className="text-2xl lg:text-3xl font-bold text-[#66308d] mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {stat.number}
              </motion.div>
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
