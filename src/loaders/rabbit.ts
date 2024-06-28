import amqplib, { ConsumeMessage } from "amqplib";

import Logger from "src/loaders/logger";
import config from "src/loaders/config";

const closeRabbit = async () => {
  await connection.close();
  Logger.info("🐰 Server closing rabbitmq connection 🐰");
};

const connection = await amqplib.connect(config.rabbitmq.connection, {
  timeout: 1000
});
const channel = await connection.createChannel();
await channel.prefetch(1);
Logger.info("🐰 Server connecting to rabbitmq 🐰");

export { closeRabbit };
export default channel;
