import { cn } from "@/lib/utils"
import { CheckCircle, Clock, FileEdit, AlertCircle } from "lucide-react"

type StatusType = "Draft" | "Submitted" | "Approved" | "Rejected"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig = {
  Draft: {
    label: "Draft",
    icon: FileEdit,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  Submitted: {
    label: "Submitted",
    icon: Clock,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Approved: {
    label: "Approved",
    icon: CheckCircle,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  Rejected: {
    label: "Rejected",
    icon: AlertCircle,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Draft
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  )
}
