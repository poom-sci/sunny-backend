import { count } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { duration } from "moment";

export const futureMe = pg.pgTable(
  "futureMe",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    title: pg.text("title").notNull(),
    ideal: pg.text("ideal").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (futureMe) => {
    return {
      futureMeUidIndex: pg.index("futureMe_uid_idx").on(futureMe.uid)
    };
  }
);
