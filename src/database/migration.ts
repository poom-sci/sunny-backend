import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import config from "../loaders/config";

import * as schema from "./schema";

// for migrations
const migrationClient = postgres(config.postgresql.uri, { max: 1 });

migrate(drizzle(migrationClient, { schema }), {
  migrationsFolder: "./src/database/migration"
});
