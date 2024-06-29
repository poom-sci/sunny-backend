import { count, relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { duration } from "moment";

export const mood = pg.pgTable(
  "mood",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 256 }).notNull(),
    date: pg.date("date").notNull(),
    week: pg.integer("week").notNull(),
    play: pg.integer("play").notNull(),
    work: pg.integer("work").notNull(),
    study: pg.integer("study").notNull(),
    relationship: pg.integer("relationship").notNull(),
    health: pg.integer("health").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (mood) => {
    return {
      moodUidIndex: pg.index("mood_uid_idx").on(mood.uid)
    };
  }
);
