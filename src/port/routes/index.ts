import personalController from "./personal";
import statusController from "./status";
import chatController from "./chat";
import notificationController from "./notification";
import { Elysia } from "elysia";

export const routeController = new Elysia()
  .use(personalController)
  .use(statusController)
  .use(chatController)
  .use(notificationController);
