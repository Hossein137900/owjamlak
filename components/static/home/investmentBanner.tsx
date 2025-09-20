"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function InvestmentBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 rounded-2xl">
      {/* ====== تصویر ====== */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex-1 flex justify-center z-10"
      >
        <Image
          src="/assets/images/hero4.jpg"
          alt="Investment"
          width={600}
          height={400}
          className="rounded-2xl shadow-xl object-cover w-full max-w-[600px] h-auto"
        />
      </motion.div>

      {/* ====== متن ====== */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex-1 z-10"
        dir="rtl"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 leading-tight">
          فرصت های طلایی <span className="text-[#66308d]">سرمایه گذاری</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          با ما در بهترین و آینده دارترین پروژههای سرمایه گذاری همراه شوید. تیم ما
          بهترین فرصتها را گلچین کرده و در اختیار شما قرار میدهد.
        </p>
        <Link href={"/offers"} className="cursor-pointer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-4 bg-[#7D3AC1] text-white cursor-pointer font-semibold rounded-xl shadow-lg hover:bg-[#2DD4BF] transition-all duration-300"
          >
            مشاهده آگهی ها
          </motion.button>
        </Link>
      </motion.div>

      {/* ====== بلابهای نرم ====== */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -right-40 -top-40 w-[40rem] h-[40rem] opacity-50"
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
      </motion.svg>

      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -left-32 top-72 w-[30rem] h-[30rem] opacity-40"
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
      </motion.svg>
    </section>
  );
}
