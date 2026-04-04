import {
  FastForward,
  FileText,
  Layers,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaqAccordionSection } from "./components/faq-accordion";
import { FeaturesTabsSection } from "./components/features-tabs";
import { HeroSubscribeForm } from "./components/hero-subscribe-form";
import { LogoMarqueeSection } from "./components/logo-marquee";

const benefitItems = [
  {
    title: "Flow in motion",
    description:
      "Automate tasks, streamline processes, and boost productivity.",
    gradient: "from-emerald-400 to-teal-600",
    Icon: Layers,
  },
  {
    title: "Swift and seamless",
    description: "Create powerful workflows effortlessly, reducing errors.",
    gradient: "from-sky-400 to-blue-600",
    Icon: Zap,
  },
  {
    title: "Automate with ease",
    description: "Streamline processes, save time, and enhance efficiency.",
    gradient: "from-orange-400 to-red-500",
    Icon: Sparkles,
  },
  {
    title: "Quick start",
    description:
      "Choose from a library of pre-built workflow templates designed to save time.",
    gradient: "from-indigo-400 to-violet-600",
    Icon: FastForward,
  },
  {
    title: "Smooth sync",
    description:
      "Connect your team across departments in one seamless flow in real time.",
    gradient: "from-fuchsia-400 to-pink-600",
    Icon: RefreshCw,
  },
  {
    title: "Taskly",
    description:
      "Eliminate manual work with powerful automation tools that handle the busywork.",
    gradient: "from-amber-400 to-orange-500",
    Icon: FileText,
  },
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="landing-dot-grid relative min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
        <LandingNav />
        <header className="mx-auto max-w-7xl px-4 pt-8 pb-16 text-center sm:px-6 md:pt-12 md:pb-24">
          <h1 className="text-foreground mx-auto max-w-4xl text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Automation without limits, power{" "}
            <span className="text-primary" aria-hidden>
              ⚡
            </span>{" "}
            without effort
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty">
            Effortlessly connect your tools, streamline tasks, and unlock a new
            era of productivity powered by seamless automation.
          </p>

          <div className="relative mx-auto mt-10 flex max-w-lg flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <p className="text-emerald-600 absolute -left-2 -top-10 max-w-[140px] rotate-[-6deg] text-left font-serif text-sm italic sm:-left-24 sm:top-2">
              Get 3 months trial now!
            </p>
            <svg
              className="text-emerald-500 absolute -left-4 top-8 hidden h-12 w-16 sm:block sm:-left-20 sm:top-6"
              viewBox="0 0 120 48"
              fill="none"
              aria-hidden
            >
              <title>Arrow to email field</title>
              <path
                d="M8 40 Q 40 8 100 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M92 6 L100 12 L94 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <HeroSubscribeForm />
          </div>

          <div className="mx-auto mt-14 w-full max-w-6xl px-0 sm:mt-16">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
              <Image
                src="/hero.png"
                alt="Athena workflow builder with connected Stripe, Gemini, HTTP, Discord, and Slack nodes"
                width={2880}
                height={1636}
                className="h-auto w-full"
                priority
                sizes="(max-width: 1280px) 100vw, 1152px"
              />
            </div>
          </div>
        </header>

        <LogoMarqueeSection />
      </div>

      <section
        id="how-it-works"
        className="bg-[oklch(0.985_0.005_264)] py-20 md:py-28 dark:bg-muted/20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Benefits
            </Badge>
            <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Rapidly create high-performance workflows
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Athena&apos;s got you covered with simple tools to supercharge
              your workflows, no matter your team&apos;s size.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefitItems.map(({ title, description, gradient, Icon }) => (
              <Card
                key={title}
                className="border-0 bg-white shadow-md dark:bg-card"
              >
                <CardContent className="pt-8 pb-8">
                  <div
                    className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FeaturesTabsSection />

      <section id="success-stories" className="bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
              Enterprise grade solutions built for efficiency and scale.
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Optimized systems crafted to streamline, scale, and elevate
              business performance.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <Card className="from-primary/15 via-chart-1/25 to-chart-3/20 border-0 bg-gradient-to-br to-transparent p-8 shadow-md md:row-span-2">
              <div className="mb-6 flex items-center gap-2">
                <span className="flex gap-1" aria-hidden>
                  <span className="size-2 rounded-full bg-orange-400" />
                  <span className="size-2 rounded-full bg-orange-500" />
                  <span className="size-2 rounded-full bg-orange-600" />
                </span>
                <span className="text-sm font-semibold">Asana</span>
              </div>
              <h3 className="text-xl font-bold">
                A true game-changer for our business!
              </h3>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Tasks that used to take hours are now completed in minutes.
                Highly recommend for any business looking to optimize
                efficiency! The intuitive interface, automation features, and
                seamless integration make workflow management effortless.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-xs text-primary">
                    EP
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Eleanor Pena</p>
                  <p className="text-muted-foreground text-xs">Scrum Master</p>
                </div>
              </div>
            </Card>

            <TestimonialCard
              title="Seamless, efficient, and simple!"
              quote="The automation tools alone have saved us so much time. We couldn't be happier!"
              name="Marvin McKinney"
              jobTitle="Marketing Coordinator"
              initials="MM"
            />
            <TestimonialCard
              title="Boosted our productivity."
              quote="The ability to automate repetitive tasks has allowed us to focus on growth, strategy, and innovation."
              name="Floyd Miles"
              jobTitle="Project Manager"
              initials="FM"
            />
            <TestimonialCard
              title="Powerful features and simple!"
              quote="Our entire team quickly adapted, and now we can't imagine working without it!"
              name="Ronald Richards"
              jobTitle="President of Sales"
              initials="RR"
            />
            <TestimonialCard
              title="Reliable, scalable, and perfect."
              quote="It's reliable, efficient, and constantly evolving to meet modern business demands."
              name="Bessie Cooper"
              jobTitle="Team Leader"
              initials="BC"
            />
          </div>
        </div>
      </section>

      <FaqAccordionSection />

      <section
        id="cta"
        className="landing-dot-grid relative overflow-hidden bg-gradient-to-b from-primary/5 via-muted/40 to-primary/10 py-20 md:py-28"
      >
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="bg-primary mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-primary-foreground shadow-lg">
            A
          </div>
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Less chaos, more flow
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Integrate apps, automate processes, and unlock team potential with
            one sleek platform.
          </p>
          <Button size="lg" className="mt-8 rounded-full px-10 shadow-md">
            Subscribe
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  return (
    <nav className="sticky top-4 z-50 mx-auto flex max-w-5xl justify-center px-4">
      <div className="bg-card/95 supports-[backdrop-filter]:bg-card/80 flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border px-4 py-2 shadow-lg backdrop-blur md:px-6">
        <Link
          href="/landing"
          className="flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <Image
            src="/logos/logo.svg"
            alt=""
            width={78}
            height={32}
            className="h-8 w-auto shrink-0"
            priority
          />
          <span className="text-foreground text-lg font-semibold tracking-tight">
            Athena
          </span>
        </Link>
        <div className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
          <a
            href="#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#success-stories"
            className="hover:text-foreground transition-colors"
          >
            Success stories
          </a>
          <Link
            href="/login"
            className="hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        </div>
        <Button asChild size="sm" className="rounded-full">
          <Link href="/signup">Get started</Link>
        </Button>
      </div>
    </nav>
  );
}

function TestimonialCard({
  title,
  quote,
  name,
  jobTitle,
  initials,
}: {
  title: string;
  quote: string;
  name: string;
  jobTitle: string;
  initials: string;
}) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6 pb-6">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {quote}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-muted-foreground text-xs">{jobTitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold leading-snug text-balance">
              Sign up for our newsletter and stay updated with the latest news.
            </h2>
          </div>
          <div className="w-full max-w-sm">
            <p className="text-background/60 mb-3 text-xs font-semibold tracking-wider uppercase">
              Receive updates from us
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                type="email"
                placeholder="Your email address"
                className="border-0 border-b border-background/30 bg-transparent px-0 shadow-none focus-visible:ring-0 rounded-none"
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-full border-background/50 !bg-transparent !text-background shadow-none hover:!bg-background/15 hover:!text-background"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-10 border-t border-background/20 pt-10 md:flex-row md:justify-between">
          <div className="text-background/80 flex gap-5">
            <Link
              href="#"
              className="hover:text-background"
              aria-label="Instagram"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <title>Instagram</title>
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 1 0 10.001 0A5 5 0 0 1 12 7zm6.5-.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="hover:text-background"
              aria-label="LinkedIn"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <title>LinkedIn</title>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.07c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V23h-4V8z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="hover:text-background"
              aria-label="Facebook"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <title>Facebook</title>
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </Link>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterCol
              title="Company"
              links={[
                "Who we are",
                "Join our team",
                "News & updates",
                "Meet our leaders",
                "Get in touch",
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                "Expert articles",
                "Webinars & events",
                "Success stories",
                "Help center",
              ]}
            />
            <FooterCol
              title="Solutions"
              links={[
                "Smart hiring",
                "Engaged teams",
                "Insightful analytics",
                "Effortless automation",
                "Scalable growth",
              ]}
            />
            <FooterCol
              title="Support"
              links={[
                "System status",
                "Community forum",
                "Email support",
                "Onboarding & training",
              ]}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-background/15 bg-black/25 py-4 text-center text-sm text-background/70">
        © {new Date().getFullYear()} Athena. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="mb-3 font-semibold">{title}</p>
      <ul className="text-background/60 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <Link href="#" className="hover:text-background transition-colors">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
