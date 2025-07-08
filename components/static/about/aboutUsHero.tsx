import Image from "next/image";
import { FaUser, FaArrowLeft } from "react-icons/fa";

const advisorItems = [
  {
    title: "مشاوره اختصاصی",
    description: "مشاوره تخصصی برای خرید و فروش املاک",
  },
  {
    title: "بررسی قیمت منطقه",
    description: "تحلیل قیمت‌های منطقه برای تصمیم بهتر",
  },
  {
    title: "پشتیبانی ۲۴ ساعته",
    description: "همراه شما در تمام مراحل معامله",
  },
];

export default function AboutUsHero() {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
      {/* Left Content - Image with Advisor Cards */}
      <div className="md:w-1/2 relative mt-12 md:mt-0">
        <div className="relative z-10 rounded-full overflow-hidden shadow-2xl border-4 border-white">
          <Image
            src="/assets/images/aboutus2.jpg"
            alt="مشاوران املاک اوج"
            width={500}
            height={500}
            className="rounded-full object-cover"
          />
        </div>

        {/* Advisor Cards */}
        <div className="absolute top-4 left-4 space-y-4 z-20">
          {advisorItems.map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-xl p-4 flex items-center gap-4 max-w-xs transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#01ae9b]">
                <FaUser className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Text */}
      <div className="md:w-1/2 space-y-6 text-right mt-12">
      <h1 className="text-2xl md:text-4xl text-gray-500 leading-tight">
      با <span className="text-[#01ae9b] text-5xl font-extrabold">اوج</span>
          <br />
       همیشه یه همراه داری !
        </h1>
        <p className="text-gray-600 leading-loose text-lg">
          توی مشاور املاک اوج، ما فقط خونه نمی‌فروشیم؛ ما کمک می‌کنیم تا تو
          بهترین انتخاب رو با خیال راحت انجام بدی. از جست‌وجوی یه خونه‌ی دنج
          برای زندگی تا یه سرمایه‌گذاری پرسود کلان، ما بلدیم چطوری کار می‌کنه و
          همیشه سعی می‌کنیم مشاوره‌ای بدیم که به نفع تو باشه.
        </p>
        <button className="bg-[#01ae9b] hover:bg-[#01ae9b]/80 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 justify-center">
          مشاوره رایگان
          <FaArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
