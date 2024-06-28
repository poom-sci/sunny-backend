import * as pg from "drizzle-orm/pg-core";

export const summary = pg.pgTable(
  "summary",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    date: pg.date("date").notNull(),
    color: pg.varchar("color", { length: 256 }).notNull(),
    summary: pg.text("summary"),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (summary) => {
    return {
      summaryUidIndex: pg.uniqueIndex("summary_uid_idx").on(summary.uid)
    };
  }
);