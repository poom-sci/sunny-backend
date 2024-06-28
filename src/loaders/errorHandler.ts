import logger from "src/loaders/logger";
import { Elysia } from "elysia";

// import { Ctx } from "src/type";

async function errorHandler(ctx: any) {
  if (ctx.code === "NOT_FOUND") {
    return "Route not found :(";
  }

  if (ctx.error.message) {
    return ctx.error.message;
  }

  return "Something went wrong :(";
}

export default errorHandler;
