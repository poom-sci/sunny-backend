import { Elysia } from "elysia";

import * as redis from "./redis";
import * as rabbit from "./rabbit";
import * as personal from "./personal";
import * as chat from "./chat";
import * as mood from "./mood";
import * as goal from "./goal";
import * as notification from "./notification";

export default { redis, rabbit, personal, chat, mood, goal, notification };
