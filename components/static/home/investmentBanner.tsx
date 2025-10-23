"use client";

 import Image from "next/image";
import Link from "next/link";

export default function InvestmentBanner() {
 
  return (
    <>
      <style jsx>{`
        @keyframes slideFromRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes widthExpand {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes floatUp {
          0%,
          100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes floatDown {
          0%,
          100% {
            transform: translateY(10px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .image-section {
          animation: slideFromRight 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .content-section {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .image-wrapper {
          transition: transform 0.3s ease;
        }

        .image-wrapper:hover {
          transform: scale(1.02) rotate(1deg);
        }

        .image-inner {
          transition: transform 0.7s ease;
        }

        .image-wrapper:hover .image-inner {
          transform: scale(1.1);
        }

        .image-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-wrapper:hover .image-overlay {
          opacity: 1;
        }

        .floating-top {
          animation: floatUp 4s ease-in-out infinite;
        }

        .floating-bottom {
          animation: floatDown 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .badge-animate {
          animation: scaleIn 0.5s ease-out 0.2s forwards;
          transform: scale(0);
        }

        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .underline-animate {
          animation: widthExpand 0.8s ease-out 0.5s forwards;
          width: 0;
        }

        .primary-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .primary-button:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .primary-button:active {
          transform: scale(0.95);
        }

        .button-bg {
          transition: transform 0.3s ease;
        }

        .primary-button:hover .button-bg {
          transform: scale(1.1);
        }

        .secondary-button {
          transition: all 0.3s ease;
        }

        .secondary-button:hover {
          transform: scale(1.02);
          border-color: #01ae9b;
          color: #01ae9b;
        }
      `}</style>

      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 py-20 px-6 md:px-20">
        <div className="mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="image-section relative">
              <div className="relative group">
                <div
                  className="image-wrapper relative overflow-hidden rounded-3xl shadow-2xl"
                  
                >
                  <Image
                    src="/assets/images/hero4.jpg"
                    alt="Investment"
                    width={600}
                    height={400}
                    className="image-inner object-cover w-full h-[400px]"
                  />
                  <div className="image-overlay absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Elements */}
                <div className="floating-top absolute -top-6 -right-6 bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                  <div className="text-2xl font-bold text-[#01ae9b]">+25%</div>
                  <div className="text-xs text-gray-600">بازدهی سالانه</div>
                </div>

                <div className="floating-bottom absolute -bottom-4 -left-4 bg-[#01ae9b]/80 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl">
                  <div className="text-lg font-bold">1000+</div>
                  <div className="text-xs opacity-90">پروژه موفق</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="content-section space-y-8" dir="rtl">
              <div className="space-y-4">
                <div className="badge-animate inline-flex items-center gap-2 bg-[#01ae9b]/10 text-[#01ae9b] px-4 py-2 rounded-full text-sm font-medium">
                  <span className="pulse-dot w-2 h-2 bg-[#01ae9b] rounded-full"></span>
                  فرصت های ویژه سرمایه گذاری
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                  سرمایه گذاری
                  <span className="block text-[#01ae9b] relative">
                    هوشمندانه
                    <div className="underline-animate absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#01ae9b] to-transparent" />
                  </span>
                </h2>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed">
                با تیم متخصص املاک اوج، در پروژه های پربازده و آینده دار سرمایه
                گذاری کنید و از بازدهی مطمئن برخوردار شوید.
              </p>

              <div className="flex flex-row gap-4">
                <Link href="/offers">
                  <button className="primary-button group relative px-8 py-4 bg-[#01ae9b] text-white font-bold rounded-2xl shadow-xl">
                    <span className="relative z-10">مشاهده فرصت ها</span>
                    <div className="button-bg absolute inset-0 bg-gradient-to-r from-[#01ae9b] to-[#019b8a] rounded-2xl" />
                  </button>
                </Link>
                <Link href="/contactUs">
                  <button className="secondary-button px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl">
                    مشاوره رایگان
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#01ae9b]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#01ae9b]/3 rounded-full blur-3xl" />
      </section>
    </>
  );
}
