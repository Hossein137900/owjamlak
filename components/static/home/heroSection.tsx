"use client";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./searchBar";
import HeroImageSlider from "./heroImageSlider";

export default function RealEstateSearch() {
  return (
    <>
      <style jsx>{`
        @keyframes slideUpFade {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideLeftFade {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-up-1 {
          animation: slideUpFade 0.8s ease-out forwards;
        }

        .animate-slide-up-2 {
          animation: slideUpFade 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-slide-up-3 {
          animation: slideUpFade 0.6s ease-out 0.7s forwards;
          opacity: 0;
        }

        .animate-slide-left {
          animation: slideLeftFade 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>

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
          <div className="mx-auto px-6 md:px-20 w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Text Section */}
              <div className="md:w-2/5">
                <h1 className="animate-slide-up-1 text-2xl md:text-4xl font-bold text-right text-white sm:text-gray-800 mb-1">
                  <span className="text-[#01ae9b]">اوج،</span> مسیر امن خرید و
                  فروش ملک
                </h1>

                <p className="animate-slide-up-2 text-right text-white sm:text-gray-600 text-sm">
                  با املاک اوج، خرید و فروش ملک را آسان تر از همیشه تجربه کنید.
                  ما به شما کمک می کنیم تا بهترین انتخاب را داشته باشید.
                </p>

                <div className="animate-slide-up-3">
                  <SearchBar compact className="" />
                </div>
              </div>

              {/* Image Grid */}
              <div className="animate-slide-left hidden sm:block md:w-3/5">
                <div className="grid grid-cols-12 grid-rows-6 gap-3 h-[450px]">
                  <HeroImageSlider />

                  <div className="col-span-4 row-span-3 relative group cursor-pointer">
                    <div className="absolute inset-0 rounded-tl-3xl rounded-bl-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#01ae9b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative h-full flex flex-col items-center justify-center p-6">
                        <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                          <Image
                            src="/assets/images/logo (2).png"
                            alt="املاک اوج"
                            width={120}
                            height={120}
                            style={{ objectFit: "contain" }}
                            className="drop-shadow-lg"
                          />
                        </div>

                        <div className="mt-4 text-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                          <h4 className="text-lg font-bold text-[#01ae9b] mb-1">
                            املاک اوج
                          </h4>
                          <p className="text-xs text-gray-600 font-medium">
                            برند معتبر املاک
                          </p>
                        </div>

                        <div className="absolute top-4 right-4 w-2 h-2 bg-[#01ae9b] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#01ae9b] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/poster"
                    className="col-span-4 row-span-3 relative group cursor-pointer block"
                  >
                    <div className="absolute inset-0 rounded-bl-3xl rounded-tl-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#01ae9b] via-[#00c4a7] to-[#019b8a] flex items-center justify-center transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Default Content */}
                      <div className="text-center text-white p-6 relative z-10 transform transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                        <h3 className="text-2xl font-black leading-tight mb-3 tracking-wide drop-shadow-lg">
                          املاک اوج
                        </h3>
                        <div className="mb-3">
                          <div className="w-12 h-1 bg-white/60 mx-auto mb-3 rounded-full"></div>
                        </div>
                        <p className="text-sm font-semibold opacity-95 leading-relaxed drop-shadow-md">
                          مسیری امن به سوی خانه رویاهایتان
                        </p>
                      </div>

                      {/* Hover Content */}
                      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            مشاهده آگهی‌ها
                          </h3>
                          <p className="text-sm opacity-90">
                            برای یافتن بهترین ملک کلیک کنید
                          </p>
                          <div className="mt-3 text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
                            کلیک کنید
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
