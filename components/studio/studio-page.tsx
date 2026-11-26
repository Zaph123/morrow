"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getIdea,
  getContentItem,
  createContent,
  updateContent,
} from "@/lib/storage";
import type { Idea, ContentItem, ContentPlatform } from "@/types";

const PLATFORMS: { value: ContentPlatform; label: string }[] = [
  { value: null, label: "No platform" },
  { value: "x", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp-status", label: "WhatsApp Status" },
];

export function StudioPage() {
  const searchParams = useSearchParams();
  const contentId = searchParams?.get("contentId") ?? null;
  const sourceIdeaId = searchParams?.get("sourceIdeaId") ?? null;
  return <StudioEditor key={`${contentId ?? "new"}:${sourceIdeaId ?? "blank"}`} contentId={contentId} sourceIdeaId={sourceIdeaId} />;
}

function StudioEditor({ contentId, sourceIdeaId }: { contentId: string | null; sourceIdeaId: string | null }) {
  const router = useRouter();

  const [sourceIdea, setSourceIdea] = useState<Idea | null>(null);
  const [existingContent, setExistingContent] = useState<ContentItem | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<ContentPlatform>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const dirty = !existingContent || title !== existingContent.title || body !== existingContent.body || platform !== existingContent.platform;
  const saveStatus = isSaving ? "saving" : dirty ? "unsaved" : "saved";

  const loadContext = useCallback(() => {
    try {
      if (contentId) {
        const content = getContentItem(contentId);
        if (!content) throw new Error("This draft could not be found. Return to the library to choose another draft.");
        const source = content.sourceIdeaId ? getIdea(content.sourceIdeaId) : null;
        setExistingContent(content);
        setTitle(content.title);
        setBody(content.body);
        setPlatform(content.platform);
        setSourceIdea(source);
      } else if (sourceIdeaId) {
        const idea = getIdea(sourceIdeaId);
        if (!idea) throw new Error("The source idea could not be found. Return to Ideas to choose another idea.");
        setSourceIdea(idea);
        setBody(idea.text);
      }
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load your writing.");
    } finally {
      setMounted(true);
    }
  }, [contentId, sourceIdeaId]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) loadContext(); });
    return () => { active = false; };
  }, [loadContext]);

  async function handleSave() {
    const trimmedTitle = title.trim() || "Untitled";
    if (!body.trim() || isSaving || loadError) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      if (existingContent) {
        // Update existing content
        const updated = updateContent(existingContent.id, {
          title: trimmedTitle,
          body,
          platform,
        });
        if (!updated) throw new Error("This draft is no longer available. Keep or copy your writing before leaving.");
        setExistingContent(updated);
        setTitle(updated.title);
      } else {
        // Create new content
        const created = createContent({
          title: trimmedTitle,
          body,
          platform,
          sourceIdeaId: sourceIdeaId || undefined,
        });
        setExistingContent(created);
        setTitle(created.title);
        router.replace(`/studio?contentId=${created.id}`);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your draft. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loadError) {
    return <div className="mx-auto w-full max-w-3xl">
      <h1 className="font-heading text-2xl font-medium">Couldn’t load your writing</h1>
      <p className="mt-3 text-sm text-destructive" role="alert">{loadError}</p>
      <Button variant="secondary" className="mt-4" onClick={loadContext}>Try again</Button>
    </div>;
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex size-11 items-center justify-center rounded-md border border-border outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-[2rem] font-normal leading-10 tracking-[-0.02em]">
          Studio
        </h1>
      </div>
    );
  }

  const backHref = existingContent
    ? `/content`
    : sourceIdea
    ? `/ideas/${sourceIdea.id}`
    : "/";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="flex size-11 items-center justify-center rounded-md border border-border outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
          <div>
            <h1 className="font-display text-[2rem] font-normal leading-10 tracking-[-0.02em]">
              {existingContent ? "Edit draft" : "Create content"}
            </h1>
            {sourceIdea && !existingContent && (
              <p className="text-xs text-muted-foreground">From an idea</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
            {isSaving ? "Saving..." : saveError ? "Could not save changes" : saveStatus === "unsaved" ? "Unsaved changes" : "Saved on this device"}
          </span>
          <Button
            onClick={handleSave}
            disabled={isSaving || !body.trim()}
            size="sm"
            className="transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : saveError ? "Retry save" : existingContent ? "Save changes" : "Save draft"}
          </Button>
        </div>
      </div>

      {saveError && <p className="mt-3 text-sm text-destructive" role="alert">{saveError} Keep or copy your writing before leaving.</p>}

      <div className="mt-6 space-y-4">
        {existingContent?.sourceIdeaId && !sourceIdea && <p className="text-sm text-muted-foreground">The original idea is unavailable. Your draft and its source reference are preserved.</p>}
        {sourceIdea && (
          <section className="rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Source idea
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed">
                  {sourceIdea.text}
                </p>
                <Link
                  href={`/ideas/${sourceIdea.id}`}
                  className="mt-2 inline-block text-xs text-muted-foreground underline-offset-2 hover:underline"
                >
                  View original idea
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-card px-5 py-6">
          <div className="space-y-4">
            <div>
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Title
                </span>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSaveError(null);
                  }}
                  placeholder="Untitled"
                  className="mt-2"
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Platform
                </span>
                <Select
                  value={platform || ""}
                  onChange={(e) => {
                    setPlatform((e.target.value || null) as ContentPlatform);
                    setSaveError(null);
                  }}
                  className="mt-2"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value || "null"} value={p.value || ""}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Content
                </span>
                <Textarea
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setSaveError(null);
                  }}
                  rows={12}
                  placeholder="Write your content here..."
                  className="mt-2 resize-none text-lg leading-[1.65]"
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                {body.trim().length} characters
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving || !body.trim()}
            className="transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : saveError ? "Retry save" : existingContent ? "Save changes" : "Save draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
