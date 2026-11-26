"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import { mobilePrimaryNav } from "@/lib/navigation";

export function MobileTopBar() {
  return (
    <header className="flex h-16 items-center justify-between px-6 md:hidden">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring"
      >
        Morrow
      </Link>
      <Link
        href="/settings"
        aria-label="You"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-ring"
      >
        <UserRound className="size-5" aria-hidden />
      </Link>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  if (
    pathname === "/studio" ||
    pathname.startsWith("/studio/") ||
    pathname.startsWith("/content/")
  )
    return null;
  return (
    <nav
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-32px)] max-w-96 -translate-x-1/2 items-center justify-between rounded-full bg-(--mobile-nav) p-2 text-white md:hidden"
      aria-label="Primary destinations"
    >
      {mobilePrimaryNav.map((item) => (
        <NavLink key={item.href} item={item} variant="mobile" />
      ))}
    </nav>
  );
}
