"use client";

import { useState } from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { Button as ArcButton } from "@/components/arc/button/button";
import { Save, Check, Download, Trash2 } from "lucide-react";

export default function ButtonComparisonPage() {
  const [baseSaving, setBaseSaving] = useState(false);
  const [baseSaved, setBaseSaved] = useState(false);
  const [arcSaving, setArcSaving] = useState(false);
  const [arcSaved, setArcSaved] = useState(false);

  const handleBaseSave = async () => {
    setBaseSaving(true);
    setBaseSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setBaseSaving(false);
    setBaseSaved(true);
    setTimeout(() => setBaseSaved(false), 2000);
  };

  const handleArcSave = async () => {
    setArcSaving(true);
    setArcSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setArcSaving(false);
    setArcSaved(true);
    setTimeout(() => setArcSaved(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col gap-12 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Button Comparison</h1>
        <p className="mt-2 text-muted-foreground">
          Comparing Base UI button (current) with Arc button (Motion-powered)
        </p>
      </div>

      {/* Variants Comparison */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Variants</h2>
          <p className="text-sm text-muted-foreground">
            Visual styles for different button purposes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Base UI Buttons */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Base UI (Current)
            </h3>
            <div className="flex flex-wrap gap-3">
              <BaseButton variant="default">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="destructive">Destructive</BaseButton>
              <BaseButton variant="outline">Outline</BaseButton>
            </div>
          </div>

          {/* Arc Buttons */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Arc (Motion-powered)
            </h3>
            <div className="flex flex-wrap gap-3">
              <ArcButton variant="primary">Primary</ArcButton>
              <ArcButton variant="secondary">Secondary</ArcButton>
              <ArcButton variant="ghost">Ghost</ArcButton>
              <ArcButton variant="danger">Danger</ArcButton>
            </div>
          </div>
        </div>
      </section>

      {/* Sizes Comparison */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Sizes</h2>
          <p className="text-sm text-muted-foreground">
            Button size variations for different contexts
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Base UI Sizes */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Base UI (Current)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <BaseButton size="xs">Extra Small</BaseButton>
              <BaseButton size="sm">Small</BaseButton>
              <BaseButton size="default">Medium</BaseButton>
              <BaseButton size="lg">Large</BaseButton>
            </div>
          </div>

          {/* Arc Sizes */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Arc (Motion-powered)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <ArcButton size="sm">Small</ArcButton>
              <ArcButton size="md">Medium</ArcButton>
              <ArcButton size="lg">Large</ArcButton>
            </div>
          </div>
        </div>
      </section>

      {/* Loading States Comparison */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Loading & Morphing States</h2>
          <p className="text-sm text-muted-foreground">
            Arc buttons morph their width when label changes (Save → Saved)
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Base UI Loading */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Base UI (Current)
            </h3>
            <div className="flex flex-wrap gap-3">
              <BaseButton onClick={handleBaseSave} disabled={baseSaving}>
                {baseSaving ? "Saving..." : baseSaved ? "Saved" : "Save draft"}
              </BaseButton>
              <BaseButton variant="secondary" disabled>
                Disabled
              </BaseButton>
            </div>
          </div>

          {/* Arc Loading */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Arc (Motion-powered)
            </h3>
            <div className="flex flex-wrap gap-3">
              <ArcButton
                variant="secondary"
                loading={arcSaving}
                onClick={handleArcSave}
              >
                {arcSaved ? "Saved" : "Save draft"}
              </ArcButton>
              <ArcButton variant="secondary" disabled>
                Disabled
              </ArcButton>
            </div>
            <p className="text-xs text-muted-foreground">
              Click to see width morph animation
            </p>
          </div>
        </div>
      </section>

      {/* Icons Comparison */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">With Icons</h2>
          <p className="text-sm text-muted-foreground">
            Buttons with inline icons
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Base UI Icons */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Base UI (Current)
            </h3>
            <div className="flex flex-wrap gap-3">
              <BaseButton>
                <Save className="h-4 w-4" />
                Save changes
              </BaseButton>
              <BaseButton variant="secondary">
                <Download className="h-4 w-4" />
                Download
              </BaseButton>
              <BaseButton variant="destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </BaseButton>
            </div>
          </div>

          {/* Arc Icons */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Arc (Motion-powered)
            </h3>
            <div className="flex flex-wrap gap-3">
              <ArcButton variant="primary">
                <Save className="h-4 w-4" />
                Save changes
              </ArcButton>
              <ArcButton variant="secondary">
                <Download className="h-4 w-4" />
                Download
              </ArcButton>
              <ArcButton variant="danger">
                <Trash2 className="h-4 w-4" />
                Delete
              </ArcButton>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section className="space-y-4 rounded-lg border border-border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold">Key Differences</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-green-600" />
            <span>
              <strong>Arc:</strong> Width morphs smoothly when label changes
              (Save → Saved)
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-green-600" />
            <span>
              <strong>Arc:</strong> Press feedback scales to ~0.97 with spring
              physics
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-green-600" />
            <span>
              <strong>Arc:</strong> Loading spinner with built-in states and
              smooth transitions
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-green-600" />
            <span>
              <strong>Arc:</strong> Label crossfades with subtle blur during
              changes
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-green-600" />
            <span>
              <strong>Arc:</strong> Respects prefers-reduced-motion (disables
              animations)
            </span>
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-green-600" />
            <span>
              <strong>Arc:</strong> Keeps button focusable during loading (uses
              aria-busy)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-muted-foreground">
              <strong>Base UI:</strong> CSS transitions only, no width morphing
              or spring physics
            </span>
          </li>
        </ul>
      </section>

      {/* Motion Tokens Info */}
      <section className="space-y-4 rounded-lg border border-border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold">Motion Tokens Available</h2>
        <p className="text-sm text-muted-foreground">
          Arc installed shared motion tokens at{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            @/components/arc/lib/motion-tokens
          </code>
        </p>
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <strong className="block text-xs uppercase tracking-wider text-muted-foreground">
              Springs
            </strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>snappy (0.26s, bounce 0.12)</li>
              <li>smooth (0.4s, bounce 0)</li>
              <li>morph (0.42s, bounce 0.16)</li>
            </ul>
          </div>
          <div>
            <strong className="block text-xs uppercase tracking-wider text-muted-foreground">
              Durations
            </strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>instant (0.12s)</li>
              <li>fast (0.16s)</li>
              <li>standard (0.24s)</li>
            </ul>
          </div>
          <div>
            <strong className="block text-xs uppercase tracking-wider text-muted-foreground">
              Easing
            </strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>enter, exit, standard</li>
              <li>Cubic bezier curves</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
