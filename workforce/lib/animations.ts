import { Variants } from "framer-motion";

export const TRANSITION_EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;
export const TRANSITION_SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;
export const TRANSITION_SMOOTH = { type: "spring", stiffness: 200, damping: 25, mass: 0.5 } as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: TRANSITION_EASE_IN_OUT } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const slideInRight = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  }
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const listItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};
