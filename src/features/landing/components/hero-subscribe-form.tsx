"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function HeroSubscribeForm() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    const value = email.trim();
    if (!value) {
      return;
    }
    toast.success("Subscribed");
    setEmail("");
  };

  return (
    <>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your business email"
        className="bg-background h-11 max-w-sm rounded-full border shadow-sm md:flex-1"
        autoComplete="email"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubscribe();
          }
        }}
      />
      <Button
        type="button"
        size="lg"
        className={cn(
          "rounded-full px-8",
          !email.trim() && "cursor-not-allowed",
        )}
        aria-disabled={!email.trim()}
        onClick={handleSubscribe}
      >
        Subscribe
      </Button>
    </>
  );
}
