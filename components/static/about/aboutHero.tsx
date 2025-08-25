"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OwjAdComponent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden px-6 py-20"
    >
      {/* Image Background */}
      <Image
        src="/assets/images/bgabout.png"
        alt="Background"
        fill
        className="object-cover blur-[2px] brightness-50"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-5xl mx-auto relative z-10 ">
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-2xl sm:text-4xl md:text-5xl mb-3 font-extrabold text-white leading-snug"
        >
          <span className="bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent">
            اوج
          </span>
          ، جایی که رویای خانه‌دار شدن محقق می‌شود
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white/90 text-sm md:text-xl leading-relaxed mb-3 max-w-3xl mx-auto"
        >
          در اوج، ما بیش از یک پلتفرم املاک هستیم. ما شریک شما در مسیر یافتن
          خانه‌ای هستیم که واقعاً متعلق به شماست. با تیمی از مشاوران متخصص و
          تکنولوژی پیشرفته، تجربه‌ای بی‌نظیر از خرید، فروش و اجاره املاک را برای
          شما فراهم می‌کنیم.
        </motion.p>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-2"
        >
          {[
            { value: "۱۰۰۰+", label: "املاک فعال", color: "text-purple-200" },
            { value: "۵۰۰+", label: "مشتری راضی", color: "text-teal-400" },
            { value: "۲۴/۷", label: "پشتیبانی", color: "text-purple-200" },
            { value: "۹۸%", label: "رضایت مشتری", color: "text-teal-400" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 hover:bg-white/20 transition-colors duration-300 backdrop-blur-md rounded-2xl p-3 md:p-6 shadow-md border border-white/20"
            >
              <div
                className={`md:text-3xl text-xl font-bold mb-2 ${item.color}`}
              >
                {item.value}
              </div>
              <div className="text-gray-200 text-sm">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <div className="pt-2">
          <Link target="_blank" href="/poster">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r cursor-pointer from-purple-700 to-teal-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              شروع جستجوی خانه رویایی
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
