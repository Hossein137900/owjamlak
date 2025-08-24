"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import SearchBar from "./searchBar";
import HeroImageSlider from "./heroImageSlider";

export default function RealEstateSearch() {
  return (
    <div
      className="relative h-screen overflow-hidden bg-white"
      dir="rtl"
      style={{
        backgroundImage: `url("/assets/images/bg.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "1000px",
        backgroundPosition: "center",
        backfaceVisibility: "revert",
      }}
    >
      {/* Mobile background */}
      <div className="absolute inset-0 sm:hidden">
        <Image
          src="/assets/images/hero2.png"
          alt="Modern apartment"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Text Section */}
            <div className="md:w-2/5">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-2xl md:text-4xl font-bold  text-right text-white sm:text-gray-800 mb-1"
              >
                <span className="text-[#01ae9b]">اوج،</span> مسیر امن خرید و
                فروش ملک
              </motion.h1>

              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="text-right text-white sm:text-gray-600 text-sm leading-relaxed"
              >
                با اوج، خرید و فروش ملک را آسانتر از همیشه تجربه کنید. ما به شما
                کمک میکنیم تا بهترین انتخاب را داشته باشید.
              </motion.p>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              >
                <SearchBar compact className="" />
              </motion.div>
            </div>

            {/* Image Grid */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="hidden sm:block md:w-3/5"
            >
              <div className="grid grid-cols-12 grid-rows-6 gap-3 h-[450px]">
                <HeroImageSlider />

                <div className="col-span-4 row-span-3 relative group">
                  <div className="absolute inset-0 rounded-tl-3xl rounded-bl-3xl overflow-hidden shadow-xl">
                    <Image
                      src="/assets/images/hero2.png"
                      alt="Modern apartment"
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-gray-800 font-bold text-xs">
                      آپارتمان مدرن
                    </div>
                  </div>
                </div>

                <div className="col-span-4 row-span-3 relative group">
                  <div className="absolute inset-0 rounded-bl-3xl rounded-tl-3xl overflow-hidden shadow-xl">
                    <Image
                      src="/assets/images/hero3.png"
                      alt="Cozy house"
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-gray-800 font-bold text-xs">
                      خانه دنج
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
