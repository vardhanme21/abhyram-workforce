"use client"

import { motion } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/Button"
import React from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionButton = motion(Button as any)

export function AnimatedButton({ 
  children, 
  className,
  ...props 
}: ButtonProps) {
  return (
    <MotionButton
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </MotionButton>
  )
}
