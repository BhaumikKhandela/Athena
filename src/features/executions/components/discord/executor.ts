import type { NodeExecutor } from "@/features/executions/types";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
  } catch (error) {
    throw new Error(
      `Failed to serialize context to JSON: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
});
type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  username?: string;
  content?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  attempt,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw new NonRetriableError("Discord node: Content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      
      if (!data.webhookUrl) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("Discord node: Webhook URL is missing");
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000), // Discord max message length
          username,
        },
      });

      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("Discord node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });
    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );

    throw error;
  }
};
