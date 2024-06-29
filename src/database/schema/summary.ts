import * as pg from "drizzle-orm/pg-core";

export const summary = pg.pgTable(
  "summary",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    chatId: pg.varchar("chat_id", { length: 256 }).notNull(),
    date: pg.date("date").notNull(),
    color: pg.varchar("color", { length: 256 }).notNull(),
    color1: pg.varchar("color1", { length: 256 }).notNull(),
    summary: pg.text("summary"),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (summary) => {
    return {
      summaryUidIndex: pg.index("summary_uid_idx").on(summary.uid),
      summaryChatIdIndex: pg.index("summary_chat_id_idx").on(summary.chatId)
    };
  }
);
