"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Custom404() {
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
        <motion.ellipse
          animate={{ scaleX: [1, 1.1, 1], scaleY: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          cx="110"
          cy="200"
          rx="60"
          ry="15"
          fill="#66308d"
          opacity="0.15"
          filter="url(#shadow)"
        />

        {/* خانه */}
        <motion.g
          animate={{ rotate: [0, 4, -4, 0], y: [0, -5, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="house"
          transform="translate(0, 20)"
          style={{ transformOrigin: "50% 100%" }}
        >
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
          <motion.rect
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            x="100"
            y="135"
            width="40"
            height="35"
            rx="8"
            ry="8"
            fill="#01ae9b"
            stroke="#66308d"
            strokeWidth="2"
            style={{ transformOrigin: "50% 100%" }}
          />
          {/* پنجره ها */}
          <motion.rect
            animate={{ rotate: [0, 5, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            x="70"
            y="95"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="#ffffff"
            stroke="#01ae9b"
            strokeWidth="2"
            style={{ transformOrigin: "50% 50%" }}
          />
          <motion.rect
            animate={{ rotate: [0, -5, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            x="120"
            y="95"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="#ffffff"
            stroke="#01ae9b"
            strokeWidth="2"
            style={{ transformOrigin: "50% 50%" }}
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
        </motion.g>

        {/* متن 404 */}
        <motion.text
          animate={{ fill: ["#66308d", "#01ae9b", "#66308d"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          x="110"
          y="215"
          textAnchor="middle"
          fontSize="56"
          fontWeight="900"
          fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          style={{ userSelect: "none" }}
        >
          404
        </motion.text>
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
