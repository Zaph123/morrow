import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { formControlClasses } from "@/components/ui/input"

type SelectProps = ComponentProps<"select">

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn("h-10", formControlClasses, className)}
      {...props}
    />
  )
}
