import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { serverTiming } from "@elysiajs/server-timing";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import postgres from "src/loaders/postgresql";
import { helmet } from "elysia-helmet";
// import { ip } from "elysia-ip";

import { compression } from "elysia-compression";

const encoder = new TextEncoder();

// const app = new Elysia()

const app = function name(app: Elysia) {
  app
    // .use(ip())
    .use(
      cors({
        origin: "*"
        // methods: ["GET", "POST"],
        // allowedHeaders: ["Content-Type", "Authorization"]
      })
    )
    .use(
      swagger({
        path: "/swagger", // endpoint which swagger will appear on
        documentation: {
          info: {
            title: "Bun.js CRUD app with Elysia.js",
            version: "1.0.0"
          }
        }
      })
    )
    // FIXME: This is not working
    // .use(compression());
    .mapResponse(({ response }) => {
      return new Response(
        Bun.gzipSync(
          typeof response === "object"
            ? JSON.stringify(response)
            : (response ?? "").toString()
        ),
        {
          headers: {
            "Content-Encoding": "gzip",
            "Content-Type": `${
              typeof response === "object" ? "application/json" : "text/plain"
            }; charset=utf-8`
          }
        }
      );
    })
    .use(
      jwt({
        name: "jwt",
        secret: "Fischl von Luftschloss Narfidort"
      })
    )
    .use(bearer());
  return app;
};

// .use(
//   helmet({
//     /* your options */
//   })
// );

// .use(serverTiming());

export default app;
