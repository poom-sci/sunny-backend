import { count } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { duration } from "moment";

export const goal = pg.pgTable(
  "goal",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    title: pg.varchar("title", { length: 256 }).notNull(),
    description: pg.text("description"),
    duration: pg.integer("duration").notNull(),
    count: pg.integer("count").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (goal) => {
    return {
      goalUidIndex: pg.index("goal_uid_idx").on(goal.uid)
    };
  }
);
