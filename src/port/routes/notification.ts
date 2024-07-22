import { Elysia, NotFoundError, t } from "elysia";
import logger from "src/loaders/logger";
import { Ctx } from "src/type";
// import personalService from "src/services/personal";

const notificationController = new Elysia({
  prefix: "/notification",
  tags: ["notification"]
}).post("/token", async (ctx: Ctx) => {
  const {
    firebaseUid,
    token
  }: {
    firebaseUid: string;
    token: string;
  } = ctx.body as any;

  try {
    const user = await ctx.service.notification.upsertNotificationToken(
      firebaseUid,
      token
    );

    return {
      detail: "notification upserted.",
      user
    };
  } catch (error: any) {
    throw new Error(error.message || "Error while creating user.");
  }
});

export default notificationController;
