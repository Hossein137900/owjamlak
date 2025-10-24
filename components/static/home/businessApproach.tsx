"use client";

import { useState } from "react";
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
    <div
      className="service-card group relative h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => onMouseEnter(service.id)}
      onMouseLeave={onMouseLeave}
    >
      <div className="service-card-inner relative h-full p-6 lg:p-8 rounded-2xl lg:rounded-3xl text-right overflow-hidden cursor-pointer bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative z-10 flex items-start gap-4 lg:gap-6 h-full">
          <div className="flex-1 min-h-0">
            <h3
              className="service-title text-xl lg:text-2xl font-bold mb-4 transition-colors duration-300"
              style={{ color: isHovered ? service.color : "#1f2937" }}
            >
              {service.title}
            </h3>

            <p
              className="service-description leading-relaxed mb-6 text-sm lg:text-base transition-colors duration-300"
              style={{ color: isHovered ? "#374151" : "#6b7280" }}
            >
              {service.description}
            </p>
          </div>

          <div className="icon-wrapper flex-shrink-0 relative">
            <div
              className="relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300"
              style={{ backgroundColor: service.color }}
            >
              <IconComponent className="text-2xl lg:text-3xl" />
            </div>
          </div>
        </div>

        <div
          className="service-overlay absolute inset-0 rounded-2xl lg:rounded-3xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            opacity: isHovered ? 0.03 : 0,
          }}
        />
      </div>
    </div>
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

  const stats = [
    { number: "500+", label: "پروژه موفق", icon: FaBuilding },
    { number: "1000+", label: "مشتری راضی", icon: FaHandshake },
    { number: "5+", label: "سال تجربه", icon: FaChartLine },
    { number: "24/7", label: "پشتیبانی", icon: FaKey },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotate-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Header Animation */
        .header-section {
          animation: fadeInDown 0.5s ease-out forwards;
        }

        /* Service Cards */
        .service-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .service-card-inner:hover {
          transform: scale(1.02);
        }

        .icon-wrapper:hover {
          transform: scale(1.05);
        }

        /* Button */
        .cta-button-wrapper {
          animation: fadeInUp 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .cta-button {
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .cta-button:active {
          transform: scale(0.98);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .cta-button:hover .arrow-icon {
          transform: translateX(0.25rem);
        }

        /* Stats Section */
        .stats-section {
          animation: fadeInUp 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }

        .stat-card {
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: scale(1.02);
          background-color: rgba(255, 255, 255, 0.8);
        }

        .stat-icon {
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.05);
        }
      `}</style>

      <section className="py-16 lg:py-24 bg-gradient-to-br md:px-20 from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-teal-200/20 rounded-full blur-3xl"
            style={{ animation: "rotate 20s linear infinite" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-purple-200/20 rounded-full blur-3xl"
            style={{ animation: "rotate-reverse 25s linear infinite" }}
          />
        </div>

        <div className="relative z-10">
          <div className="header-section text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-[#66308d] relative">خدمات</span>
              <span className="text-gray-800"> حرفه ای ما</span>
            </h2>

            <div className="h-1 bg-gradient-to-r from-[#66308d] to-[#01ae9b] mx-auto mb-6 rounded-full w-20" />

            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              ما مجموعه های از خدمات تخصصی املاک را با بالاترین استانداردها و
              تکنولوژی های روز دنیا ارائه میدهیم
            </p>
          </div>

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

          <div className="cta-button-wrapper mt-16 lg:mt-20 text-center">
            <Link href="/services">
              <button
                className="cta-button group relative px-8 py-4 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl font-medium text-white overflow-hidden shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #66308d 0%, #01ae9b 100%)",
                }}
              >
                <span className="relative cursor-pointer z-10 flex items-center gap-3 text-lg">
                  مشاهده همه خدمات
                  <FaArrowLeft className="arrow-icon" />
                </span>
              </button>
            </Link>
          </div>

          <div className="stats-section mt-20 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
              >
                <div className="stat-icon w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-[#66308d] to-[#01ae9b] text-white">
                  <stat.icon className="text-xl" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#66308d] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BusinessServices;
