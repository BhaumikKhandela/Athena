import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
};

/** Use on login/signup: if already signed in, send users to the app. */
export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/workflows");
  }
};
