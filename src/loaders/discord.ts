import { Client, GatewayIntentBits } from "discord.js";
import config from "src/loaders/config";

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ]
});

await client.login(config.discord.token);

export default client;
