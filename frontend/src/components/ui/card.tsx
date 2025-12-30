import * as React from "react"

import {cn} from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

function CardInteractive({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-interactive"
      className={cn(
        "rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/20 active:scale-[0.99] touch-manipulation",
        className
      )}
      {...props}
    />
  )
}

function CardGlass({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-glass"
      className={cn(
        "glass rounded-2xl text-card-foreground transition-all",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-4 md:p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-tight tracking-tight md:text-xl", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-4 pt-0 md:p-6 md:pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 p-4 pt-0 md:p-6 md:pt-0", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardInteractive,
  CardGlass,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
