"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import Link from "next/link";
import { PencilLine, Lightbulb, FilePlus2 } from "lucide-react";
import {
  animate,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HorizontalCardRail } from "@/components/home/horizontal-card-rail";
import { motionTokens } from "@/components/arc/lib/motion-tokens";
import { createIdea, readIdeas, readContentItems } from "@/lib/storage";
import { formatDate } from "@/lib/format";
import { sortByUpdatedDesc } from "@/lib/sort";
import type { Idea, ContentItem } from "@/types";

const COMPOSER_MIN_HEIGHT = 56;
const COMPOSER_MAX_HEIGHT = 160;

const heightTransition = {
  duration: motionTokens.duration.fast,
  ease: motionTokens.ease.inOut,
} as const;

function clampComposerHeight(value: number) {
  return Math.min(COMPOSER_MAX_HEIGHT, Math.max(COMPOSER_MIN_HEIGHT, value));
}

export function HomePageClient() {
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [captureText, setCaptureText] = useState("");
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [savedIdeaId, setSavedIdeaId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const heightControls = useRef<AnimationPlaybackControls | null>(null);
  const composerHeight = useRef(COMPOSER_MIN_HEIGHT);
  const reduceMotion = useReducedMotion() ?? false;

  function loadData() {
    const ideas = readIdeas();
    const content = readContentItems();
    setLoadError(!ideas.ok ? ideas.error : !content.ok ? content.error : null);
    setRecentIdeas(ideas.ok ? sortByUpdatedDesc(ideas.data).slice(0, 1) : []);
    setRecentContent(
      content.ok ? sortByUpdatedDesc(content.data).slice(0, 1) : [],
    );
  }

  function saveThought() {
    setCaptureError(null);
    setSavedIdeaId(null);
    try {
      const idea = createIdea({ text: captureText.trim() });
      setCaptureText("");
      setSavedIdeaId(idea.id);
      loadData();
    } catch (error) {
      setCaptureError(
        error instanceof Error
          ? error.message
          : "Could not save. Keep or copy your thought and try again.",
      );
    }
  }

  function syncComposerHeight(immediate = false) {
    const el = textareaRef.current;
    if (!el) return;

    const from = composerHeight.current;
    el.style.height = `${COMPOSER_MIN_HEIGHT}px`;
    el.style.overflowY = "hidden";
    const next = clampComposerHeight(el.scrollHeight);
    el.style.height = `${from}px`;

    heightControls.current?.stop();

    const settle = (height: number) => {
      composerHeight.current = height;
      el.style.height = `${height}px`;
      el.style.overflowY = height >= COMPOSER_MAX_HEIGHT ? "auto" : "hidden";
    };

    if (next === from) {
      settle(next);
      return;
    }

    if (immediate || reduceMotion) {
      settle(next);
      return;
    }

    heightControls.current = animate(from, next, {
      ...heightTransition,
      onUpdate: (value) => {
        el.style.height = `${value}px`;
      },
      onComplete: () => settle(next),
    });
  }

  useEffect(() => {
    let active = true;
    // Hydrate browser data after the server's initial render and refresh changes
    // made in another tab without ever reading storage during server rendering.
    queueMicrotask(() => {
      if (!active) return;
      loadData();
      setMounted(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === "morrow:ideas" ||
        event.key === "morrow:content"
      )
        loadData();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useLayoutEffect(() => {
    syncComposerHeight(
      composerHeight.current === COMPOSER_MIN_HEIGHT && !captureText,
    );
    return () => {
      heightControls.current?.stop();
    };
  }, [captureText, reduceMotion]);

  useEffect(() => {
    const el = textareaRef.current;
    const parent = el?.parentElement;
    if (!el || !parent || typeof ResizeObserver === "undefined") return;

    let lastWidth = parent.clientWidth;
    const observer = new ResizeObserver(() => {
      const width = parent.clientWidth;
      if (width === lastWidth) return;
      lastWidth = width;
      syncComposerHeight(true);
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  const continueItem = recentContent[0];
  const ideaItem = recentIdeas[0];
  const showBlankFirst = mounted && !loadError && !continueItem;

  const continueCard = continueItem ? (
    <article className="home-action-card home-action-card--actionable home-action-card--continue" key="continue">
      <div className="home-action-card-header">
        <h2 id="home-continue-heading" className="home-action-card-title">
          <PencilLine className="size-5 shrink-0" aria-hidden="true" />
          Continue
        </h2>
        <Link href="/content" draggable={false} className="home-action-secondary-link" aria-label="View all writing">
          View all
        </Link>
      </div>
      <Link
        href={`/studio?contentId=${continueItem.id}`}
        draggable={false}
        className="home-action-primary"
        aria-label={`Continue writing: ${continueItem.title || "Untitled"}`}
      >
        <div className="home-action-card-body">
          <p className="truncate text-sm font-medium">{continueItem.title || "Untitled"}</p>
          <p className="home-action-preview mt-1 text-sm leading-relaxed text-muted-foreground">
            {continueItem.body}
          </p>
        </div>
        <p className="home-action-card-meta">
          {continueItem.platform && continueItem.platform.replace("-", " ") + " · "}
          {formatDate(continueItem.updatedAt)}
        </p>
      </Link>
    </article>
  ) : (
    <article className="home-action-card home-action-card--empty" key="continue">
      <div className="home-action-card-header">
        <h2 id="home-continue-heading" className="home-action-card-title">
          <PencilLine className="size-5 shrink-0" aria-hidden="true" />
          Continue
        </h2>
      </div>
      {!mounted ? (
        <div className="home-action-card-body home-loading-preview" aria-hidden="true">
          <div className="collection-skeleton skeleton-preview" />
          <div className="collection-skeleton skeleton-meta" />
        </div>
      ) : (
        <p className="home-action-card-body text-sm leading-relaxed text-muted-foreground">
          {loadError ? "Recent drafts are unavailable." : "No drafts yet. Start whenever you’re ready."}
        </p>
      )}
    </article>
  );

  const ideaCard = ideaItem ? (
    <article className="home-action-card home-action-card--actionable home-action-card--idea" key="idea">
      <div className="home-action-card-header">
        <h2 id="home-revisit-heading" className="home-action-card-title">
          <Lightbulb className="size-5 shrink-0" aria-hidden="true" />
          Revisit an idea
        </h2>
        <Link href="/ideas" draggable={false} className="home-action-secondary-link" aria-label="View all ideas">
          View all
        </Link>
      </div>
      <Link
        href={`/ideas/${ideaItem.id}`}
        draggable={false}
        className="home-action-primary"
        aria-label={`Revisit idea: ${ideaItem.text.split(/\r?\n/, 1)[0]}`}
      >
        <p className="home-action-card-body home-action-preview text-sm leading-relaxed">
          {ideaItem.text}
        </p>
        <p className="home-action-card-meta">{formatDate(ideaItem.createdAt)}</p>
      </Link>
    </article>
  ) : (
    <article className="home-action-card home-action-card--empty home-action-card--idea" key="idea">
      <div className="home-action-card-header">
        <h2 id="home-revisit-heading" className="home-action-card-title">
          <Lightbulb className="size-5 shrink-0" aria-hidden="true" />
          Revisit an idea
        </h2>
      </div>
      {!mounted ? (
        <div className="home-action-card-body home-loading-preview" aria-hidden="true">
          <div className="collection-skeleton skeleton-preview" />
          <div className="collection-skeleton skeleton-meta" />
        </div>
      ) : (
        <p className="home-action-card-body text-sm leading-relaxed text-muted-foreground">
          {loadError ? "Recent ideas are unavailable." : "Save a thought to return to later."}
        </p>
      )}
    </article>
  );

  const blankDraftCard = (
    <article className="home-action-card home-action-card--actionable home-action-card--blank" key="blank-draft">
      <div className="home-action-card-header">
        <h2 className="home-action-card-title">
          <FilePlus2 className="size-5 shrink-0" aria-hidden="true" />
          Blank draft
        </h2>
      </div>
      <Link href="/studio/new" draggable={false} className="home-action-primary" aria-label="Start a blank draft">
        <p className="home-action-card-body text-sm leading-relaxed text-muted-foreground">
          Start writing with no idea attached
        </p>
      </Link>
    </article>
  );

  return (
    <div className="home-workspace mx-auto w-full max-w-180 md:flex md:min-h-[calc(100dvh-88px)] md:flex-col md:justify-center md:py-10">
      <header className="mb-8 md:mb-10">
        <p className="mb-3 min-h-5 text-sm text-muted-foreground">
          {mounted
            ? new Intl.DateTimeFormat("en", {
                weekday: "long",
                day: "numeric",
                month: "short",
              }).format(new Date())
            : ""}
        </p>
        <h1 className="text-[28px] font-semibold leading-9 tracking-tight sm:text-4xl sm:leading-tight">
          Make something <br className="sm:hidden" />
          of <em className="font-semibold">today.</em>
        </h1>
      </header>
      <section
        className="home-capture rounded-[20px] border border-border bg-card p-4 md:p-5"
        aria-label="Capture a thought"
      >
        <label className="block">
          <span className="sr-only">Capture an idea</span>
          <Textarea
            ref={textareaRef}
            value={captureText}
            onChange={(event) => {
              setCaptureText(event.target.value);
              setSavedIdeaId(null);
              setCaptureError(null);
            }}
            onKeyDown={(event) => {
              if (
                (event.ctrlKey || event.metaKey) &&
                event.key === "Enter" &&
                captureText.trim()
              ) {
                event.preventDefault();
                saveThought();
              }
            }}
            placeholder="What's on your mind?"
            rows={2}
            className="home-capture-textarea min-h-14 max-h-40 resize-none rounded-lg border-transparent p-1 text-base leading-7 md:text-lg"
            aria-describedby={
              captureError ? "home-capture-error" : "home-capture-shortcut"
            }
            aria-invalid={!!captureError}
          />
        </label>
        <div className="home-capture-footer mt-3 flex flex-wrap items-center justify-between gap-3">
          <p
            id="home-capture-shortcut"
            className="text-xs text-muted-foreground"
          >
            Ctrl or ⌘ + Enter to save
          </p>
          <Button
            className="min-h-11"
            onClick={saveThought}
            disabled={!captureText.trim()}
          >
            Save idea
          </Button>
        </div>
        <div className="text-sm" role="status" aria-live="polite">
          {savedIdeaId && (
            <p className="mt-3">
              Saved on this device.{" "}
              <Link
                href={`/ideas/${savedIdeaId}`}
                className="inline-flex min-h-11 items-center underline underline-offset-4"
              >
                View idea
              </Link>
            </p>
          )}
        </div>
        {captureError && (
          <p
            id="home-capture-error"
            className="mt-3 text-sm text-destructive"
            role="alert"
          >
            {captureError} Keep or copy your thought before leaving, then retry
            Save idea.
          </p>
        )}
      </section>
      <div className="mt-6">
        {!mounted && <span className="sr-only" role="status">Loading recent work</span>}
        {loadError && (
          <section className="mb-5" aria-labelledby="home-load-error-heading">
            <h2 id="home-load-error-heading" className="font-medium">
              Couldn’t load recent work
            </h2>
            <p className="mt-2 text-sm text-destructive" role="alert">
              {loadError}
            </p>
            <Button variant="secondary" className="mt-3" onClick={loadData}>
              Try again
            </Button>
          </section>
        )}
        <div aria-busy={!mounted}>
        <HorizontalCardRail label="Home actions">
          {showBlankFirst
            ? [blankDraftCard, continueCard, ideaCard]
            : [continueCard, ideaCard, blankDraftCard]}
        </HorizontalCardRail>
        </div>
      </div>
    </div>
  );
}
