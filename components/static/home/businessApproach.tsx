"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

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
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const decorRef1 = useRef<HTMLDivElement>(null);
  const decorRef2 = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 60, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [index]);

  useEffect(() => {
    const content = contentRef.current;
    const icon = iconRef.current;
    const pulse = pulseRef.current;
    const path = pathRef.current;
    const title = titleRef.current;
    const desc = descRef.current;
    const overlay = overlayRef.current;
    const decor1 = decorRef1.current;
    const decor2 = decorRef2.current;
    const border = borderRef.current;
    const particles = particlesRef.current;

    if (hoveredService === service.id) {
      if (content) {
        gsap.to(content, { scale: 1.02, duration: 0.3, ease: "power2.out" });
        gsap.to(content, {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)",
          duration: 0.3,
        });
      }
      if (icon)
        gsap.to(icon, { scale: 1.1, rotation: "5_short", duration: 0.3 });
      if (overlay) gsap.to(overlay, { opacity: 0.03, duration: 0.3 });
      if (title) gsap.to(title, { color: service.color, duration: 0.3 });
      if (desc) gsap.to(desc, { color: "#374151", duration: 0.3 });
      if (decor1) gsap.to(decor1, { scale: 1.2, opacity: 0.1, duration: 0.5 });
      if (decor2)
        gsap.to(decor2, {
          scale: 1.3,
          opacity: 0.08,
          rotation: 180,
          duration: 0.8,
        });
      if (border)
        gsap.to(border, { borderColor: `${service.color}30`, duration: 0.3 });

      if (pulse) {
        gsap.to(pulse, {
          scale: 1.3,
          opacity: 0.2,
          duration: 2,
          repeat: -1,
          yoyo: true,
        });
      }
      if (path) {
        gsap.to(path, {
          strokeDasharray: "100%",
          strokeDashoffset: "0%",
          duration: 1.5,
        });
      }

      particles.forEach((particle, i) => {
        if (particle) {
          gsap.fromTo(
            particle,
            { opacity: 0, scale: 0, x: 0, y: 0 },
            {
              opacity: 1,
              scale: 1,
              x: (i - 1) * 30,
              y: -20 - i * 10,
              duration: 2,
              repeat: -1,
              delay: i * 0.3,
              ease: "power2.out",
              yoyo: true,
            }
          );
        }
      });
    } else {
      if (content) {
        gsap.to(content, { scale: 1, duration: 0.3 });
        gsap.to(content, {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          duration: 0.3,
        });
      }
      if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3 });
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
      if (title) gsap.to(title, { color: "#1f2937", duration: 0.3 });
      if (desc) gsap.to(desc, { color: "#6b7280", duration: 0.3 });
      if (decor1) gsap.to(decor1, { scale: 1, opacity: 0.05, duration: 0.5 });
      if (decor2)
        gsap.to(decor2, {
          scale: 1,
          opacity: 0.03,
          rotation: 0,
          duration: 0.8,
        });
      if (border)
        gsap.to(border, { borderColor: "transparent", duration: 0.3 });

      if (pulse) {
        gsap.killTweensOf(pulse);
        gsap.to(pulse, { scale: 1, opacity: 0, duration: 0.3 });
      }
      if (path) {
        gsap.to(path, { strokeDashoffset: "100%", duration: 0.5 });
      }

      particles.forEach((particle) => {
        if (particle) {
          gsap.killTweensOf(particle);
          gsap.to(particle, {
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
            duration: 0.3,
          });
        }
      });
    }
  }, [hoveredService, service.id, service.color]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredService === service.id && contentRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / 10;
      const y = (event.clientY - rect.top - rect.height / 2) / 10;

      gsap.to(contentRef.current, {
        rotationY: x,
        rotationX: -y,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    onMouseLeave();
  };

  const IconComponent = service.icon;

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
      <path
        ref={pathRef}
        d="M0,150 Q100,50 200,150 T400,150"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.1"
        style={{
          strokeDasharray: "100%",
          strokeDashoffset: "100%",
        }}
      />
    </svg>
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onMouseEnter(service.id)}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full"
      style={{ perspective: 1000 }}
    >
      <div className="block h-full">
        <div
          ref={contentRef}
          className="relative h-full p-6 lg:p-8 rounded-2xl lg:rounded-3xl text-right overflow-hidden cursor-pointer"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
        >
          <SVGBackground serviceId={service.id} />

          <div
            ref={overlayRef}
            className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 rounded-2xl lg:rounded-3xl`}
          />

          <div className="relative z-10 flex items-start gap-4 lg:gap-6 h-full">
            <div className="flex-1 min-h-0">
              <h3
                ref={titleRef}
                className="text-xl lg:text-2xl font-bold mb-4 text-gray-800"
              >
                {service.title}
              </h3>

              <p
                ref={descRef}
                className="text-gray-600 leading-relaxed mb-6 text-sm lg:text-base"
              >
                {service.description}
              </p>
            </div>

            <div ref={iconRef} className="flex-shrink-0 relative">
              <div
                ref={pulseRef}
                className="absolute inset-0 rounded-full opacity-0"
                style={{ backgroundColor: service.color }}
              />

              <div
                className="relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full text-white shadow-lg"
                style={{ backgroundColor: service.color }}
              >
                <IconComponent className="text-2xl lg:text-3xl" />
              </div>

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    if (el) particlesRef.current[i] = el;
                  }}
                  className="absolute w-2 h-2 rounded-full opacity-0"
                  style={{ backgroundColor: service.color }}
                />
              ))}
            </div>
          </div>

          <div
            ref={decorRef1}
            className="absolute -bottom-8 -left-8 w-24 h-24 lg:w-32 lg:h-32 rounded-full opacity-5"
            style={{ backgroundColor: service.color }}
          />

          <div
            ref={decorRef2}
            className="absolute -top-12 -right-12 w-32 h-32 lg:w-40 lg:h-40 rounded-full opacity-5"
            style={{ backgroundColor: service.color }}
          />

          <div
            ref={borderRef}
            className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

const BusinessServices = () => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const cta = ctaRef.current;
    const stats = statsRef.current;
    const bg1 = bg1Ref.current;
    const bg2 = bg2Ref.current;

    if (bg1) {
      gsap.to(bg1, {
        rotation: 360,
        scale: 1.2,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }
    if (bg2) {
      gsap.to(bg2, {
        rotation: -360,
        scale: 0.8,
        duration: 25,
        repeat: -1,
        ease: "none",
      });
    }

    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    if (cta) {
      gsap.fromTo(
        cta,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cta,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    if (stats) {
      gsap.fromTo(
        stats,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: stats,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={bg1Ref}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-teal-200/20 rounded-full blur-3xl"
        />
        <div
          ref={bg2Ref}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-[#66308d] relative">خدمات</span>
            <span className="text-gray-800"> حرفه‌ای ما</span>
          </h2>

          <div className="h-1 bg-gradient-to-r from-[#66308d] to-[#01ae9b] mx-auto mb-6 rounded-full w-20" />

          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            ما مجموعه‌ای از خدمات تخصصی املاک را با بالاترین استانداردها و
            تکنولوژی‌های روز دنیا ارائه می‌دهیم
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

        <div ref={ctaRef} className="mt-16 lg:mt-20 text-center">
          <Link href="/services">
            <button
              className="group relative px-8 py-4 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl font-medium text-white overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #66308d 0%, #01ae9b 100%)",
              }}
            >
              <span className="relative cursor-pointer z-10 flex items-center gap-3 text-lg">
                مشاهده همه خدمات
                <FaArrowLeft className="group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
          </Link>
        </div>

        <div
          ref={statsRef}
          className="mt-20 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {[
            { number: "500+", label: "پروژه موفق", icon: FaBuilding },
            { number: "1000+", label: "مشتری راضی", icon: FaHandshake },
            { number: "15+", label: "سال تجربه", icon: FaChartLine },
            { number: "24/7", label: "پشتیبانی", icon: FaKey },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:scale-105 hover:bg-white/80 transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-[#66308d] to-[#01ae9b] text-white hover:rotate-180 transition-transform duration-500">
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
  );
};

export default BusinessServices;
