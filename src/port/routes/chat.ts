import { Elysia } from "elysia";
// import { Logger } from "winston";
import { Ctx } from "src/type";

const statusController = new Elysia({
  prefix: "/chat",
  tags: ["chat"]
})
  .post("/today", async (ctx: Ctx) => {
    const {
      date,
      uid
    }: {
      date: string;
      uid: string;
    } = ctx.body as any;

    const chat = await ctx.service.chat.getTodayChat(uid, date);

    return {
      status: "ok",
      message: "succesfully get today chat",
      data: { chat }
    };
  })
  .post("/send", async (ctx: Ctx) => {
    const {
      chatId,
      uid,
      text,
      date
    }: {
      uid: string;
      chatId: string;
      text: string;
      date?: string ;
    } = ctx.body as any;

    const chat = await ctx.service.chat.createSendMessageByUser(
      uid,
      chatId,
      text,
      date
    );

    return {
      status: "ok",
      message: "succesfully get today chat",
      data: { chat }
    };
  });

export default statusController;
