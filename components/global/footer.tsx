"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiMail, FiPhone, FiMapPin, FiInstagram } from "react-icons/fi";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
// import IranFlag from "../static/ui/iranFlag";
import toast from "react-hot-toast";
import MapModal from "../static/ui/mapModal";
import { usePathname } from "next/navigation";

// Pre-generate window positions to avoid hydration mismatch
const windowPositions = [
  { x: 150, y: 150 },
  { x: 190, y: 170 },
  { x: 230, y: 140 },
  { x: 270, y: 160 },
  { x: 310, y: 190 },
  { x: 350, y: 145 },
  { x: 390, y: 180 },
  { x: 430, y: 195 },
  { x: 470, y: 140 },
  { x: 510, y: 170 },
  { x: 550, y: 160 },
  { x: 590, y: 130 },
  { x: 630, y: 190 },
  { x: 670, y: 200 },
  { x: 710, y: 180 },
  { x: 750, y: 170 },
  { x: 790, y: 190 },
  { x: 830, y: 155 },
  { x: 870, y: 180 },
  { x: 910, y: 210 },
  { x: 950, y: 145 },
  { x: 990, y: 200 },
  { x: 1030, y: 205 },
  { x: 1070, y: 160 },
  { x: 1110, y: 175 },
  { x: 1150, y: 135 },
  { x: 1190, y: 185 },
  { x: 1230, y: 195 },
  { x: 1270, y: 215 },
  { x: 1310, y: 130 },
];

const smallWindowPositions = [
  { x: 180, y: 230 },
  { x: 225, y: 225 },
  { x: 270, y: 240 },
  { x: 315, y: 155 },
  { x: 360, y: 225 },
  { x: 405, y: 240 },
  { x: 450, y: 175 },
  { x: 495, y: 180 },
  { x: 540, y: 155 },
  { x: 585, y: 185 },
  { x: 630, y: 225 },
  { x: 675, y: 185 },
  { x: 720, y: 170 },
  { x: 765, y: 215 },
  { x: 810, y: 245 },
  { x: 855, y: 160 },
  { x: 900, y: 215 },
  { x: 945, y: 220 },
  { x: 990, y: 170 },
  { x: 1035, y: 195 },
  { x: 1080, y: 155 },
  { x: 1125, y: 210 },
  { x: 1170, y: 165 },
  { x: 1215, y: 180 },
  { x: 1260, y: 210 },
];

