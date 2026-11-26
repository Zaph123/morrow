import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { formControlClasses } from "@/components/ui/input"

type TextareaProps = ComponentProps<"textarea">

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("min-h-24 resize-y", formControlClasses, className)}
      {...props}
    />
  )
}
