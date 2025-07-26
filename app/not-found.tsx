"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function Custom404() {
  const houseRef = useRef<SVGGElement>(null);
  const doorRef = useRef<SVGRectElement>(null);
  const windowLeftRef = useRef<SVGRectElement>(null);
  const windowRightRef = useRef<SVGRectElement>(null);
  const keyRef = useRef<SVGGElement>(null);
  const text404Ref = useRef<SVGTextElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "power2.inOut" },
    });

    // نوسان خونه با حرکت کمی عمودی و چرخش
    tl.to(houseRef.current, {
      rotation: 4,
      y: -5,
      transformOrigin: "50% 100%",
      duration: 2,
    })
      .to(houseRef.current, {
        rotation: -4,
        y: 5,
        duration: 2,
      })
      .to(houseRef.current, {
        rotation: 0,
        y: 0,
        duration: 2,
      });

    // در باز و بسته شدن به صورت نرم
    tl.to(
      doorRef.current,
      { rotation: 15, transformOrigin: "50% 100%", duration: 1.5 },
      0
    ).to(doorRef.current, { rotation: 0, duration: 1.5 });

    // پنجره‌ها یکم تاب خوردن داشته باشند
    tl.to(
      windowLeftRef.current,
      { rotation: 5, transformOrigin: "50% 50%", duration: 1.2 },
      0.5
    ).to(windowLeftRef.current, { rotation: 0, duration: 1.2 });
    tl.to(
      windowRightRef.current,
      { rotation: -5, transformOrigin: "50% 50%", duration: 1.2 },
      0.5
    ).to(windowRightRef.current, { rotation: 0, duration: 1.2 });

    // کلید تاب خوردن ملایم
    tl.to(
      keyRef.current,
      { rotation: 20, transformOrigin: "center", duration: 1.8 },
      1
    ).to(keyRef.current, { rotation: -20, duration: 1.8 });

    // سایه زیر خانه کمی گسترش و جمع شدن
    tl.to(
      shadowRef.current,
      { scaleX: 1.1, scaleY: 1.1, transformOrigin: "50% 50%", duration: 2 },
      0
    ).to(shadowRef.current, { scaleX: 1, scaleY: 1, duration: 2 });

    // تغییر رنگ متن 404 از بنفش به سبز و برعکس
    tl.to(text404Ref.current, { fill: "#01ae9b", duration: 1.5 }, 0).to(
      text404Ref.current,
      { fill: "#66308d", duration: 1.5 }
    );
  }, []);

  return (
    <main className="flex flex-col items-center  justify-center min-h-screen bg-gradient-to-tr from-white to-[#eae9f6] px-6">
      <svg
        className="w-60 h-60 mb-10"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="404 error illustration"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#66308d"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* سایه زیر خانه */}
        <ellipse
          ref={shadowRef}
          cx="110"
          cy="200"
          rx="60"
          ry="15"
          fill="#66308d"
          opacity="0.15"
          filter="url(#shadow)"
        />

        {/* خانه */}
        <g ref={houseRef} className="house" transform="translate(0, 20)">
          {/* بدنه خانه */}
          <rect
            x="55"
            y="80"
            width="110"
            height="90"
            rx="15"
            ry="15"
            fill="#66308d"
            stroke="#01ae9b"
            strokeWidth="3"
            filter="url(#shadow)"
          />
          {/* سقف */}
          <polygon
            points="50,80 110,30 170,80"
            fill="#01ae9b"
            stroke="#66308d"
            strokeWidth="3"
            filter="url(#shadow)"
          />
          {/* در */}
          <rect
            ref={doorRef}
            x="100"
            y="135"
            width="40"
            height="35"
            rx="8"
            ry="8"
            fill="#01ae9b"
            stroke="#66308d"
            strokeWidth="2"
          />
          {/* پنجره ها */}
          <rect
            ref={windowLeftRef}
            x="70"
            y="95"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="#ffffff"
            stroke="#01ae9b"
            strokeWidth="2"
          />
          <rect
            ref={windowRightRef}
            x="120"
            y="95"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="#ffffff"
            stroke="#01ae9b"
            strokeWidth="2"
          />
          {/* خطوط داخلی پنجره ها */}
          <line
            x1="85"
            y1="95"
            x2="85"
            y2="125"
            stroke="#01ae9b"
            strokeWidth="2"
          />
          <line
            x1="70"
            y1="110"
            x2="100"
            y2="110"
            stroke="#01ae9b"
            strokeWidth="2"
          />

          <line
            x1="135"
            y1="95"
            x2="135"
            y2="125"
            stroke="#01ae9b"
            strokeWidth="2"
          />
          <line
            x1="120"
            y1="110"
            x2="150"
            y2="110"
            stroke="#01ae9b"
            strokeWidth="2"
          />
        </g>

        {/* کلید */}
        <g
          ref={keyRef}
          className="key"
          transform="translate(170, 165)"
          fill="#01ae9b"
          stroke="#66308d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="0" cy="0" r="12" fill="#01ae9b" />
          <rect
            x="12"
            y="-5"
            width="30"
            height="10"
            rx="4"
            ry="4"
            fill="#66308d"
          />
          <rect x="35" y="0" width="6" height="18" fill="#66308d" />
          <rect x="28" y="18" width="18" height="6" fill="#66308d" />
        </g>

        {/* متن 404 */}
        <text
          ref={text404Ref}
          x="110"
          y="215"
          textAnchor="middle"
          fontSize="56"
          fontWeight="900"
          fill="#66308d"
          fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          style={{ userSelect: "none" }}
        >
          404
        </text>
      </svg>

      <h1 className="text-2xl md:text-4xl font-extrabold text-[#66308d] mb-4 text-center">
        صفحه مورد نظر پیدا نشد
      </h1>
    

      <Link
        href="/"
        className="inline-block border border-[#e4e4e4] shadow-[#aa73d1] text-[#66308d] font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
      >
        بازگشت به صفحه اصلی
      </Link>
    </main>
  );
}
