import Image from "next/image";

const INTEGRATION_LOGOS = [
  { src: "/logos/stripe.svg", alt: "Stripe" },
  { src: "/logos/slack.svg", alt: "Slack" },
  { src: "/logos/openai.svg", alt: "OpenAI" },
  { src: "/logos/googleform.svg", alt: "Google Forms" },
  { src: "/logos/google.svg", alt: "Google" },
  { src: "/logos/gemini.svg", alt: "Google Gemini" },
  { src: "/logos/discord.svg", alt: "Discord" },
  { src: "/logos/anthropic.svg", alt: "Anthropic" },
] as const;

function MarqueeRow({ direction }: { direction: "ltr" | "rtl" }) {
  const trackClass =
    direction === "ltr" ? "landing-marquee-ltr" : "landing-marquee-rtl";
  const doubled = [...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS];

  return (
    <div
      className="relative overflow-hidden py-2 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-hidden
    >
      <div className={`flex w-max items-center gap-12 md:gap-20 ${trackClass}`}>
        {doubled.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="flex h-10 shrink-0 items-center justify-center md:h-12"
          >
            <Image
              src={logo.src}
              alt=""
              width={140}
              height={48}
              className="max-h-8 w-auto object-contain opacity-80 md:max-h-10 dark:opacity-90"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoMarqueeSection() {
  return (
    <section
      className="border-border/60 border-y bg-muted/20 py-12 md:py-16"
      aria-labelledby="integrations-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          id="integrations-heading"
          className="text-muted-foreground mb-8 text-center text-sm font-medium tracking-wide uppercase md:mb-10"
        >
          Integrations & services
        </h2>
        <p className="sr-only">
          Connects with Stripe, Slack, OpenAI, Google Forms, Google, Gemini,
          Discord, Anthropic, and more.
        </p>
        <div className="space-y-6 md:space-y-8">
          <MarqueeRow direction="ltr" />
          <MarqueeRow direction="rtl" />
        </div>
      </div>
    </section>
  );
}
