import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/landing-page";

export const metadata: Metadata = {
  title: "Automation without limits",
  description:
    "Connect your tools, streamline tasks, and run workflows with triggers, actions, and integrations.",
};

export default function LandingRoutePage() {
  return <LandingPage />;
}