const footerLinks = [
  {
    title: "خدمات املاک اوج",
    links: [
      { name: "خرید ملک", href: "/poster" },
      { name: "فروش ملک", href: "/poster" },
      { name: "اجاره ملک", href: "/poster" },
      { name: "مشاوره حقوقی", href: "/services/legalConsultation" },
      { name: "ارزیابی ملک", href: "/services/realEstateConsultation" },
    ],
  },
  {
    title: "دسترسی سریع",
    links: [
      { name: "صفحه اصلی", href: "/" },
      { name: "درباره ما", href: "/aboutUs" },
      { name: "تماس با ما", href: "/contactUs" },
      { name: "املاک ویژه", href: "/offers" },
      { name: "وبلاگ", href: "/blogs" },
      { name: "فیلم آموزشی", href: "/videos" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { name: "سوالات متداول", href: "/contactUs" },
      { name: "قوانین و مقررات", href: "/terms" },
      { name: "گزارش مشکل", href: "/contactUs" },
    ],
  },
];

const socialLinks = [
  {
    icon: FiInstagram,
    href: "https://www.instagram.com/amlakouj?igsh=bWYwa3htem5nYzcz",
    label: "Instagram",
  },
  { icon: FaTelegramPlane, href: "https://t.me/Amlakoujj", label: "Telegram" },
  { icon: FaWhatsapp, href: "https://wa.me/989122266681", label: "WhatsApp" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

const Footer = () => {
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const mapButtonRef = useRef<HTMLButtonElement>(null);

  const handleMapClick = () => {
    setIsMapModalOpen(true);
  };

  // Contact information with updated map item
  const contactInfo = [
    {
      icon: FiPhone,
      text: "021-77222007",
      href: "tel:02177222007",
      isClickable: true,
      onClick: null,
    },
    {
      icon: FiMail,
      text: "amlakoujj@gmail.com",
      href: "mailto:amlakoujj@gmail.com",
      isClickable: true,
      onClick: null,
    },
    {
      icon: FiMapPin,
      text: "تهران، میدان هفت حوض کوچه سجاد پلاک 6 واحد1",
      href: "#",
      isClickable: true,
      onClick: handleMapClick,
    },
  ];

  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "لطفاً ایمیل خود را وارد کنید" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        toast.success("شما در خبرنامه عضو شدید");
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        type: "error",
        text: "خطا در ارسال. لطفاً دوباره تلاش کنید",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pathname === "/auth") {
    return null;
  }

  return (
    <>
      <footer dir="rtl" className="relative pt-20 pb-10 overflow-hidden">
        {/* SVG Building Silhouette Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 left-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              fill="#01ae9b"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>

            {/* Buildings */}
            <rect x="100" y="180" width="40" height="140" fill="#01ae9b" />
            <rect x="150" y="150" width="50" height="170" fill="#01ae9b" />
            <rect x="210" y="200" width="30" height="120" fill="#01ae9b" />
            <rect x="250" y="120" width="60" height="200" fill="#01ae9b" />
            <rect x="320" y="160" width="45" height="160" fill="#01ae9b" />
            <rect x="375" y="100" width="70" height="220" fill="#01ae9b" />
            <rect x="455" y="180" width="35" height="140" fill="#01ae9b" />
            <rect x="500" y="140" width="55" height="180" fill="#01ae9b" />
            <rect x="565" y="190" width="40" height="130" fill="#01ae9b" />
            <rect x="615" y="80" width="65" height="240" fill="#01ae9b" />
            <rect x="690" y="170" width="50" height="150" fill="#01ae9b" />
            <rect x="750" y="130" width="60" height="190" fill="#01ae9b" />
            <rect x="820" y="200" width="30" height="120" fill="#01ae9b" />
            <rect x="860" y="110" width="70" height="210" fill="#01ae9b" />
            <rect x="940" y="160" width="45" height="160" fill="#01ae9b" />
            <rect x="995" y="190" width="35" height="130" fill="#01ae9b" />
            <rect x="1040" y="140" width="55" height="180" fill="#01ae9b" />
            <rect x="1105" y="90" width="65" height="230" fill="#01ae9b" />
            <rect x="1180" y="170" width="50" height="150" fill="#01ae9b" />
            <rect x="1240" y="120" width="60" height="200" fill="#01ae9b" />
            <rect x="1310" y="180" width="40" height="140" fill="#01ae9b" />
            <rect x="1360" y="150" width="50" height="170" fill="#01ae9b" />

            {/* Windows - using pre-generated positions */}
            {windowPositions.map((pos, i) => (
              <rect
                key={`window-${i}`}
                x={pos.x}
                y={pos.y}
                width="10"
                height="10"
                fill="#ffffff"
                opacity="0.7"
              />
            ))}

            {smallWindowPositions.map((pos, i) => (
              <rect
                key={`small-window-${i}`}
                x={pos.x}
                y={pos.y}
                width="8"
                height="8"
                fill="#ffffff"
                opacity="0.7"
              />
            ))}
          </svg>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#01ae9b]/20 to-white/5 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {/* Company Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2 rounded-full px-3 py-2 w-fit">
                <div className="relative h-20 w-20 overflow-hidden">
                  <Link href={"/"}>
                    <Image
                      src="/assets/images/logo (2).png"
                      alt="املاک لوگو"
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  </Link>
                </div>
                <div className="relative h-20 w-20 overflow-hidden">
                  <Link target="_blank" href={"https://amlaktehran.org/"}>
                    <Image
                      src="/assets/etehadiye.png"
                      alt="اتحادیه"
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  </Link>
                </div>
                {/* <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center"
                >
                  <IranFlag className="w-12 h-12" />
                </motion.div> */}
                {/* <span className="text-xl font-bold text-gray-800">املاک</span> */}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                املاک اوج، پیشرو در ارائه خدمات مشاوره املاک با بیش از ۱۰ سال
                تجربه در زمینه خرید، فروش و اجاره املاک مسکونی، تجاری و اداری در
                سراسر کشور.
              </p>

              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ y: -5, color: "#01ae9b" }}
                    className="text-gray-600 hover:text-[#01ae9b] transition-colors"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-800 border-b border-[#01ae9b]/30 pb-2">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-[#01ae9b] text-sm transition-colors flex items-center gap-1"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#01ae9b]/70"></span>
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => {
                // Check if this is the map item (index 2) to handle click differently
                const isMapItem = index === 2;

                if (isMapItem) {
                  return (
                    <motion.button
                      key={index}
                      ref={mapButtonRef}
                      onClick={handleMapClick}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#01ae9b] transition-colors cursor-pointer bg-transparent border-none p-0 text-left w-full"
                    >
                      <div className="p-3 bg-[#01ae9b]/10 rounded-full text-[#01ae9b]">
                        <info.icon size={20} />
                      </div>
                      <span className="text-sm">{info.text}</span>
                    </motion.button>
                  );
                }

                return (
                  <motion.a
                    key={index}
                    href={info.href}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#01ae9b] transition-colors"
                  >
                    <div className="p-3 bg-[#01ae9b]/10 rounded-full text-[#01ae9b]">
                      <info.icon size={20} />
                    </div>
                    <span className="text-sm">{info.text}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-[#01ae9b]/90 to-[#01ae9b]/70 rounded-xl p-6 shadow-lg"
          >
            <form onSubmit={handleNewsletterSubmit} className="w-full">
              <div className="flex flex-col justify-center sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  disabled={isSubmitting}
                  className="px-4 py-3 text-left rounded-lg outline-1 placeholder:text-gray-300 text-white outline-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 sm:min-w-[700px] disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="px-6 py-3 bg-white text-[#01ae9b] rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#01ae9b] border-t-transparent rounded-full animate-spin" />
                      ... در حال ارسال
                    </>
                  ) : (
                    "عضویت"
                  )}
                </motion.button>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 text-center text-sm ${
                    message.type === "success" ? "text-white" : "text-red-300"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
            className="mt-12 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} املاک - تمامی حقوق محفوظ است
            </p>
          </motion.div>
        </div>
      </footer>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={closeMapModal}
        triggerRef={mapButtonRef as React.RefObject<HTMLElement>}
      />
    </>
  );
};

export default Footer;
