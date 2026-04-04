import { Polar } from "@polar-sh/sdk";
import { APIError } from "better-auth/api";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox", // TODO change in production
});

/**
 * Polar does not allow updating `external_id` on an existing customer. The stock
 * `@polar-sh/better-auth` hook tries to patch it after signup, which breaks when a
 * sandbox customer already exists for the email with a different external id (e.g.
 * after resetting the app DB). We create (or replace) the customer with the correct
 * `externalId` in one step instead.
 */
export async function syncPolarCustomerOnUserCreate(user: {
  id: string;
  email: string;
  name?: string | null;
}) {
  if (!user.email) {
    throw new APIError("BAD_REQUEST", {
      message: "An associated email is required",
    });
  }
  try {
    const { result: existingCustomers } = await polarClient.customers.list({
      email: user.email,
    });
    const existing = existingCustomers.items[0];
    if (existing) {
      if (existing.externalId === user.id) {
        return;
      }
      await polarClient.customers.delete({ id: existing.id });
    }
    await polarClient.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      externalId: user.id,
    });
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : `Polar customer creation failed: ${String(e)}`;
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: `Polar customer creation failed. Error: ${message}`,
    });
  }
}

export async function syncPolarCustomerOnUserUpdate(user: {
  id: string;
  email: string;
  name?: string | null;
}) {
  try {
    await polarClient.customers.updateExternal({
      externalId: user.id,
      customerUpdateExternalID: {
        email: user.email,
        name: user.name ?? undefined,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Polar customer update failed. Error: ${e.message}`);
    } else {
      console.error(`Polar customer update failed. Error: ${e}`);
    }
  }
}

export async function deletePolarCustomerOnUserDelete(
  email: string | null | undefined,
) {
  if (!email) return;
  try {
    const { result: existingCustomers } = await polarClient.customers.list({
      email,
    });
    const existing = existingCustomers.items[0];
    if (existing) {
      await polarClient.customers.delete({ id: existing.id });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Polar customer delete failed. Error: ${e.message}`);
    } else {
      console.error(`Polar customer delete failed. Error: ${e}`);
    }
  }
}
