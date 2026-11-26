"use client";

// Adapted from the free, MIT-licensed UIArc segmented-control registry source.
// Morrow maps its module styles to app tokens; interaction source is retained.
// Source: https://uiarc.dev/r/segmented-control.json (reviewed 2026-11-25)
import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";

export interface Segment {
  value: string;
  label: string;
  accessory?: ReactNode;
}

export interface SegmentedControlProps {
  options: Segment[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  onOptionIntent?: (value: string) => void;
  fullWidth?: boolean;
  className?: string;
}

export default function SegmentedControl({
  options,
  value,
  onValueChange,
  label,
  onOptionIntent,
  fullWidth,
  className,
}: SegmentedControlProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = track.current;
    if (!node) return;
    const edges = () => {
      const rest = node.scrollWidth - node.clientWidth - node.scrollLeft;
      node.toggleAttribute("data-fade-start", node.scrollLeft > 1);
      node.toggleAttribute("data-fade-end", rest > 1);
    };
    edges();
    node.addEventListener("scroll", edges, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(edges);
    observer?.observe(node);
    return () => {
      node.removeEventListener("scroll", edges);
      observer?.disconnect();
    };
  }, [options.length]);

  const first = useRef(true);
  useEffect(() => {
    const node = track.current;
    const button = node?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!node || !button || node.scrollWidth <= node.clientWidth) {
      first.current = false;
      return;
    }
    const room = 20;
    const start = button.offsetLeft - room;
    const end = button.offsetLeft + button.offsetWidth + room - node.clientWidth;
    const left = node.scrollLeft > start ? start : node.scrollLeft < end ? end : node.scrollLeft;
    if (left !== node.scrollLeft) {
      node.scrollTo({ left: Math.max(0, left), behavior: first.current || reduced ? "auto" : "smooth" });
    }
    first.current = false;
  }, [value, reduced]);

  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value));
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    const target = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? selectedIndex === last ? 0 : selectedIndex + 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? selectedIndex === 0 ? last : selectedIndex - 1
        : event.key === "Home" ? 0 : event.key === "End" ? last : -1;
    if (target < 0 || !options[target]) return;
    event.preventDefault();
    onValueChange(options[target].value);
    track.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(options[target].value)}"]`)
      ?.focus({ preventScroll: true });
  };

  return (
    <div
      className={`morrow-segmented-root ${className ?? ""}`}
      role="group"
      aria-label={label}
      data-full-width={fullWidth || undefined}
    >
      <LayoutGroup id={id}>
        <motion.div ref={track} layoutScroll className="morrow-segmented-track">
          {options.map((option, index) => (
            <button
              key={option.value}
              id={`${id}-${option.value}`}
              className="morrow-segmented-button"
              type="button"
              data-value={option.value}
              aria-pressed={value === option.value}
              tabIndex={index === selectedIndex ? 0 : -1}
              onClick={() => onValueChange(option.value)}
              onKeyDown={onKeyDown}
              onPointerEnter={onOptionIntent ? () => onOptionIntent(option.value) : undefined}
              onFocus={onOptionIntent ? () => onOptionIntent(option.value) : undefined}
            >
              {value === option.value && (
                <motion.span
                  className="morrow-segmented-selection"
                  layoutId="selection"
                  layoutDependency={value}
                  transition={reduced ? { duration: 0 } : motionTokens.spring.morph}
                  aria-hidden="true"
                />
              )}
              <span className="morrow-segmented-label">{option.label}{option.accessory}</span>
            </button>
          ))}
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
