"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

interface MotionDivProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export const MotionDiv = ({ className, children, delay = 0, ...props }: MotionDivProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    transition={{ delay }}
    className={cn(className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const MotionContainer = ({ className, children, ...props }: HTMLMotionProps<"div">) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className={cn(className)}
    {...props}
  >
    {children}
  </motion.div>
);

interface MotionCardProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export const MotionCard = ({ className, children, delay = 0, ...props }: MotionCardProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={scaleIn}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    className={cn("bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const MotionHeader = ({ className, children, ...props }: HTMLMotionProps<"header">) => (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
        {children}
    </motion.header>
);
