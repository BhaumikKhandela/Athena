"use client";

import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const categories = [
  "AI Automation",
  "Lead Management",
  "Sales",
  "Marketing",
  "Support",
  "Finance",
  "HR",
] as const;

const tabPanels: Record<
  (typeof categories)[number],
  { title: string; graphic: "email" | "sales" | "chat" }[]
> = {
  "AI Automation": [
    {
      title: "Craft personalized email responses for customers effortlessly.",
      graphic: "email",
    },
    {
      title: "Generate sales call summaries with AI-powered insights.",
      graphic: "sales",
    },
    {
      title: "Engage leads around the clock with an intelligent sales chatbot.",
      graphic: "chat",
    },
  ],
  "Lead Management": [
    {
      title: "Route inbound leads to the right owner in seconds.",
      graphic: "email",
    },
    {
      title: "Score and prioritize leads with clear, explainable rules.",
      graphic: "sales",
    },
    {
      title: "Sync CRM updates across tools without manual data entry.",
      graphic: "chat",
    },
  ],
  Sales: [
    { title: "Automate follow-ups so deals never go cold.", graphic: "email" },
    {
      title: "Roll up pipeline changes to your team every morning.",
      graphic: "sales",
    },
    {
      title: "Notify reps when accounts show buying signals.",
      graphic: "chat",
    },
  ],
  Marketing: [
    {
      title: "Trigger campaigns when prospects hit key milestones.",
      graphic: "email",
    },
    {
      title: "Attribute revenue to the journeys that actually convert.",
      graphic: "sales",
    },
    {
      title: "Keep messaging consistent across every channel.",
      graphic: "chat",
    },
  ],
  Support: [
    {
      title: "Triage tickets and suggest replies automatically.",
      graphic: "email",
    },
    {
      title: "Escalate urgent issues with full conversation context.",
      graphic: "sales",
    },
    {
      title: "Give customers self-serve answers that feel personal.",
      graphic: "chat",
    },
  ],
  Finance: [
    {
      title: "Reconcile events and notify finance when thresholds hit.",
      graphic: "email",
    },
    {
      title: "Export structured data to your ledger on a schedule.",
      graphic: "sales",
    },
    {
      title: "Alert on anomalies before they become surprises.",
      graphic: "chat",
    },
  ],
  HR: [
    {
      title: "Onboard new hires with consistent, timely nudges.",
      graphic: "email",
    },
    {
      title: "Collect feedback and route it to the right stakeholders.",
      graphic: "sales",
    },
    {
      title: "Keep systems in sync when roles or teams change.",
      graphic: "chat",
    },
  ],
};

export function FeaturesTabsSection() {
  return (
    <section id="pricing" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Save time and effort by using our pre-designed templates
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Boost efficiency with ready-to-use templates, streamlining tasks,
            reducing errors, and accelerating workflow automation effortlessly.
          </p>
        </div>

        <Tabs defaultValue="AI Automation" className="w-full">
          <TabsList className="bg-muted/50 mb-10 flex h-auto w-full flex-wrap justify-center gap-2 rounded-2xl p-2 md:mb-14">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className={cn(
                  "text-muted-foreground rounded-full border border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary",
                )}
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0 outline-none">
              <div className="grid gap-6 md:grid-cols-3">
                {tabPanels[cat].map((item) => (
                  <Card
                    key={item.title}
                    className="overflow-hidden border shadow-md transition-shadow hover:shadow-lg"
                  >
                    <CardHeader className="p-0">
                      <FeatureGraphic kind={item.graphic} />
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-base font-semibold leading-snug">
                        {item.title}
                      </p>
                    </CardContent>
                    <CardFooter className="pb-6">
                      <Button
                        variant="link"
                        className="text-primary h-auto p-0 font-normal"
                      >
                        Learn more
                        <ArrowRight className="size-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function FeatureGraphic({ kind }: { kind: "email" | "sales" | "chat" }) {
  if (kind === "email") {
    return (
      <div className="landing-dot-grid relative h-44 border-b bg-muted/40 p-4">
        <div className="rounded-lg border bg-background p-3 shadow-sm">
          <p className="text-muted-foreground mb-2 text-xs font-medium">
            Inbox email
          </p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-primary text-xs">✓</span>
                <div className="bg-muted h-2 flex-1 rounded" />
              </div>
            ))}
          </div>
          <Button size="sm" className="mt-3 w-full rounded-md text-xs">
            Custom
          </Button>
        </div>
      </div>
    );
  }
  if (kind === "sales") {
    return (
      <div className="relative flex h-44 flex-col items-center justify-center border-b bg-muted/40 p-4">
        <div className="relative flex size-28 items-center justify-center">
          <div className="border-primary/30 absolute inset-0 rounded-full border-2 border-dashed" />
          <Button size="sm" className="relative z-10 rounded-full text-xs">
            Generate
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">analyzing…</p>
        <div className="bg-muted-foreground/20 mt-2 h-1.5 w-32 overflow-hidden rounded-full">
          <div className="bg-primary h-full w-2/3 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-44 border-b bg-muted/40 p-4">
      <div
        className="h-full rounded-lg border bg-background p-3 shadow-sm"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      >
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
          <Search className="size-3" />
          Chatbot
        </div>
        <div className="space-y-2">
          <div className="bg-primary/15 ml-4 max-w-[85%] rounded-lg rounded-tr-none px-2 py-1.5 text-[10px]">
            Thanks for reaching out — how can we help?
          </div>
          <div className="mr-4 max-w-[70%] rounded-lg rounded-tl-none bg-muted px-2 py-1.5 text-[10px]">
            I need pricing for the team plan.
          </div>
        </div>
      </div>
    </div>
  );
}
