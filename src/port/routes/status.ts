import { Elysia } from "elysia";
// import { Logger } from "winston";
import { Ctx } from "src/type";

const statusController = new Elysia({
  prefix: "/status",
  tags: ["status"]
}).get("", (ctx: Ctx) => {
  return {
    status: "ok",
    message: "service is running"
  };
});

export default statusController;
