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
      className="relative py-20 px-6 lg:px-24 text-center bg-gradient-to-br from-gray-50 to-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6"
        >
          <span className="bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent">
            اوج
          </span>
          ، جایی که رویای خانه دار شدن محقق میشود
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-gray-600 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
        >
          در اوج، ما بیش از یک پلتفرم املاک هستیم. ما شریک شما در مسیر یافتن
          خانهای هستیم که واقعاً متعلق به شماست. با تیمی از مشاوران متخصص و
          تکنولوژی پیشرفته، تجربهای بینظیر از خرید، فروش و اجاره املاک را برای
          شما فراهم میکنیم.
        </motion.p>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-700 mb-2">۱۰۰۰+</div>
            <div className="text-gray-600 text-sm">املاک فعال</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">۵۰۰+</div>
            <div className="text-gray-600 text-sm">مشتری راضی</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-700 mb-2">۲۴/۷</div>
            <div className="text-gray-600 text-sm">پشتیبانی</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-teal-600 mb-2">۹۸%</div>
            <div className="text-gray-600 text-sm">رضایت مشتری</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative flex flex-col md:flex-row items-center justify-center gap-8"
        >
          {/* Main Image */}
          <div className="relative w-full md:w-1/2 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <Image
              src="/assets/images/aboutHero2.jpg"
              alt="مجموعه املاک لوکس"
              width={600}
              height={400}
              className="relative rounded-2xl w-full object-cover shadow-2xl transform  transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>

          {/* Secondary Image */}
          <div className="relative w-full md:w-1/2 group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <Image
              src="/assets/images/aboutHero.png"
              alt="پلتفرم دیجیتال املاک"
              width={600}
              height={400}
              className="relative rounded-2xl w-full object-cover shadow-2xl transform  transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="mt-16">
          <Link className="cursor-pointer" href="/poster">
            {" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-700 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              شروع جستجوی خانه رویایی
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
