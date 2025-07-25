"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InvestmentBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ورود متن و عکس
      gsap.from(".banner-image", {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".banner-image",
          start: "top 80%",
        },
      });
      gsap.from(".banner-text", {
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".banner-text",
          start: "top 80%",
        },
      });

      // چرخش بلاب‌ها
      gsap.to(".blob1", {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "linear",
      });
      gsap.to(".blob2", {
        rotate: -360,
        duration: 25,
        repeat: -1,
        ease: "linear",
      });
      gsap.to(".blob3", {
        rotate: 180,
        duration: 18,
        repeat: -1,
        ease: "linear",
      });

      // Scale هنگام اسکرول
      [".blob1", ".blob2", ".blob3"].forEach((cls, idx) => {
        gsap.fromTo(
          cls,
          { scale: 0.9 + idx * 0.1, opacity: 0.3 },
          {
            scale: 1.3 + idx * 0.1,
            opacity: 0.6,
            scrollTrigger: {
              trigger: ".banner-text",
              start: "top 70%",
              end: "bottom 50%",
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 rounded-2xl shadow-2xl"
    >
      {/* ====== تصویر ====== */}
      <div className="banner-image flex-1 flex justify-center z-10">
        <Image
          src="/assets/images/hero4.jpg"
          alt="Investment"
          width={600}
          height={400}
          className="rounded-2xl shadow-xl object-cover w-full max-w-[600px] h-auto"
        />
      </div>

      {/* ====== متن ====== */}
      <div className="banner-text flex-1 z-10" dir="rtl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          فرصت‌های طلایی <span className="text-[#66308d]">سرمایه‌گذاری</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          با ما در بهترین و آینده‌دارترین پروژه‌های سرمایه‌گذاری همراه شوید. تیم
          ما بهترین فرصت‌ها را گلچین کرده و در اختیار شما قرار می‌دهد.
        </p>
        <button className="mt-8 px-8 py-4 bg-[#7D3AC1] text-white font-semibold rounded-xl shadow-lg hover:bg-[#2DD4BF] transition-all">
          مشاهده آگهی‌ها
        </button>
      </div>

      {/* ====== بلاب‌های نرم ====== */}
      <svg
        className="blob1 absolute -right-40 -top-40 w-[40rem] h-[40rem] opacity-50"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7D3AC1" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
        <path
          fill="url(#grad1)"
          d="M46.1,-78.5C59.8,-72.4,71.6,-61.4,78.5,-48.3C85.3,-35.2,87.2,-20.1,85.5,-5.9C83.8,8.4,78.6,16.8,71.1,27.2C63.7,37.6,53.9,50,41.1,58.3C28.3,66.6,12.6,70.9,-1.4,73C-15.4,75.1,-30.8,75,-44.8,68.3C-58.8,61.6,-71.4,48.2,-77.4,32.3C-83.3,16.3,-82.6,-2.2,-77.3,-18.9C-72,-35.6,-62,-50.4,-48.6,-57.3C-35.3,-64.3,-17.6,-63.4,-1.3,-61.7C15,-60,30,-57.6,46.1,-78.5Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        className="blob2 absolute -left-32 top-72 w-[30rem] h-[30rem] opacity-40"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#7D3AC1" />
          </linearGradient>
        </defs>
        <path
          fill="url(#grad2)"
          d="M36.4,-61.7C46.8,-57.4,54.8,-47.2,61.3,-36.3C67.8,-25.4,72.8,-13.7,73.4,-1.3C74,11.1,70.2,22.3,64.8,32.9C59.5,43.5,52.7,53.6,42.6,61.5C32.6,69.3,19.3,75,5.5,69.3C-8.3,63.6,-16.6,46.4,-27.1,36.9C-37.6,27.5,-50.2,25.9,-61.3,18.3C-72.4,10.8,-81.8,-2.8,-79.5,-15.7C-77.3,-28.6,-63.3,-40.8,-49.2,-46.8C-35,-52.7,-21.1,-52.4,-7.9,-51.8C5.3,-51.3,10.6,-50.6,36.4,-61.7Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* <svg
        className="blob3 absolute right-10 bottom-0 w-[20rem] h-[20rem] opacity-40"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7D3AC1" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
        <path
          fill="url(#grad3)"
          d="M49.1,-66.3C61.7,-60.5,70.1,-48.2,76.8,-34.5C83.5,-20.8,88.4,-5.6,86.8,9.2C85.3,23.9,77.3,38.3,66.5,49.2C55.7,60.1,42.1,67.6,27.6,72.2C13.2,76.8,-2.1,78.4,-15.9,73.2C-29.6,68,-41.7,56.1,-53.4,44C-65,31.9,-76.1,19.7,-76.2,6.4C-76.4,-6.9,-65.6,-21.3,-55,-35.7C-44.5,-50,-34.2,-64.3,-20.7,-69.1C-7.2,-73.8,9.5,-69.1,24.9,-65.7C40.3,-62.3,54.5,-60.1,49.1,-66.3Z"
          transform="translate(100 100)"
        />
      </svg> */}
    </section>
  );
}
