import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import {
  polar,
  checkout,
  portal,
} from "@polar-sh/better-auth";
import { polarClient } from "./polar";

const trustedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.BETTER_AUTH_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.NGROK_URL ? `https://${process.env.NGROK_URL}` : undefined,
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "c130278c-b1b2-4de7-9245-6a144de62135",
              slug: "Athena-Pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Athena-Pro
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins,
});
