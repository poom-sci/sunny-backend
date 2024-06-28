import * as pg from "drizzle-orm/pg-core";

export const messageCreatedByType = pg.pgEnum("messageCreatedByType", [
  "user",
  "system"
]);

export const messageStatus = pg.pgEnum("messageStatus", [
  "pending",
  "processing",
  "failed",
  "success"
]);

export const message = pg.pgTable(
  "message",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    chatId: pg.varchar("chat_id", { length: 256 }).notNull(),
    date: pg.date("date").notNull(),
    text: pg.text("text").notNull(),
    status: messageStatus("status").notNull(),
    createdBy: messageCreatedByType("created_by").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (message) => {
    return {
      uidIndex: pg.index("message_uid_idx").on(message.uid),
      chatIdIndex: pg.index("message_chat_id_idx").on(message.chatId)
    };
  }
);
