import { Polar } from "@polar-sh/sdk";

/** Polar client for `@polar-sh/better-auth` (checkout, portal, customer creation on sign-up). */
export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
