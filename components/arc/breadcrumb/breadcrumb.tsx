"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { motionTokens } from "@/components/arc/lib/motion-tokens";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
}

/** UIArc breadcrumb adapted to Morrow's Next.js links and compact toolbar styling. */
export function Breadcrumb({ items, ariaLabel = "Breadcrumb" }: BreadcrumbProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const still = { duration: 0 };
  const pathLength = items.length;

  return (
    <nav className="morrow-breadcrumb" aria-label={ariaLabel}>
      <ol>
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, index) => {
            const current = index === items.length - 1;
            return (
              <motion.li
                key={index}
                layout={reducedMotion ? false : "position"}
                layoutDependency={pathLength}
                initial={reducedMotion ? false : { opacity: 0, x: -8, filter: `blur(${motionTokens.blur.subtle}px)` }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reducedMotion
                  ? { opacity: 0, transition: still }
                  : { opacity: 0, x: -4, filter: `blur(${motionTokens.blur.subtle}px)`, transition: { duration: motionTokens.duration.instant, ease: [...motionTokens.ease.standard] } }}
                transition={reducedMotion
                  ? still
                  : { duration: motionTokens.duration.standard, ease: [...motionTokens.ease.enter], layout: motionTokens.spring.smooth }}
              >
                {index > 0 && <ChevronRight aria-hidden="true" />}
                {!current && item.href ? (
                  <Link href={item.href} data-label={item.label} onClick={item.onClick}>
                    {item.label}
                  </Link>
                ) : !current && item.onClick ? (
                  <button type="button" data-label={item.label} onClick={item.onClick}>
                    {item.label}
                  </button>
                ) : (
                  <span aria-current={current ? "page" : undefined} data-label={item.label} title={item.label}>
                    {item.label}
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
