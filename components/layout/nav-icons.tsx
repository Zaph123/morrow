import type { ComponentType, SVGProps } from "react"
import { BrainIcon } from "@/components/layout/brain-icon"
import {
  CalendarDays,
  BookOpen,
  Home,
  Lightbulb,
  UserRound,
  PencilLine,
} from "lucide-react"

import type { NavIconName } from "@/lib/navigation"

export function LibraryIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="4" width="6" height="16" />
    <line x1="9" y1="9" x2="9" y2="9.01" />
    <line x1="15" y1="9" x2="15" y2="9.01" />
  </svg>
}

export const navIcons: Record<NavIconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  home: Home,
  studio: PencilLine,
  ideas: Lightbulb,
  content: BookOpen,
  calendar: CalendarDays,
  "brand-brain": BrainIcon,
  settings: UserRound,
}
