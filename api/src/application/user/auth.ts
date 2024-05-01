import { FastifyInstance } from "fastify";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import { UserSubsetSS } from "../sonamu.generated";

export function setupAuth(server: FastifyInstance) {
  server.register(fastifySecureSession, {
    secret: process.env.PASSPORT_SECRET ?? "secret",
    salt: process.env.PASSPORT_SALT ?? "salt",
    cookie: {
      domain: process.env.DOMAIN ?? "localhost",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10,
    },
  });
  server.register(fastifyPassport.initialize());
  server.register(fastifyPassport.secureSession());

  fastifyPassport.registerUserSerializer<UserSubsetSS, UserSubsetSS>(
    async (user, _request) => Promise.resolve(user)
  );
  fastifyPassport.registerUserDeserializer<UserSubsetSS, UserSubsetSS>(
    async (serialized, _request) => serialized
  );
}
