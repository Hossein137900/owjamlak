"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiMapPin, FiPhone } from "react-icons/fi";

const branch = {
  name: "دفتر مرکزی",
  address: "تهران، میدان هفت حوض، کوچه سجاد، پلاک 6 واحد1",
  phone: "021-77222007",
  lat: 35.7575,
  lng: 51.4106,
};

const ContactMap = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="md:px-20 container mx-auto w-full px-4">
        {/* عنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            آدرس <span className="text-[#01ae9b]">دفتر مرکزی</span>
          </h2>
          <p className="text-gray-600 mt-2">
            برای مراجعه حضوری به دفتر مرکزی، مشخصات زیر را دنبال کنید
          </p>
        </motion.div>

        {/* کارت آدرس + نقشه */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* اطلاعات آدرس */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className=" p-8 flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#01ae9b] text-white rounded-full shadow-md">
                <FiMapPin size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{branch.name}</h3>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {branch.address}
            </p>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 text-[#01ae9b] rounded-full">
                <FiPhone size={18} />
              </div>
              <Link
                href="tel:02177222007"
                className="text-gray-800 font-medium"
              >
                {branch.phone}
              </Link>
            </div>
          </motion.div>

          {/* نقشه */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="  rounded-xl   overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1646861.4452956964!2d50.6304932!3d36.2752788!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e031ab7cbbfef%3A0xc25c1d12d9dcb025!2z2YXYtNin2YjYsduM2YYg2KfZhdmE2KfaqSDYp9mI2Kw!5e0!3m2!1sen!2s!4v1756149707039!5m2!1sen!2s"
              width="600"
              height="450"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
