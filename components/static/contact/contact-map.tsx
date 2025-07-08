"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";

const branches = [
  {
    id: "central",
    name: "دفتر مرکزی",
    address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳، طبقه ۴",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    lat: 35.7575,
    lng: 51.4106,
  },
  {
    id: "north",
    name: "شعبه شمال تهران",
    address: "تهران، نیاوران، خیابان باهنر، پلاک ۴۵",
    phone: "۰۲۱-۲۲۳۴۵۶۷۸",
    lat: 35.8012,
    lng: 51.47,
  },
  {
    id: "west",
    name: "شعبه غرب تهران",
    address: "تهران، سعادت آباد، میدان کاج، پلاک ۷۸",
    phone: "۰۲۱-۲۳۴۵۶۷۸۹",
    lat: 35.7719,
    lng: 51.365,
  },
];

const ContactMap = () => {
  const [activeBranch, setActiveBranch] = useState(branches[0]);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            شعبه‌های <span className="text-[#01ae9b]">املاک</span>
          </h2>
          <p className="text-gray-600 mt-2">
            شما می‌توانید به نزدیک‌ترین شعبه املاک مراجعه کنید
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  شعبه‌های ما
                </h3>
                <div className="space-y-3">
                  {branches.map((branch) => (
                    <motion.button
                      key={branch.id}
                      onClick={() => setActiveBranch(branch)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-right p-4 rounded-lg transition-colors ${
                        activeBranch.id === branch.id
                          ? "bg-[#01ae9b]/10 border border-[#01ae9b]/30"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full mt-1 ${
                            activeBranch.id === branch.id
                              ? "bg-[#01ae9b] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <FiMapPin size={16} />
                        </div>
                        <div>
                          <h4
                            className={`font-medium ${
                              activeBranch.id === branch.id
                                ? "text-[#01ae9b]"
                                : "text-gray-800"
                            }`}
                          >
                            {branch.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {branch.address}
                          </p>
                          <p className="text-sm font-medium text-gray-700 mt-2">
                            {branch.phone}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="relative h-[400px] w-full">
                {/* This is where you would integrate a real map like Google Maps or Leaflet */}
                {/* For now, we'll use a placeholder with the location information */}
                <div className="absolute inset-0 bg-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9661127815736!2d${activeBranch.lng}!3d${activeBranch.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDE1JzI3LjAiTiA1McKwMjQnMzguMiJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={`${activeBranch.name} on map`}
                  ></iframe>
                </div>

                <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-white/90 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#01ae9b] text-white rounded-full">
                      <FiMapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {activeBranch.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activeBranch.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;
