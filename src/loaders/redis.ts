import { createClient } from "redis";
import config from "./config";
import logger from "./logger";

const client = createClient({
  url: config.redis.url,
  password: config.redis.password
});

async function connect() {
  await client.connect();
  logger.info("😼 Server connecting to redis 😼");
}

async function disconnect() {
  await client.disconnect();
  logger.info("😼 Server closing redis connection 😼");
}
export { connect, disconnect };

export default client;
