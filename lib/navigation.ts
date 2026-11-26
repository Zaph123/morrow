export type NavIconName =
  | "home"
  | "studio"
  | "ideas"
  | "content"
  | "calendar"
  | "brand-brain"
  | "settings"

export type NavItem = {
  href: string
  label: string
  description: string
  icon: NavIconName
}

/** Shared destinations for the desktop sidebar and five-item mobile capsule. */
export const primaryNav: NavItem[] = [
  {
    href: "/",
    label: "Home",
    description: "Daily briefing and next actions",
    icon: "home",
  },
  {
    href: "/studio",
    label: "Studio",
    description: "Brainstorm, draft, and refine",
    icon: "studio",
  },
  {
    href: "/content",
    label: "Library",
    description: "Drafts and published work",
    icon: "content",
  },
  {
    href: "/ideas",
    label: "Ideas",
    description: "Quick capture and development",
    icon: "ideas",
  },
  {
    href: "/brand-brain",
    label: "Brand Brain",
    description: "Identity, voice, and strategy",
    icon: "brand-brain",
  },
]

export const settingsNav: NavItem = {
  href: "/settings",
  label: "You",
  description: "Preferences and data",
  icon: "settings",
}

/** All five destinations stay directly reachable on small screens. */
export const mobilePrimaryNav: NavItem[] = primaryNav

export const mobileSecondaryNav: NavItem[] = [
  ...primaryNav.slice(4),
  settingsNav,
]

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
