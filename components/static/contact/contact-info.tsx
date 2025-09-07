"use client";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiInstagram,
} from "react-icons/fi";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const contactDetails = [
  {
    icon: FiMapPin,
    title: "آدرس دفتر مرکزی",
    details: "تهران، میدان حفت حوض، کوچه سجاد، پلاک 6 واحد1",
  },
  {
    icon: FiPhone,
    title: "شماره تماس",
    details: [
      { label: "دفتر مرکزی", value: "02177222007" },
      { label: "موبایل", value: "09122266681" },
    ],
  },
  {
    icon: FiMail,
    title: "ایمیل",
    details: [
      { label: "اطلاعات عمومی", value: "amlakoujj@gmail.com" },
      { label: "پشتیبانی", value: "amlakoujj@gmail.com" },
    ],
  },
  {
    icon: FiClock,
    title: "ساعات کاری",
    details:
      "ساعت کاری از 9:00 صبح تا ساعت 20:00 / پنجشنبه ها از ساعت 9:00 تا 19:00",
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

const ContactInfo = () => {
  return (
    <div dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
          اطلاعات تماس
        </h2>

        <div className="space-y-8">
          {contactDetails.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex gap-4"
            >
              <div className="mt-1 p-3 bg-[#01ae9b]/10 text-[#01ae9b] rounded-full h-fit">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                {typeof item.details === "string" ? (
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">
                    {item.details}
                  </p>
                ) : (
                  <div className="mt-1 space-y-1">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-gray-500">{detail.label}: </span>
                        <span className="text-gray-700 font-medium">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-100"
        >
          <h3 className="font-medium text-gray-800 mb-4">
            ما را در شبکه‌های اجتماعی دنبال کنید
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ y: -5, color: "#01ae9b" }}
                className="p-3 bg-gray-100 rounded-full text-gray-600 hover:text-[#01ae9b] hover:bg-[#01ae9b]/10 transition-colors"
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
