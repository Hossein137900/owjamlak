"use client";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function WhyUs() {
  const listItems = [
    "معاملات ۱۰۰٪ امن",
    "طبقه‌بندی‌شده از خواص",
    "مورد اعتماد هزاران نفر",
    "خرید و فروش امن",
  ];

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

        @keyframes slideUpScale {
          from {
            transform: translateY(60px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUpScaleImage {
          from {
            transform: translateY(80px) scale(0.9) rotateY(15deg);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1) rotateY(0deg);
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

        @keyframes slideUpMedium {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideRight {
          from {
            transform: translateX(-30px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes buttonFadeIn {
          from {
            transform: translateY(20px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes circleExpand {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 0.2;
          }
        }

        .container-animate {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .text-content {
          animation: slideUpScale 0.8s ease-out forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }

        .image-content {
          animation: slideUpScaleImage 1s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .title-animate {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .description-animate {
          animation: slideUpMedium 0.8s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .list-item {
          display: flex;
          animation: slideRight 0.6s ease-out forwards;
          opacity: 0;
          transition: transform 0.2s ease;
        }

        .list-item:nth-child(1) {
          animation-delay: 0.4s;
        }
        .list-item:nth-child(2) {
          animation-delay: 0.5s;
        }
        .list-item:nth-child(3) {
          animation-delay: 0.6s;
        }
        .list-item:nth-child(4) {
          animation-delay: 0.7s;
        }

        .list-item:hover {
          transform: translateX(5px);
        }

        .check-icon {
          transition: transform 0.3s ease;
        }

        .button-animate {
          animation: buttonFadeIn 0.6s ease-out forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }

        .cta-button {
          transition: all 0.2s ease;
        }

        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(1, 174, 155, 0.3);
        }

        .cta-button:active {
          transform: scale(0.95);
        }

        .bg-circle {
          animation: circleExpand 1.2s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .image-wrapper {
          transition: transform 0.3s ease;
        }

        .image-wrapper:hover {
          transform: scale(1.02) rotateY(5deg);
        }

        .image-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-wrapper:hover .image-overlay {
          opacity: 1;
        }
      `}</style>

      <div
        dir="rtl"
        className="container-animate container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-16 px-4 md:px-20"
      >
        {/* Text Content Section */}
        <div className="text-content w-full lg:w-1/2 text-right relative">
          {/* Animated Color spot circle in the background */}
          <div className="bg-circle absolute bottom-28 right-8 w-40 h-40 rounded-full blur-[50px] bg-[#01ae9b] z-0" />

          {/* Content with higher z-index to appear above the color spots */}
          <div className="relative z-10">
            {/* Animated Title */}
            <h2 className="title-animate text-2xl md:text-4xl font-extrabold text-gray-800 mb-1">
              چرا باید ما را انتخاب کنید
            </h2>

            {/* Animated Description */}
            <p className="description-animate text-gray-600 mb-6 text-sm md:text-base">
              مشاور املاک اوج با سال‌ها تجربه در زمینه خرید، فروش و اجاره انواع
              ملک، بهترین خدمات مشاوره املاک را با قیمت‌های منصفانه و شرایط ویژه
              ارائه می‌دهد.
            </p>

            {/* Animated List */}
            <ul className="space-y-3 text-sm md:text-base text-gray-700">
              {listItems.map((item, index) => (
                <li key={index} className="list-item   items-center gap-2">
                  <div className="check-icon">
                    <FaCheckCircle className="text-[#01ae9b]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* Animated Button */}
            <div className="button-animate mt-6">
              <button className="cta-button bg-[#01ae9b] text-white px-6 py-3 rounded-full text-sm hover:bg-[#019887] transition-all">
                <Link href="/aboutUs">اطلاعات بیشتر</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="image-content w-full md:w-1/2 md:h-1/2">
          <div className="image-wrapper relative">
            <Image
              src="/assets/images/hero4.jpg"
              alt="Why choose us"
              width={2000}
              height={2000}
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />

            {/* Animated overlay on hover */}
            <div className="image-overlay absolute inset-0 bg-gradient-to-t from-[#01ae9b]/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </>
  );
}
