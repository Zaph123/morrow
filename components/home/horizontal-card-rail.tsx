"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react"

type HorizontalCardRailProps = {
  children: ReactNode
  label: string
}

type DragSession = {
  pointerId: number
  startX: number
  startY: number
  startScrollLeft: number
  dragging: boolean
  previousX: number
  previousAt: number
  lastX: number
  lastAt: number
  startedAt: number
  firstMoveAt: number | null
}

export function HorizontalCardRail({ children, label }: HorizontalCardRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragSession | null>(null)
  const suppressClickRef = useRef(false)
  const pointerFocusRef = useRef(false)
  const glideRef = useRef<AnimationPlaybackControls | null>(null)
  const scrollValue = useMotionValue(0)
  const [dragging, setDragging] = useState(false)

  const attachRail = useCallback((rail: HTMLDivElement | null) => {
    railRef.current = rail
    if (rail) {
      if (rail.scrollWidth > rail.clientWidth + 1) rail.setAttribute("data-overflowing", "true")
      else rail.removeAttribute("data-overflowing")
    }
  }, [])

  const cancelGlide = useCallback(() => {
    glideRef.current?.stop()
    glideRef.current = null
    const rail = railRef.current
    if (rail) scrollValue.jump(rail.scrollLeft)
    rail?.removeAttribute("data-momentum")
  }, [scrollValue])

  useLayoutEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const measure = () => {
      if (rail.scrollWidth > rail.clientWidth + 1) rail.setAttribute("data-overflowing", "true")
      else rail.removeAttribute("data-overflowing")
    }
    measure()
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure)
    resizeObserver?.observe(rail)
    for (const child of rail.children) resizeObserver?.observe(child)
    const mutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => {
      measure()
      resizeObserver?.disconnect()
      resizeObserver?.observe(rail)
      for (const child of rail.children) resizeObserver?.observe(child)
    })
    mutationObserver?.observe(rail, { childList: true, subtree: true, characterData: true })
    window.addEventListener("resize", measure)
    return () => {
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => { if (preference.matches) cancelGlide() }
    preference.addEventListener("change", onChange)
    return () => {
      preference.removeEventListener("change", onChange)
      glideRef.current?.stop()
    }
  }, [cancelGlide])

  const finishPointer = useCallback((event: PointerEvent) => {
    const drag = dragRef.current
    const rail = railRef.current
    if (!drag || !rail || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    rail.removeAttribute("data-pointer-active")
    if (!drag.dragging) return

    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId)
    setDragging(false)
    suppressClickRef.current = true
    requestAnimationFrame(() => { suppressClickRef.current = false })

    if (event.type === "pointercancel") return

    const now = performance.now()
    const elapsed = drag.lastAt - drag.previousAt
    const sampleAge = now - drag.lastAt
    const recentVelocity = elapsed > 0
      ? -(drag.lastX - drag.previousX) / elapsed * 1000
      : 0
    const gestureElapsed = drag.lastAt - (drag.firstMoveAt ?? drag.startedAt)
    const gestureVelocity = gestureElapsed > 0
      ? -(drag.lastX - drag.startX) / gestureElapsed * 1000
      : recentVelocity
    const velocity = sampleAge < 500
      ? (recentVelocity * .65 + gestureVelocity * .35) * Math.exp(-sampleAge / 300)
      : 0
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const start = rail.scrollLeft
    const measuredDistance = velocity * .24
    const minimumGlide = Math.min(24, Math.abs(drag.lastX - drag.startX) * .2)
    const glideDistance = Math.abs(velocity) > 1
      ? Math.sign(velocity) * Math.max(minimumGlide, Math.abs(measuredDistance))
      : 0
    const destination = Math.max(0, Math.min(maxScroll, start + Math.max(-480, Math.min(480, glideDistance))))
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(destination - start) < 1) return

    scrollValue.jump(start)
    rail.setAttribute("data-momentum", "true")
    glideRef.current = animate(scrollValue, destination, {
      type: "spring",
      stiffness: 420,
      damping: 48,
      velocity,
      onUpdate: value => { rail.scrollLeft = value },
      onComplete: () => {
        glideRef.current = null
        rail.removeAttribute("data-momentum")
      },
    })
  }, [scrollValue])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = dragRef.current
      const rail = railRef.current
      if (!drag || !rail || drag.pointerId !== event.pointerId) return
      const deltaX = event.clientX - drag.startX
      const deltaY = event.clientY - drag.startY
      if (!drag.dragging) {
        if (Math.abs(deltaY) > 6 && Math.abs(deltaY) >= Math.abs(deltaX)) {
          dragRef.current = null
          rail.removeAttribute("data-pointer-active")
          return
        }
        if (Math.abs(deltaX) <= 6 || Math.abs(deltaX) <= Math.abs(deltaY)) return
        drag.dragging = true
        setDragging(true)
        rail.setPointerCapture(event.pointerId)
      }
      if (event.cancelable) event.preventDefault()
      const now = performance.now()
      drag.firstMoveAt ??= now
      drag.previousX = drag.lastX
      drag.previousAt = drag.lastAt
      drag.lastX = event.clientX
      drag.lastAt = now
      rail.scrollLeft = drag.startScrollLeft - deltaX
    }
    const up = (event: PointerEvent) => {
      finishPointer(event)
      pointerFocusRef.current = false
    }
    window.addEventListener("pointermove", move, { passive: false })
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
    }
  }, [finishPointer])

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointerFocusRef.current = true
    if (event.pointerType === "mouse") event.currentTarget.setAttribute("data-mouse-interaction", "true")
    else event.currentTarget.removeAttribute("data-mouse-interaction")
    cancelGlide()
    const overflowing = event.currentTarget.scrollWidth > event.currentTarget.clientWidth + 1
    if (overflowing) event.currentTarget.setAttribute("data-overflowing", "true")
    else event.currentTarget.removeAttribute("data-overflowing")
    if (!overflowing || event.pointerType !== "mouse" || event.button !== 0) return
    const now = performance.now()
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      dragging: false,
      previousX: event.clientX,
      previousAt: now,
      lastX: event.clientX,
      lastAt: now,
      startedAt: now,
      firstMoveAt: null,
    }
    event.currentTarget.setAttribute("data-pointer-active", "true")
  }

  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }

  function revealKeyboardFocus(event: React.FocusEvent<HTMLDivElement>) {
    if (pointerFocusRef.current || !(event.target instanceof HTMLElement) || !event.target.matches(":focus-visible")) return
    const rail = event.currentTarget
    const box = rail.getBoundingClientRect()
    const focused = event.target.getBoundingClientRect()
    if (focused.right > box.right) rail.scrollLeft += focused.right - box.right + 8
    else if (focused.left < box.left) rail.scrollLeft -= box.left - focused.left + 8
    else return
    rail.setAttribute("data-keyboard-reveal", "true")
    requestAnimationFrame(() => rail.removeAttribute("data-keyboard-reveal"))
  }

  return (
    <div
      ref={attachRail}
      className="home-actions horizontal-card-rail"
      role="region"
      aria-label={label}
      data-dragging={dragging ? "true" : undefined}
      onPointerDown={onPointerDown}
      onClickCapture={onClickCapture}
      onFocusCapture={revealKeyboardFocus}
      onWheel={cancelGlide}
      onKeyDown={cancelGlide}
    >
      {children}
    </div>
  )
}
