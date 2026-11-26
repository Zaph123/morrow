"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Trash2 } from "lucide-react";

import { Alert } from "@/components/arc/alert/alert";
import { Breadcrumb } from "@/components/arc/breadcrumb/breadcrumb";
import { CopyButton } from "@/components/arc/copy-button/copy-button";
import { Dialog, DialogContent } from "@/components/arc/dialog/dialog";
import { useToastStack } from "@/components/arc/toast-stack/toast-stack";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceList, WorkspaceListRow } from "@/components/layout/workspace-list";
import { getIdea, updateIdea, deleteIdea, getContentBySourceIdea } from "@/lib/storage";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Idea, ContentItem } from "@/types";

export function IdeaDetail({ ideaId }: { ideaId: string }) {
  const router = useRouter();
  const { toast } = useToastStack();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [editText, setEditText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const dirty = idea !== null && editText !== idea.text;

  const loadIdea = useCallback(() => {
    try {
      const loaded = getIdea(ideaId);
      const related = getContentBySourceIdea(ideaId);
      setIdea(loaded);
      setEditText(loaded?.text ?? "");
      setRelatedContent(related);
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load this idea.");
    } finally {
      setMounted(true);
    }
  }, [ideaId]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) loadIdea(); });
    return () => { active = false; };
  }, [loadIdea]);

  async function handleSave() {
    const text = editText;
    if (!text.trim() || !idea || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const updated = updateIdea(ideaId, { text });
      if (!updated) throw new Error("This idea is no longer available. Keep or copy your edits before leaving.");
      setIdea(updated);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your idea. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleTextChange(value: string) {
    setEditText(value);
    setSaveError(null);
  }

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const success = deleteIdea(ideaId);
      if (!success) throw new Error("This idea is no longer available.");
      setIsDeleteOpen(false);
      setDeleteError(null);
      toast({ type: "success", title: "Idea deleted." });
      router.push("/ideas");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not delete this idea. Try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="idea-detail-page flex items-center gap-3" role="status">
        <Link
          href="/ideas"
          aria-label="Back to ideas"
          className="flex size-11 items-center justify-center rounded-md border border-border outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-semibold leading-8">
          Loading...
        </h1>
      </div>
    );
  }

  if (loadError) {
    return <div className="idea-detail-page collection-state">
      <Link href="/ideas" className={buttonVariants({ variant: "ghost" })}>Back to ideas</Link>
      <h1 className="font-heading text-2xl font-medium">Couldn’t load this idea</h1>
      <p className="mt-3 text-sm text-destructive" role="alert">{loadError}</p>
      <Button variant="secondary" className="mt-4" onClick={loadIdea}>Try again</Button>
    </div>;
  }

  if (!idea) {
    return (
      <div className="idea-detail-page collection-state">
        <div className="flex items-center gap-3">
          <Link
            href="/ideas"
            aria-label="Back to ideas"
            className="flex size-11 items-center justify-center rounded-md border border-border outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-semibold leading-8">
            Idea not found
          </h1>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          This idea may have been deleted or does not exist.
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="idea-detail-page">
      <h1 className="sr-only">{editText.split(/\r?\n/, 1)[0] || "Idea"}</h1>
      <header className="idea-detail-toolbar">
        <Breadcrumb
          items={[
            { label: "Ideas", href: "/ideas" },
            { label: editText.split(/\r?\n/, 1)[0] || "Idea" },
          ]}
        />

        <div className="idea-detail-toolbar-actions">
          <span className="text-xs text-muted-foreground" role={saveError ? "alert" : "status"} aria-live="polite">
            {isSaving ? "Saving..." : saveError ? "Could not save changes" : dirty ? "Unsaved changes" : "Saved on this device"}
          </span>
          <CopyButton value={editText} label="Copy" className="idea-detail-copy-button" />
          {(dirty || saveError) && (
            <Button onClick={handleSave} disabled={isSaving || !editText.trim()} size="sm" className="min-h-11">
              {saveError ? "Retry save" : "Save changes"}
            </Button>
          )}
        </div>
      </header>

      {saveError && <p className="mt-3 text-sm text-destructive" role="alert">{saveError} Keep or copy your work before leaving.</p>}

      <div className="mt-6 flex flex-col gap-5">
        <section className="idea-original" aria-labelledby="original-idea-heading">
          <h2 id="original-idea-heading" className="sr-only">Original idea</h2>

          <label className="block">
            <span className="sr-only">Edit idea text</span>
            <Textarea
              value={editText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={7}
              className="idea-text-field resize-y"
              disabled={isSaving}
            />
          </label>

          <div className="idea-captured flex items-center justify-between gap-3">
            <p>Captured {formatDateTime(idea.createdAt)}</p>
            <div className="idea-detail-footer-actions">
              {(dirty || saveError) && (
                <Button onClick={handleSave} disabled={isSaving || !editText.trim()} size="sm" className="min-h-11">
                  {saveError ? "Retry save" : "Save changes"}
                </Button>
              )}
              <Button variant="destructive" size="sm" className="min-h-11" onClick={() => { setDeleteError(null); setIsDeleteOpen(true) }}>
                <Trash2 data-icon="inline-start" />
                Delete idea
              </Button>
            </div>
          </div>
        </section>

          <div>
            <Link
              href={`/studio?sourceIdeaId=${ideaId}`}
              className={cn(buttonVariants(), "idea-develop-action min-h-11")}
            >
              {relatedContent.length ? "New draft from this idea" : "Develop in Studio"}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>

        {relatedContent.length > 0 && (
          <section className="mt-3" aria-labelledby="related-drafts-heading">
            <h2 id="related-drafts-heading" className="mb-4 text-sm font-medium text-muted-foreground">
              Drafts from this idea
            </h2>
            <WorkspaceList className="collection-list">
              {relatedContent.map((item) => (
                <WorkspaceListRow
                  key={item.id}
                  href={`/studio?contentId=${item.id}`}
                  className="collection-row"
                >
                  <div className="min-w-0">
                  <h3 className="collection-row-title">{item.title || "Untitled draft"}</h3>
                  <p className="collection-preview">{item.body}</p>
                  {item.platform && (
                    <div className="mt-1 text-xs text-muted-foreground capitalize">
                      {item.platform.replace("-", " ")}
                    </div>
                  )}
                  </div>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                </WorkspaceListRow>
              ))}
            </WorkspaceList>
          </section>
        )}
      </div>
    </div>
    <Dialog
      open={isDeleteOpen}
      onOpenChange={(nextOpen) => {
        if (isDeleting) return
        setIsDeleteOpen(nextOpen)
        if (!nextOpen) setDeleteError(null)
      }}
    >
      <DialogContent
        title="Delete idea?"
        description="Drafts created from this idea will remain available. Only the original idea will be deleted."
        onEscapeKeyDown={(event) => {
          if (isDeleting) event.preventDefault()
        }}
        onPointerDownOutside={(event) => {
          if (isDeleting) event.preventDefault()
        }}
      >
        {deleteError ? (
          <Alert id="idea-delete-error" tone="danger" title="Couldn’t delete this idea" className="mb-4">
            {deleteError} The idea and its drafts are still available.
          </Alert>
        ) : null}
        <div className="morrow-dialog-actions">
          <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : deleteError ? "Retry delete" : "Delete idea"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
