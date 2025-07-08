import Image from "next/image";
import {
  FaHome,
  FaMoneyBillWave,
  FaHeadset,
  FaChartLine,
} from "react-icons/fa";

export default function AboutUsStats() {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
      {/* Right Text */}
      <div className="md:w-1/2 space-y-6 text-right">
        <h2 className="text-2xl md:text-4xl text-gray-500 leading-tight">
          آینده‌ی سرمایه‌گذاری شما، امروز در{" "}
          <span className="text-[#01ae9b] text-5xl font-extrabold">اوج</span> رقم می‌خورد
        </h2>
        <p className="text-gray-600 leading-loose text-lg">
          توی مشاور املاک اوج، ما فقط خونه نمی‌فروشیم؛ ما کمک می‌کنیم تا بهترین
          انتخاب رو با خیال راحت انجام بدی. از جست‌وجوی یه خونه‌ی دنج برای زندگی
          تا یه سرمایه‌گذاری پرسود کلان، ما بلدیم چطوری کار می‌کنه.
        </p>

        {/* Stats in horizontal layout for mobile */}
        <div className="flex flex-wrap gap-4 md:hidden mt-6">
          <StatCard
            title="آگهی ها"
            content="اجاره - 1000+ | خرید - 3000+"
            icon={<FaHome className="h-5 w-5" />}
            bgColor="bg-white"
          />
          <StatCard
            title="معاملات"
            content="روزانه: +100 | ماهانه: +10000"
            icon={<FaMoneyBillWave className="h-5 w-5" />}
            bgColor="bg-[#01ae9b]"
            textColor="text-white"
          />
          <StatCard
            title="پشتیبانی"
            content="24 ساعته | قرارداد رسمی در محل"
            icon={<FaHeadset className="h-5 w-5" />}
            bgColor="bg-white"
          />
        </div>

        <div className="mt-8">
          <button className="bg-[#01ae9b]/10 border-2 border-[#01ae9b] text-[#01ae9b] hover:text-white hover:bg-[#01ae9b] px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 justify-center">
            مشاهده آمار بیشتر
            <FaChartLine className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Left Image + Stats */}
      <div className="md:w-1/2 relative">
        <div className="rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/assets/images/aboutus1.png"
            alt="ساختمان های مسکونی"
            width={500}
            height={500}
            className="rounded-xl object-cover w-full"
          />
        </div>

        {/* Stats Cards - Only visible on desktop */}
        <div className="absolute top-10 left-6 space-y-3 hidden md:block">
          <StatCard
            title="آگهی ها"
            content="اجاره - 1000+ | خرید - 3000+"
            icon={<FaHome className="h-5 w-5" />}
            bgColor="bg-white"
          />
          <StatCard
            title="معاملات"
            content="روزانه: +100 | ماهانه: +10000"
            icon={<FaMoneyBillWave className="h-5 w-5" />}
            bgColor="bg-[#01ae9b]"
            textColor="text-white"
          />
          <StatCard
            title="پشتیبانی"
            content="24 ساعته | قرارداد رسمی در محل"
            icon={<FaHeadset className="h-5 w-5" />}
            bgColor="bg-white"
          />
        </div>
      </div>
    </div>
  );
}

// Reusable stat card component
interface StatCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
}

function StatCard({
  title,
  content,
  icon,
  bgColor,
  textColor = "text-gray-800",
}: StatCardProps) {
  return (
    <div
      className={`${bgColor} ${textColor} rounded-xl shadow-lg px-6 py-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm font-bold">{title}</p>
      </div>
      <p
        className={`text-sm ${
          textColor === "text-white" ? "text-white/80" : "text-gray-500"
        }`}
      >
        {content}
      </p>
    </div>
  );
}
