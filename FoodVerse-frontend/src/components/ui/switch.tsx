import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked 
          ? "bg-primary border-2 border-transparent" 
          : "bg-gray-300 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
      ref={ref}
    >      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5 bg-white" : "translate-x-0 bg-white"
        )}
      />
    </button>
  )
)
Switch.displayName = "Switch"

export { Switch }
