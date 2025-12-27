import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-xl border-2 bg-background px-4 py-3 text-base transition-all duration-200",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        error
          ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          : "border-input hover:border-primary/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
