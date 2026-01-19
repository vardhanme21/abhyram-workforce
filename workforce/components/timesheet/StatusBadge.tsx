import { cn } from "@/lib/utils"

type StatusType = "Draft" | "Submitted" | "Approved" | "Rejected"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig = {
  Draft: {
    label: "Draft",
    // Violet/Indigo Neon
    className: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    dotColor: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]",
  },
  Submitted: {
    label: "Submitted",
    // Amber Neon
    className: "bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    dotColor: "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  },
  Approved: {
    label: "Approved",
    // Emerald Neon
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  },
  Rejected: {
    label: "Rejected",
    // Rose Neon
    className: "bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    dotColor: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Draft

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all duration-300 hover:scale-105",
        config.className,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full ring-0", config.dotColor)} />
      {config.label}
    </div>
  )
}
