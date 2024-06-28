import * as pg from "drizzle-orm/pg-core";

export const registerTypeEnum = pg.pgEnum("registerType", [
  "email",
  "google",
  "github"
]);

export const personal = pg.pgTable(
  "personal",
  {
    userId: pg.uuid("user_id").defaultRandom().primaryKey(),
    firebaseUid: pg.varchar("firebase_uid", { length: 256 }).notNull(),
    userName: pg.varchar("user_name", { length: 256 }).notNull(),
    firstName: pg.varchar("first_name", { length: 256 }),
    lastName: pg.varchar("last_name", { length: 256 }),
    color: pg.varchar("color", { length: 256 }),
    age: pg.integer("age"),
    gender: pg.varchar("gender", { length: 256 }),
    sunnyCategory: pg.varchar("sunny_category", { length: 256 }),
    email: pg.varchar("email", { length: 256 }).notNull(),
    isEmailVerified: pg.boolean("is_email_verified").notNull().default(false),
    displayImage: pg.text("display_image"),
    phoneNumber: pg.varchar("phone_number", { length: 256 }),
    registerType: registerTypeEnum("register_type").notNull(),
    isActive: pg.boolean("is_active").notNull().default(true),
    lastLoginAt: pg.timestamp("last_login_at").defaultNow(),
    createdAt: pg.timestamp("created_at").defaultNow(),
    updatedAt: pg.timestamp("updated_at").defaultNow()
  },
  (personal) => {
    return {
      emailIndex: pg.index("personal_email_idx").on(personal.email),
      firebaseUidIndex: pg
        .uniqueIndex("personal_firebase_uid_idx")
        .on(personal.firebaseUid)
    };
  }
);
