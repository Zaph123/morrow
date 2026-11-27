"use client"

import { useId, type ReactNode } from "react"
import Link from "next/link"

import { Breadcrumb } from "@/components/arc/breadcrumb/breadcrumb"
import { CopyButton } from "@/components/arc/copy-button/copy-button"
import { SaveStatus, type SaveStatusKind } from "@/components/workspace/save-status"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export type WritingPlatformOption = { value: string; label: string }

type WritingSurfaceProps = {
  parentLabel: string
  backHref: string
  backLabel: string
  description?: string
  titlePlaceholder?: string
  title: string
  body: string
  platform: string | null
  platformOptions: WritingPlatformOption[]
  onTitleChange: (value: string) => void
  onBodyChange: (value: string) => void
  onPlatformChange: (value: string) => void
  sourcePanel?: ReactNode
  sourceUnavailable?: ReactNode
  notice?: ReactNode
  saveLabel: string
  saveDisabled: boolean
  onSave: () => void
  saveStatus: SaveStatusKind
  saveError: string | null
}

export function WritingSurface({
  parentLabel,
  backHref,
  backLabel,
  description,
  titlePlaceholder,
  title,
  body,
  platform,
  platformOptions,
  onTitleChange,
  onBodyChange,
  onPlatformChange,
  sourcePanel,
  sourceUnavailable,
  notice,
  saveLabel,
  saveDisabled,
  onSave,
  saveStatus,
  saveError,
}: WritingSurfaceProps) {
  const titleId = useId()
  const platformId = useId()
  const bodyId = useId()
  const descriptionId = useId()

  return (
    <section className="studio-writing-surface" aria-label="Draft editor">
      <header className="studio-editor-toolbar">
        {description && <span className="sr-only" id={descriptionId}>{description}</span>}
        <div className="studio-editor-identity">
          <Link className="studio-editor-back" href={backHref} aria-label={backLabel}>
            <span aria-hidden="true">←</span>
          </Link>
          <div className="studio-editor-heading">
            <div className="studio-editor-breadcrumb">
              <Breadcrumb
                items={[{ label: parentLabel, href: backHref }]}
                ariaLabel="Draft location"
              />
              <span aria-hidden="true" className="studio-editor-separator">/</span>
            </div>
            <label className="sr-only" htmlFor={titleId}>Draft title</label>
            <Input
              id={titleId}
              className="studio-editor-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder={titlePlaceholder || "Untitled draft"}
              aria-describedby={description ? descriptionId : undefined}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="studio-editor-actions">
          <SaveStatus status={saveStatus} error={saveError} className="studio-editor-save-status" />
          <CopyButton
            value={body}
            disabled={!body.trim()}
            className="studio-editor-copy"
          />
          <Button type="button" onClick={onSave} disabled={saveDisabled}>
            {saveLabel}
          </Button>
        </div>
      </header>

      <div className="studio-platform-row">
        <label className="studio-platform-control" htmlFor={platformId}>
          <span className="sr-only">Platform</span>
          <Select
            id={platformId}
            value={platform ?? ""}
            onChange={(event) => onPlatformChange(event.target.value)}
          >
            {platformOptions.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <section className="studio-writing-card" aria-label="Draft content">
        {notice}
        {sourceUnavailable}
        {sourcePanel}
        <label className="sr-only" htmlFor={bodyId}>Draft content</label>
        <Textarea
          id={bodyId}
          className="studio-writing-body"
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="Start writing..."
          spellCheck
        />
        <footer className="studio-writing-footer">
          <span>Draft</span>
          <span aria-label={`${body.length} characters`}>{body.length} characters</span>
        </footer>
      </section>
    </section>
  )
}

export function StudioEditorSkeleton({ label = "Loading draft editor" }: { label?: string }) {
  return (
    <section className="studio-writing-surface" aria-busy="true" aria-label={label}>
      <span className="sr-only" role="status">{label}</span>
      <div className="studio-editor-toolbar" aria-hidden="true">
        <div className="studio-editor-skeleton studio-editor-skeleton-title" />
        <div className="studio-editor-skeleton studio-editor-skeleton-actions" />
      </div>
      <div className="studio-platform-row" aria-hidden="true">
        <div className="studio-editor-skeleton studio-editor-skeleton-platform" />
      </div>
      <div className="studio-editor-skeleton studio-editor-skeleton-paper" aria-hidden="true">
        <div className="studio-editor-skeleton studio-editor-skeleton-line" />
        <div className="studio-editor-skeleton studio-editor-skeleton-line short" />
      </div>
    </section>
  )
}

type WritingStateProps = {
  parentLabel: string
  backHref: string
  backLabel: string
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
}

export function WritingSurfaceState({
  parentLabel,
  backHref,
  backLabel,
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
}: WritingStateProps) {
  return (
    <section className="studio-writing-surface">
      <header className="studio-editor-toolbar">
        <div className="studio-editor-identity">
          <Link className="studio-editor-back" href={backHref} aria-label={backLabel}>
            <span aria-hidden="true">←</span>
          </Link>
          <div className="studio-editor-heading">
            <div className="studio-editor-breadcrumb">
              <Breadcrumb items={[{ label: parentLabel, href: backHref }]} ariaLabel="Draft location" />
              <span aria-hidden="true" className="studio-editor-separator">/</span>
            </div>
            <h1 className="studio-editor-state-heading">{title}</h1>
          </div>
        </div>
      </header>
      <div className="studio-editor-state">
        <p role="alert">{message}</p>
        {actionLabel && actionHref && (
          <Link className={buttonVariants({ className: "mt-5" })} href={actionHref}>{actionLabel}</Link>
        )}
        {actionLabel && onAction && (
          <Button type="button" variant="secondary" className="mt-5" onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
    </section>
  )
}
