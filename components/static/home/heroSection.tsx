"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import SearchBar from "./searchBar";
import HeroImageSlider from "./heroImageSlider";

export default function RealEstateSearch() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="relative p-6 md:p-10 md:rounded-2xl overflow-hidden h-screen "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      dir="rtl"
    >
      {/* Mobile background image - only visible on small screens */}
      <div className="absolute inset-0 sm:hidden">
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/images/hero2.png"
            alt="Modern apartment"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        </div>
      </div>

      <div className="flex flex-col mt-20 md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
        {/* Text Section - Left side on desktop, top on mobile */}
        <motion.div className="md:w-2/5 z-10" variants={itemVariants}>
          <h1 className="text-xl md:text-4xl lg:text-4xl font-bold text-right text-white sm:text-[#1A1A1A] mb-6">
            <span className="md:text-[#01ae9b] text-[#cd90f8]  font-bold">اوج،</span> مسیر امن
            خرید و فروش ملک
          </h1>
          <p className="text-right text-white sm:text-gray-600 mb-6 text-sm">
            با اوج، خرید و فروش ملک را آسان‌تر از همیشه تجربه کنید. ما به شما
            کمک می‌کنیم تا بهترین انتخاب را داشته باشید.
          </p>

          {/* Search Bar Component */}
          <SearchBar compact className="mt-6 " />
        </motion.div>

        {/* Image Grid - Right side on desktop, hidden on mobile */}
        <motion.div
          className="hidden sm:block md:w-3/5 relative"
          variants={itemVariants}
        >
          <div className="grid grid-cols-12 grid-rows-6 gap-3 h-[450px]">
            {/* Main large image slider */}
            <HeroImageSlider />

            {/* Top right image - hexagonal shape */}
            <motion.div
              className="col-span-4 row-span-3 relative"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-tl-3xl rounded-bl-3xl overflow-hidden shadow-xl">
                <Image
                  src="/assets/images/hero2.png"
                  alt="Modern apartment"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[#1A1A1A] font-bold text-xs">
                  آپارتمان مدرن
                </div>
              </div>
            </motion.div>

            {/* Bottom right image - unique shape */}
            <motion.div
              className="col-span-4 row-span-3 relative"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-bl-3xl rounded-tl-3xl overflow-hidden shadow-xl">
                <Image
                  src="/assets/images/hero3.png"
                  alt="Cozy house"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[#1A1A1A] font-bold text-xs">
                  خانه دنج
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute -bottom-6 -left-6 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
          >
            <Image
              src="/assets/images/hero1.jpg"
              alt="Featured property"
              fill
              sizes="(max-width: 768px) 25vw, 10vw"
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
