import { Elysia } from "elysia";

import { gzipSync } from "bun";
import { validateToken } from "src/services/auth";
validateToken("123");
import {
  connect as redisConnect,
  disconnect as redisDisconnect
} from "src/loaders/redis";

import { closeRabbit as rabbitDisconnect } from "src/loaders/rabbit";

import config from "src/loaders/config";
import logger from "src/loaders/logger";
import middleware from "src/loaders/middleware";
import errorHandler from "src/loaders/errorHandler";
import discord from "src/loaders/discord";
// layers
import domain from "src/database/domain";
import service from "src/services";
import event from "src/port/event";

// routes
import { routeController } from "src/port/routes/index";

async function startConnection() {
  await redisConnect();
}

async function stopConnection() {
  await redisDisconnect();
  await rabbitDisconnect();
}

async function startServer() {
  await startConnection();

  await event();

  const app = new Elysia()
    .use(middleware)
    .decorate("config", config)
    .decorate("logger", logger)
    .onBeforeHandle((ctx) => {
      ctx.logger.info({ method: ctx.request.method, path: ctx.request.url });
    })

    // register layer
    .decorate("domain", domain)
    .decorate("service", service)

    // route
    .use(routeController)

    .get("/test", async () => {
      return { data: "ok" };
    })

    .onError((ctx) => {
      logger.error({
        code: ctx.code,
        error: ctx.error,
        path: ctx.path
      });
      return errorHandler(ctx);
    })

    .listen(config.port)
    .onStop(async ({}) => {
      await stopConnection();
      logger.info("Server stopped");
    });

  logger.info(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} 🦊`
  );
}

startServer();
