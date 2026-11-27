"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, PenLine } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { getContentItems } from "@/lib/storage"
import { formatRelativeTime } from "@/lib/format"
import { sortByUpdatedDesc } from "@/lib/sort"
import type { ContentItem } from "@/types"
import { cn } from "@/lib/utils"

type LoadState = "loading" | "ready" | "error"

export function StudioStartPage() {
  const [state, setState] = useState<LoadState>("loading")
  const [drafts, setDrafts] = useState<ContentItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadDrafts = useCallback(() => {
    setState("loading")
    try {
      setDrafts(sortByUpdatedDesc(getContentItems().filter((item) => item.status === "draft")))
      setError(null)
      setState("ready")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your Studio drafts.")
      setState("error")
    }
  }, [])

  useEffect(() => {
    let active = true
    queueMicrotask(() => { if (active) loadDrafts() })
    return () => { active = false }
  }, [loadDrafts])

  const latest = drafts[0]

  return (
    <section className="studio-start" aria-labelledby="studio-start-title">
      <h1 id="studio-start-title" className="studio-start-page-title">Studio</h1>

      <div className="studio-start-layout">
        <div className="studio-start-intro">
          <h2>Make room for your next draft.</h2>
          <p>Start with a blank page, an idea you saved, or a question.</p>

          <Link href="/studio/new" className={cn(buttonVariants(), "studio-start-primary")}>
            <PenLine aria-hidden="true" />
            Start writing
          </Link>

          <div className="studio-start-options" aria-label="Other ways to begin">
            <Link href="/ideas" className="studio-start-option">
              <span className="studio-start-option-icon studio-start-option-icon--idea">
                <svg className="studio-start-option-illustration" viewBox="0 0 28 32" fill="none" aria-hidden="true" focusable="false">
                  <path d="M4 2.625h20A1.375 1.375 0 0 1 25.375 4v18l-6 6H4A2.375 2.375 0 0 1 1.625 25.625V5A2.375 2.375 0 0 1 4 2.625Z" fill="white" stroke="#C8CBD0" strokeWidth="1.25" strokeLinejoin="round" />
                  <path d="M19.375 22h6l-6 6v-6Z" fill="#E5E7EB" stroke="#C8CBD0" strokeWidth="1.25" strokeLinejoin="round" />
                  <path d="M6.5 10.5h10M6.5 15.5h7" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="studio-start-option-copy">
                <span className="studio-start-option-title">From an idea</span>
                <span className="studio-start-option-detail">Choose a saved thought to develop.</span>
              </span>
              <ArrowRight className="studio-start-option-arrow" aria-hidden="true" />
            </Link>

            <div className="studio-start-option studio-start-option--unavailable" aria-describedby="studio-ai-note">
              <span className="studio-start-option-icon studio-start-option-icon--discuss">
                <svg className="studio-start-option-illustration" viewBox="0 0 32 28" fill="none" aria-hidden="true" focusable="false">
                  <rect x="2.625" y="2.625" width="19" height="14" rx="3.5" fill="white" stroke="#C8CBD0" strokeWidth="1.25" />
                  <path d="M6 7.5h6" stroke="#121316" strokeWidth="1.75" strokeLinecap="round" />
                  <rect x="11.625" y="11.625" width="19" height="14" rx="3.5" fill="white" stroke="#C8CBD0" strokeWidth="1.25" />
                  <path d="M15.625 17.5h8" stroke="#121316" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
              <span className="studio-start-option-copy">
                <span className="studio-start-option-title">Discuss a thought</span>
                <span className="studio-start-option-detail" id="studio-ai-note">AI discussion isn’t available yet.</span>
              </span>
            </div>
          </div>
        </div>

        <section className="studio-resume" aria-labelledby="studio-resume-title" aria-busy={state === "loading"}>
          <h2 id="studio-resume-title" className="studio-resume-label">Resume</h2>
          {state === "loading" ? (
            <StudioResumeSkeleton />
          ) : state === "error" ? (
            <div className="studio-resume-card studio-resume-state" role="alert">
              <h3>Couldn’t load Studio drafts</h3>
              <p>{error}</p>
              <Button type="button" variant="secondary" onClick={loadDrafts}>Try again</Button>
            </div>
          ) : latest ? (
            <Link href={`/studio?contentId=${encodeURIComponent(latest.id)}`} className="studio-resume-card">
              <span className="studio-resume-card-heading">
                <span className="studio-resume-title">{latest.title.trim() || "Untitled draft"}</span>
                <ArrowRight aria-hidden="true" />
              </span>
              <span className="studio-resume-preview">{latest.body}</span>
              <span className="studio-resume-meta">
                {latest.platform ? `${platformName(latest.platform)} · ` : ""}Draft · edited {formatRelativeTime(latest.updatedAt)}
              </span>
            </Link>
          ) : (
            <div className="studio-resume-card studio-resume-empty">
              <h3>No drafts to resume</h3>
              <p>Your saved Studio writing will appear here.</p>
              <Link href="/studio/new" className={cn(buttonVariants({ variant: "secondary" }), "studio-resume-empty-link")}>
                Start a draft
              </Link>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export function StudioStartSkeleton() {
  return (
    <section className="studio-start" aria-busy="true" aria-label="Loading Studio">
      <span className="sr-only" role="status">Loading Studio</span>
      <div className="studio-start-skeleton-page-title" aria-hidden="true" />
      <div className="studio-start-layout">
        <div className="studio-start-intro" aria-hidden="true">
          <div className="studio-start-skeleton-heading" />
          <div className="studio-start-skeleton-copy" />
          <div className="studio-start-skeleton-button" />
          <div className="studio-start-skeleton-option" />
          <div className="studio-start-skeleton-option" />
        </div>
        <section className="studio-resume" aria-hidden="true">
          <div className="studio-start-skeleton-label" />
          <StudioResumeSkeleton />
        </section>
      </div>
    </section>
  )
}

function StudioResumeSkeleton() {
  return (
    <div className="studio-resume-card studio-resume-skeleton" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

function platformName(platform: ContentItem["platform"]) {
  if (platform === "x") return "X"
  if (platform === "linkedin") return "LinkedIn"
  if (platform === "whatsapp-status") return "WhatsApp Status"
  return ""
}
