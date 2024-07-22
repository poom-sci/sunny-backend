import * as pg from "drizzle-orm/pg-core";

export const notification = pg.pgTable(
  "notification",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    uid: pg.varchar("uid", { length: 50 }).notNull(),
    notificationTokenId: pg.text("notification_token_id").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (notification) => {
    return {
      notificationIdIndex: pg
        .index("notification_id_idx")
        .on(notification.notificationTokenId)
    };
  }
);
