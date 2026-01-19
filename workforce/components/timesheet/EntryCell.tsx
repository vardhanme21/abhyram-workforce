"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EntryCellProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number
  onChangeValue: (value: number) => void
  isReadOnly?: boolean,
  highlight?: boolean
}

export function EntryCell({ value, onChangeValue, isReadOnly, highlight, className, ...props }: EntryCellProps) {
  const [internalValue, setInternalValue] = React.useState(value === 0 ? "" : value.toString())
  const [isFocused, setIsFocused] = React.useState(false)

  // Sync internal state if prop changes (e.g. from copy paste or reset)
  React.useEffect(() => {
    setInternalValue(value === 0 ? "" : value.toString())
  }, [value])

  const handleBlur = () => {
    setIsFocused(false)
    let num = parseFloat(internalValue)
    
    // Validate
    if (isNaN(num) || num < 0) num = 0
    if (num > 24) num = 24
    
    // Round to nearest 0.25
    num = Math.round(num * 4) / 4

    setInternalValue(num === 0 ? "" : num.toString())
    onChangeValue(num)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  return (
    <div className={cn(
      "relative w-full h-full flex items-center justify-center transition-all duration-200",
      isFocused ? "bg-white shadow-sm z-10 scale-[1.02] rounded-md ring-1 ring-primary-100" : "bg-transparent",
      highlight && !isFocused && "bg-primary-50/50"
    )}>
      <input
        type="text"
        inputMode="decimal"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onFocus={(e) => {
            setIsFocused(true);
            e.target.select();
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        readOnly={isReadOnly}
        className={cn(
            "w-full h-full text-center bg-transparent focus:outline-none font-medium text-sm transition-colors",
            // Typography
            internalValue && parseFloat(internalValue) > 0 ? "text-gray-900" : "text-gray-400",
            // Conditional Colors
            isFocused && "text-primary-700",
            internalValue && parseFloat(internalValue) > 8 && "text-amber-600 font-bold",
            className
        )}
        placeholder="-"
        {...props}
      />
    </div>
  )
}
