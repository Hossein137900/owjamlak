import { BiBuildingHouse } from "react-icons/bi";
import { MdOutlineAssessment } from "react-icons/md";
import { GiScales } from "react-icons/gi";

export const navItems = [
  { name: "خانه", href: "/" },
  { name: "آگهی ها", href: "/poster" },
  {
    name: "خدمات",
    href: "/services",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "مشاوره املاک",
        href: "/services/realEstateConsultation",
        icon: BiBuildingHouse,
      },
      {
        name: " همکاری",
        href: "/services/Collaboration",
        icon: MdOutlineAssessment,
      },
      {
        name: "خدمات حقوقی",
        href: "/services/legalConsultation",
        icon: GiScales,
      },
    ],
  },
  { name: "وبلاگ", href: "/blogs" },
  { name: "فیلم آموزشی", href: "/videos" },
  { name: "تماس با ما", href: "/contactUs" },
  { name: "درباره ما", href: "/aboutUs" },
  { name: "سرمایه گذاری", href: "/offers" },
];

export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    height: "100vh",
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
      delayChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

export const itemVariants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
};

export const logoVariants = {
  normal: { scale: 1 },
  scrolled: { scale: 0.9 },
};

export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

export const dropdownItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: custom * 0.1 },
  }),
  hover: {
    x: 5,
    transition: { type: "spring", stiffness: 400 },
  },
};
