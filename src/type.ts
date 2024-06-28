import { Elysia, Context } from "elysia";

// loaders
import type Logger from "src/loaders/logger";
import type Config from "src/loaders/config";

// domain
import type Domain from "src/database/domain";

// service
import type Service from "src/services";

interface Ctx extends Context {
  // loaders
  logger: typeof Logger;
  config: typeof Config;

  // domain
  domain: typeof Domain;

  // service
  service: typeof Service;
}

export type { Ctx };
