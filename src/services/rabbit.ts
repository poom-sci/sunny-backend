import amqplib, { ConsumeMessage } from "amqplib";

import Logger from "src/loaders/logger";
import config from "src/loaders/config";
import channel from "src/loaders/rabbit";

const publishToQueue = async (
  queueName: string,
  message: any,
  options?: {}
) => {
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
    ...options
  });
  Logger.info(`[📥] Message sent to ${queueName}`);
};

const subscribeQueue = async (
  queueName: string,
  callback: (msg: any) => Promise<void>
) => {
  await channel.assertQueue(queueName, {
    durable: true,
    autoDelete: false,
    exclusive: false
  });
  await channel.consume(
    queueName,
    async (msg: ConsumeMessage | null) => {
      try {
        const message = JSON.parse(msg!.content.toString());
        Logger.info(`[📤] Message received`, message);
        await callback(message);
      } catch (error) {
        Logger.error(error);
      }
    },
    {
      noAck: true
    }
  );

  Logger.info(
    `[*] Waiting for messages in queue: ${queueName}. To exit press CTRL+C`
  );
};

export { publishToQueue, subscribeQueue };
