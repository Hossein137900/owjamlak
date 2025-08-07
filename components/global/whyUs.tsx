"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function WhyUs() {
  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for text content (left side)
  const textContentVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  // Animation variants for image (right side)
  const imageVariants = {
    hidden: {
      y: 80,
      opacity: 0,
      scale: 0.9,
      rotateY: 15,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 1,
      },
    },
  };

  // Animation variants for title
  const titleVariants = {
    hidden: {
      y: 40,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for description
  const descriptionVariants = {
    hidden: {
      y: 30,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for list items
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const listItemVariants = {
    hidden: {
      x: -30,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  // Animation variants for button
  const buttonVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.8,
        duration: 0.6,
      },
    },
  };

  // Animation variants for background circle
  const circleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 0.2,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay: 0.5,
        duration: 1.2,
      },
    },
  };

  return (
    <motion.div
      dir="rtl"
      className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-16 px-4 md:px-20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
        margin: "0px 0px -50px 0px",
      }}
    >
      {/* Text Content Section */}
      <motion.div
        variants={textContentVariants}
        className="w-full lg:w-1/2 text-right relative"
      >
        {/* Animated Color spot circle in the background */}
        <motion.div
          className="absolute bottom-28 right-8 w-40 h-40 rounded-full blur-[50px] bg-[#01ae9b] z-0"
          variants={circleVariants}
        />

        {/* Content with higher z-index to appear above the color spots */}
        <div className="relative z-10">
          {/* Animated Title */}
          <motion.h2
            className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-1"
            variants={titleVariants}
          >
            چرا باید ما را انتخاب کنید
          </motion.h2>

          {/* Animated Description */}
          <motion.p
            className="text-gray-600 mb-6 text-sm md:text-base"
            variants={descriptionVariants}
          >
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است.
          </motion.p>

          {/* Animated List */}
          <motion.ul
            className="space-y-3 text-sm md:text-base text-gray-700"
            variants={listVariants}
          >
            {[
              "معاملات ۱۰۰٪ امن",
              "طبقه‌بندی‌شده از خواص",
              "مورد اعتماد هزاران نفر",
              "خرید و فروش امن",
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2"
                variants={listItemVariants}
                whileHover={{
                  x: 5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.3 },
                  }}
                >
                  <FaCheckCircle className="text-[#01ae9b]" />
                </motion.div>
                {item}
              </motion.li>
            ))}
          </motion.ul>

          {/* Animated Button */}
          <motion.div className="mt-6" variants={buttonVariants}>
            <motion.button
              className="bg-[#01ae9b] text-white px-6 py-3 rounded-full text-sm hover:bg-[#019887] transition-all"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(1, 174, 155, 0.3)",
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 },
              }}
            >
              <Link href="/aboutUs">اطلاعات بیشتر</Link>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Section */}
      <motion.div className="w-full md:w-1/2 md:h-1/2" variants={imageVariants}>
        <motion.div
          whileHover={{
            scale: 1.02,
            rotateY: 5,
            transition: { duration: 0.3 },
          }}
          className="relative"
        >
          <Image
            src="/assets/images/hero4.jpg"
            alt="Why choose us"
            width={2000}
            height={2000}
            className="rounded-2xl shadow-xl w-full h-auto object-cover"
          />

          {/* Animated overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#01ae9b]/20 to-transparent rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
