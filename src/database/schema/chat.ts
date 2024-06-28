import * as pg from "drizzle-orm/pg-core";

export const chatCreatedByType = pg.pgEnum("chatCreatedByType", [
  "user",
  "system"
]);

export const chat = pg.pgTable(
  "chat",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    date: pg.date("date").notNull(),
    createdBy: chatCreatedByType("created_by").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (chat) => {
    return {
      uidIndex: pg.index("chat_uid_idx").on(chat.uid)
    };
  }
);
