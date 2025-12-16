import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://a0f127d1f1555b067adb93fd6496c7d8@o4510538527408128.ingest.us.sentry.io/4510538550607872",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});