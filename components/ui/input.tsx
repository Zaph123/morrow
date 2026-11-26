import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export const formControlClasses =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-base md:text-sm leading-6 text-foreground placeholder:text-muted-foreground outline-none motion-safe:transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25"

type InputProps = ComponentProps<"input">

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn("h-10", formControlClasses, className)}
      {...props}
    />
  )
}
