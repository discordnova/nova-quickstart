import "source-map-support";
import { Client } from "@discordnova/nova-js";
import { buildHandler } from "./handler/index.mjs";
import { commands } from "./commands/index.mjs";

/**
 * We instanciate our nova broker client.
 */
const emitter = new Client({
  transport: {
    additionalEvents: [],
    nats: {
      servers: ["192.168.0.17:4222"],
    },
    queue: "nova-worker-common",
  },
  rest: {
    api: "http://192.168.0.17:8090/api",
  },
});

// We register our slash command handler.
emitter.on("interactionCreate", buildHandler(commands));

// Simple message handler
emitter.onMessageCreate(async (message) => {
  if (message.content === "~ping") {
    await message.client.channels.createMessage(message.channel_id, {
      content: `Bonjour! <@${message.author.id}>`,
    });
  } else if (message.content === "~pid") {
    await message.client.channels.createMessage(message.channel_id, {
      content: `Mon pid est ${process.pid}`,
    });
  }
});

// We connect ourselves to the nova nats broker.
(async () => emitter.start().then(() => console.log("Nova is ready!")))();
