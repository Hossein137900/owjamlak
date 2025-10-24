"use client";
import BusinessApproach from "./businessApproach";
import Testimonials from "@/components/global/testimonials";
import Link from "next/link";
import { BiHeadphone, BiLeftArrowAlt } from "react-icons/bi";

export default function OurApproachPage() {
  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes rotateInfinite {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scaleRotate {
          0% {
            transform: rotate(-45deg) scale(0);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
            transform: scale(1.1);
          }
        }

        @keyframes scaleRotateIn {
          from {
            transform: scale(0) rotate(180deg);
          }
          to {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes colorCycle {
          0%,
          100% {
            color: rgba(255, 255, 255, 0.25);
          }
          33% {
            color: rgba(102, 48, 141, 0.4);
          }
          66% {
            color: rgba(1, 174, 155, 0.4);
          }
        }

        @keyframes rotateIn {
          from {
            transform: rotate(90deg);
            opacity: 0;
          }
          to {
            transform: rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes floatUp {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes floatDown {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(15px);
          }
        }

        @keyframes floatSmall {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes slideUpScale {
          from {
            transform: translateY(60px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUpSmall {
          from {
            transform: translateY(30px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* SVG Animations */
        .svg-overlay {
          animation: fadeIn 1.5s ease-out;
        }

        .svg-key {
          animation: scaleRotate 1s ease-out 0.5s forwards,
            rotateInfinite 8s linear 1.5s infinite;
          transform: rotate(-45deg) scale(0);
          transition: transform 0.3s ease;
        }

        .svg-key:hover {
          transform: scale(1.1);
        }

        .svg-building {
          animation: slideDown 1.2s ease-out 0.8s forwards,
            glowPulse 3s ease-in-out 2s infinite;
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .svg-building:hover {
          transform: translateY(-5px);
        }

        .svg-home {
          animation: scaleRotateIn 1s ease-out 1.2s forwards,
            colorCycle 4s ease-in-out 2.2s infinite;
          transform: scale(0) rotate(180deg);
          transition: transform 0.3s ease;
        }

        .svg-home:hover {
          transform: scale(1.15);
        }

        .svg-keyring {
          animation: rotateIn 1.5s ease-out 1.5s forwards;
          transform: rotate(90deg);
          opacity: 0;
          transition: transform 0.3s ease;
        }

        .svg-keyring:hover {
          transform: rotate(-10deg);
        }

        .float-1 {
          animation: floatUp 3s ease-in-out infinite;
        }

        .float-2 {
          animation: floatDown 4s ease-in-out 1s infinite;
        }

        .float-3 {
          animation: floatSmall 2.5s ease-in-out 0.5s infinite;
        }

        /* Hero Content */
        .hero-title {
          animation: slideUpScale 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .hero-description {
          animation: slideUp 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .hero-button {
          animation: slideUpSmall 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }

        .cta-button {
          transition: all 0.2s ease;
        }

        .cta-button:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
        }

        .cta-button:active {
          transform: scale(0.95);
        }

        /* CTA Section */
        .cta-container {
          animation: fadeInUp 0.7s ease-out forwards;
        }

        .cta-title {
          animation: fadeInDown 0.6s ease-out forwards;
        }

        .cta-description {
          animation: fadeInUp 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .cta-buttons {
          animation: fadeInScale 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .cta-trust {
          animation: fadeInUp 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }

        .contact-button,
        .services-button {
          transition: all 0.2s ease;
        }

        .contact-button:hover {
          transform: scale(1.05);
        }

        .contact-button:active {
          transform: scale(0.95);
        }

        .services-button:hover {
          transform: scale(1.05);
          background-color: rgba(255, 255, 255, 0.1);
        }

        .services-button:active {
          transform: scale(0.95);
        }
      `}</style>

      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#66308d]/90 to-[#01ae9b]/90 text-white relative overflow-hidden">
          {/* SVG Decorative Elements */}
          <div className="svg-overlay absolute inset-0 pointer-events-none">
            {/* Top Left Key */}
            <svg
              className="svg-key absolute top-8 left-8 w-16 h-16 text-white/20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>

            {/* Top Right Building */}
            <svg
              className="svg-building absolute top-12 right-12 w-20 h-20 text-white/15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              <path d="M3 21h18M5 21V7l8-4v18M19 21V10l-6-3" />
              <path d="M9 9v.01M9 12v.01M9 15v.01M13 9v.01M13 12v.01M13 15v.01" />
            </svg>

            {/* Bottom Left Home */}
            <svg
              className="svg-home absolute bottom-16 left-16 w-14 h-14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>

            {/* Bottom Right Key Ring */}
            <svg
              className="svg-keyring absolute bottom-8 right-8 w-12 h-12 text-white/20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M18.09 10.37a6 6 0 1 1-10.37 0" />
              <path d="M12 2a6 6 0 0 0-6 6c0 1 .2 1.8.57 2.5L12 16l5.43-5.5c.37-.7.57-1.5.57-2.5a6 6 0 0 0-6-6z" />
            </svg>

            {/* Center Floating Elements */}
            <div className="float-1 absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full" />
            <div className="float-2 absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/25 rounded-full" />
            <div className="float-3 absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/20 rounded-full" />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="hero-title text-4xl md:text-5xl font-bold mb-6">
                خدمات حرفه ای املاک با رویکردی متفاوت
              </h2>

              <p className="hero-description text-lg md:text-xl mb-8 text-white/90">
                ما با تکیه بر تخصص و تجربه، خدمات جامع املاک را با بالاترین
                کیفیت ارائه میدهیم
              </p>

              <div className="hero-button">
                <a
                  href="/poster"
                  target="_blank"
                  className="cta-button bg-white text-[#66308d] px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-block"
                >
                  مشاهده آگهی ها
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Business Approach Section */}
        <BusinessApproach />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Call to Action */}
        <section className="pt-20 bg-white">
          <div>
            <div className="cta-container relative overflow-hidden bg-gradient-to-br from-[#66308d]/95 to-[#01ae9b]/95 p-10 md:p-16 shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3 blur-3xl"></div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="cta-title text-3xl md:text-4xl font-bold mb-6 text-white text-center">
                  آماده همکاری با شما هستیم
                </h2>

                <p className="cta-description text-white/90 mb-10 max-w-2xl mx-auto text-center text-lg leading-relaxed">
                  برای مشاوره رایگان و بررسی نیازهای ملکی خود با ما تماس بگیرید.
                  تیم متخصص ما آماده ارائه بهترین خدمات به شماست.
                </p>

                <div className="cta-buttons flex flex-col sm:flex-row gap-5 justify-center">
                  <Link href="/contactUs">
                    <button className="contact-button bg-white text-[#66308d] cursor-pointer px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                      <span>تماس با ما</span>
                      <BiHeadphone size={20} />
                    </button>
                  </Link>

                  <Link href="/services">
                    <button className="services-button bg-transparent text-white cursor-pointer border-2 border-white/70 px-8 py-4 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-sm">
                      <span>مشاهده خدمات</span>
                      <BiLeftArrowAlt size={20} />
                    </button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="cta-trust mt-12 pt-8 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <i className="fas fa-medal text-2xl"></i>
                    <span>بیش از ۱۰ سال تجربه</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <i className="fas fa-users text-2xl"></i>
                    <span>صدها مشتری راضی</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <i className="fas fa-certificate text-2xl"></i>
                    <span>تضمین کیفیت خدمات</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
