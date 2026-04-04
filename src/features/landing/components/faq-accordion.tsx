"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqItems = [
  {
    q: "What is Athena and how does workflow automation help?",
    a: "Athena connects your apps with triggers, actions, and branching logic so repetitive work runs on its own. You design flows visually and monitor executions in one place.",
  },
  {
    q: "Why choose automation over manual handoffs?",
    a: "Automation reduces errors, speeds up turnaround, and keeps teams aligned. Rules and templates scale without adding headcount for every new process.",
  },
  {
    q: "How do I get started?",
    a: "Create an account, pick a template or build from scratch, connect credentials, and publish. You can test runs safely before turning on production traffic.",
  },
  {
    q: "What makes Athena stand out?",
    a: "A focused builder, first-class integrations, and clear execution history—so you can trust what ran, when, and with what data.",
  },
  {
    q: "Are there fees or usage limits?",
    a: "Plans depend on usage and team size. Start with a trial to explore core features, then choose a tier that matches your volume.",
  },
  {
    q: "How is my data handled?",
    a: "Credentials are stored securely, and you control which systems connect to your workspace. Review our security practices for retention and compliance details.",
  },
];

export function FaqAccordionSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <div>
          <Badge variant="outline" className="mb-4">
            Frequently asked questions
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Common questions answered simply.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Your go-to hub for questions on design, buying, updating, and
            getting help.
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-4 shadow-sm last:border-b-0"
            >
              <AccordionTrigger className="hover:no-underline py-4 text-left text-sm font-medium md:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-sm">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
