"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const advisorItems = [
  {
    title: "مشاوره اختصاصی",
    description: "مشاوره تخصصی برای خرید و فروش املاک",
  },
  {
    title: "بررسی قیمت منطقه",
    description: "تحلیل قیمتهای منطقه برای تصمیم بهتر",
  },
  {
    title: "پشتیبانی ۲۴ ساعته",
    description: "همراه شما در تمام مراحل معامله",
  },
];

export default function AboutUsHero() {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 relative">
      {/* Left Content - Image with Advisor Cards */}
      <div className="md:w-1/2 relative mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "backOut" }}
          className="relative z-10 rounded-full overflow-hidden shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500"
        >
          <Image
            src="/assets/images/aboutus2.jpg"
            alt="مشاوران املاک اوج"
            width={500}
            height={500}
            className="rounded-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
        </motion.div>

        {/* Advisor Cards */}
        <div className="absolute top-4 left-4 space-y-4 z-20">
          {advisorItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.8 + i * 0.2,
                ease: "backOut",
              }}
              className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-xs transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#01ae9b] to-[#66308d] flex items-center justify-center text-white shadow-lg">
                <FaUser className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Content - Text with Blob Background */}
      <div className="md:w-1/2 relative">
        {/* Blob Background */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-96 h-96 opacity-10 pointer-events-none"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#66308d" />
              <stop offset="100%" stopColor="#01ae9b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#blobGrad)"
            d="M40,-60C50,-40,55,-20,60,0C65,20,70,40,60,60C50,80,25,100,0,100C-25,100,-50,80,-60,60C-70,40,-65,20,-60,0C-55,-20,-50,-40,-40,-60C-30,-80,-15,-100,0,-100C15,-100,30,-80,40,-60Z"
            transform="translate(100 100)"
          />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-3xl md:text-5xl text-gray-700 leading-tight mb-6"
          >
            با{" "}
            <span className="bg-gradient-to-r from-[#66308d] to-[#01ae9b] bg-clip-text text-transparent text-4xl md:text-6xl font-extrabold">
              اوج
            </span>
            <br />
            همیشه یه همراه داری !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-gray-600 leading-loose text-lg mb-8"
          >
            توی مشاور املاک اوج، ما فقط خونه نمیفروشیم؛ ما کمک میکنیم تا تو
            بهترین انتخاب رو با خیال راحت انجام بدی. از جستوجوی یه خونهی دنج
            برای زندگی تا یه سرمایهگذاری پرسود کلان، ما بلدیم چطوری کار میکنه و
            همیشه سعی میکنیم مشاورهای بدیم که به نفع تو باشه.
          </motion.p>
          <Link href="/services">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: "backOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#66308d] to-[#01ae9b] hover:from-[#01ae9b] hover:to-[#66308d] text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center gap-3 justify-center"
            >
              مشاوره رایگان
              <FaArrowLeft className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
