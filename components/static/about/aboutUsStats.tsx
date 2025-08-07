"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChartLine, FaUsers, FaAward } from "react-icons/fa";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(textRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          imageRef.current,
          {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .from(
          statsRef.current?.children || [],
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        )
        .from(
          countersRef.current?.children || [],
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.3"
        );

      // Counter animation
      const counters = document.querySelectorAll(".counter");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={containerRef}
      className="relative flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 py-16 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-purple-600 rounded-full blur-3xl"></div>
      </div>
      {/* Right Text */}
      <div
        ref={textRef}
        className="md:w-1/2 space-y-8 text-right relative z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          آینده‌ی سرمایه‌گذاری شما، امروز در{" "}
          <span className="bg-gradient-to-r from-[#01ae9b] to-purple-600 bg-clip-text text-transparent text-4xl md:text-6xl font-extrabold">
            اوج
          </span>{" "}
          رقم می‌خورد
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
          در اوج، ما بیش از یک مشاور املاک هستیم. ما شریک شما در مسیر یافتن
          بهترین فرصت‌های سرمایه‌گذاری و خانه‌ای هستیم که واقعاً شایسته شماست.
          با تجربه‌ای بیش از ۱۰ سال و تیمی از متخصصان حرفه‌ای، هر روز به هزاران
          نفر کمک می‌کنیم تا رویای خانه‌دار شدن را محقق کنند.
        </p>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <FaAward className="text-[#01ae9b] text-2xl" />
            <div>
              <div className="font-bold text-gray-800">تضمین کیفیت</div>
              <div className="text-sm text-gray-600">۱۰۰% قانونی</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
            <FaUsers className="text-purple-600 text-2xl" />
            <div>
              <div className="font-bold text-gray-800">تیم متخصص</div>
              <div className="text-sm text-gray-600">۵۰+ مشاور</div>
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div
          ref={countersRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <div className="text-center p-4 bg-gradient-to-br from-[#01ae9b]/10 to-[#01ae9b]/5 rounded-xl">
            <div
              className="counter text-3xl font-bold text-[#01ae9b]"
              data-target="5000"
            >
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">املاک فعال</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl">
            <div
              className="counter text-3xl font-bold text-purple-600"
              data-target="2500"
            >
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">مشتری راضی</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl">
            <div
              className="counter text-3xl font-bold text-orange-500"
              data-target="150"
            >
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">معامله روزانه</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl">
            <div
              className="counter text-3xl font-bold text-green-500"
              data-target="98"
            >
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">درصد رضایت</div>
          </div>
        </div>

        <Link href="/contactUs" className="mt-10">
          <button className="group bg-gradient-to-r from-[#01ae9b] to-teal-600 text-white px-10 py-4 rounded-full font-bold transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 justify-center transform">
            <span>تماس با ما</span>
            <FaChartLine className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </Link>
      </div>

      {/* Left Image + Stats */}
      <div ref={imageRef} className="md:w-1/2 relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#01ae9b] to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/assets/images/aboutus1.png"
              alt="مجموعه املاک لوکس و مدرن"
              width={500}
              height={500}
              className="rounded-2xl object-cover w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm font-bold text-gray-800">
                  املاک برتر اوج
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  بهترین گزینه‌ها برای سرمایه‌گذاری
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
