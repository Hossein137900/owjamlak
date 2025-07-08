"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OwjAdComponent() {
  return (
    <section className=" py-20 px-6 lg:px-24 text-center">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          <span className="text-purple-700">اوج</span>، وقتی مشاوره، فقط فروش
          نیست
        </h2>
        <p className="mt-4 text-gray-700 text-sm md:text-base leading-loose">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده
          از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و
          سطرآنچنان که لازم است
        </p>

        <div className="relative mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Image 1 */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image
              src="/assets/images/aboutHero2.jpg"
              alt="House Grid"
              width={600}
              height={400}
              className="rounded-xl w-full object-cover shadow-md"
            />
          </motion.div>

          {/* Image 2 */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Image
              src="/assets/images/aboutHero.png"
              alt="Real Estate UI"
              width={600}
              height={400}
              className="rounded-xl w-full object-cover shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
