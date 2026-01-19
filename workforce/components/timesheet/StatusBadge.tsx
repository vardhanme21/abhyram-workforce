import { cn } from "@/lib/utils"

type StatusType = "Draft" | "Submitted" | "Approved" | "Rejected"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig = {
  Draft: {
    label: "Draft",
    // Violet/Gray theme for draft
    className: "bg-white/50 text-slate-600 border-slate-200 backdrop-blur-md shadow-sm",
    dotColor: "bg-slate-400",
  },
  Submitted: {
    label: "Submitted",
    // Amber/Orange for pending
    className: "bg-amber-50/80 text-amber-700 border-amber-200/50 backdrop-blur-md shadow-sm",
    dotColor: "bg-amber-500 animate-pulse",
  },
  Approved: {
    label: "Approved",
    // Emerald/Teal for success
    className: "bg-emerald-50/80 text-emerald-700 border-emerald-200/50 backdrop-blur-md shadow-sm",
    dotColor: "bg-emerald-500",
  },
  Rejected: {
    label: "Rejected",
    // Rose/Red for error
    className: "bg-rose-50/80 text-rose-700 border-rose-200/50 backdrop-blur-md shadow-sm",
    dotColor: "bg-rose-500",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Draft

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
        config.className,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full ring-1 ring-inset ring-black/5", config.dotColor)} />
      {config.label}
    </div>
  )
}
