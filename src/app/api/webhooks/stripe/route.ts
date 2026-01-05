import Stripe from "stripe";
import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";
import { WebhookProvider } from "@/generated/prisma/enums";
import prisma from "@/lib/db";

const stripe = new Stripe("dummy_secret_key", {
  typescript: true,
});

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter:workflowId",
        },
        { status: 400 }
      );
    }

    const stripeSecret = await prisma.webhookVerification.findUnique({
      where: {
        workflowId_provider: {
          workflowId,
          provider: WebhookProvider.STRIPE,
        },
      },
    });

    if (!stripeSecret || !stripeSecret.signingSecret) {
      return NextResponse.json(
        { error: "No signing secret found for this workflow" },
        { status: 404 }
      );
    }

    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const rawBody = await request.text();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        stripeSecret.signingSecret
      );
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error?.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${error?.message}` },
        { status: 400 }
      );
    }
  

    const stripeData = {
      // Event Metadata
      eventId: event.id,
      eventType: event.type,
      timestamp: event.created,
      livemode: event.livemode,
      raw: event.data?.object,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Stripe webhook error: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Stripe submission",
      },
      { status: 500 }
    );
  }
}
