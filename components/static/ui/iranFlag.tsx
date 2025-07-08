import { motion } from "framer-motion";

const IranFlag = ({ className = "w-8 h-6" }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 900 600"
    className={className}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
  >
    {/* Green stripe */}
    <rect width="900" height="200" fill="#239F40" />

    {/* White stripe */}
    <rect y="200" width="900" height="200" fill="#FFFFFF" />

    {/* Red stripe */}
    <rect y="400" width="900" height="200" fill="#DA0000" />

    {/* Emblem in center */}
    <g transform="translate(450, 300)">
      {/* Simplified emblem - stylized tulip/sword design */}
      <motion.path
        d="M0,-40 C-15,-25 -15,0 0,15 C15,0 15,-25 0,-40 Z M-8,15 L8,15 L6,35 L-6,35 Z"
        fill="#DA0000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.circle
        cx="0"
        cy="0"
        r="25"
        fill="none"
        stroke="#DA0000"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      />
    </g>

    {/* Decorative border pattern */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      {/* Top border pattern */}
      <rect y="190" width="900" height="10" fill="#FFFFFF" opacity="0.3" />
      {/* Bottom border pattern */}
      <rect y="400" width="900" height="10" fill="#FFFFFF" opacity="0.3" />
    </motion.g>
  </motion.svg>
);

export default IranFlag;
