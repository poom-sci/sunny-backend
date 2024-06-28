import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import config from "./config";
import * as schema from "../database/schema";
import logger from "./logger";

// for query purposes
const queryClient = postgres(config.postgresql.uri, {});
const db = drizzle(queryClient, { schema });

logger.info("🦫  Server connecting to postgresql 🦫");

export default db;
