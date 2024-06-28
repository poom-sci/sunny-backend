import dotenv from "dotenv";

if (process.env.NODE_ENV === "cloud_run_development") {
  dotenv.config({ path: "/.env/development" });
} else if (process.env.NODE_ENV === "cloud_run_production") {
  dotenv.config({ path: "/.env/production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "production_aws") {
  dotenv.config({ path: ".env" });
} else {
  dotenv.config();
}

const config: {
  port: string;
  logger: {
    level: string;
    stack: string;
    service: string;
  };
  postgresql: {
    uri: string;
    user: string;
    host: string;
    database: string;
    password: string;
    port: string;
  };
  redis: {
    url: string;
    password: string;
  };
  rabbitmq: {
    connection: string;
  };
  firebase: {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string | undefined;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universal_domain: string;
  };
  env: string;
  service: {
    MAINTENANCE_CACHE_TTL: number;
  };
  discord: {
    token: string;
    channelId: string;
  };
} = {
  port: process.env.PORT ?? "3000",
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    stack: process.env.LOG_STACK ?? "false",
    service: process.env.LOG_SERVICE ?? "development-app"
  },
  postgresql: {
    uri:
      process.env.DATABASE_URL ??
      "postgres://postgres:adminadmin@0.0.0.0:5432/db",
    user: process.env.POSTGRES_USER ?? "postgres",
    host: process.env.POSTGRES_HOST ?? "localhost",
    database: process.env.POSTGRES_DATABASE ?? "postgres",
    password: process.env.POSTGRES_PASSWORD ?? "password",
    port: process.env.POSTGRES_PORT ?? "5432"
  },
  redis: {
    url: process.env.REDIS_URL ?? "localhost",
    password: process.env.REDIS_PASSWORD ?? "password"
  },
  rabbitmq: {
    connection: process.env.RABBIT_CONNECTION ?? "amqp://localhost"
  },
  firebase: {
    type: process.env.FIREBASE_TYPE ?? "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID ?? "project",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID ?? "private_key_id",
    private_key: process.env.FIREBASE_PRIVATE_KEY ?? "private",
    client_email: process.env.FIREBASE_CLIENT_EMAIL ?? "client_email",
    client_id: process.env.FIREBASE_CLIENT_ID ?? "client_id",
    auth_uri: process.env.FIREBASE_AUTH_URI ?? "auth_uri",
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ??
      "auth_provider_x509_cert_url",
    client_x509_cert_url:
      process.env.FIREBASE_CLIENT_X509_CERT_URL ?? "client_x509_cert_url",
    universal_domain:
      process.env.FIREBASE_UNIVERSAL_DOMAIN ?? "universal_domain"
  },
  env: process.env.ENVIRONMENT ?? "development",
  service: {
    MAINTENANCE_CACHE_TTL: 600
  },
  discord: {
    token: process.env.DISCORD_TOKEN ?? "",
    channelId: process.env.DISCORD_CHANNEL_ID ?? ""
  }
};

export default config;
