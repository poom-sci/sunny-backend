import { Elysia } from "elysia";

import * as redis from "./redis";
import * as rabbit from "./rabbit";
import * as personal from "./personal";
import * as chat from "./chat";

export default { redis, rabbit, personal, chat };
