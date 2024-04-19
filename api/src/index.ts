console.time("total");
require("dotenv").config();
import fastify from "fastify";
import { Context, Sonamu, UnauthorizedException } from "sonamu";
import { setupAuth } from "./application/user/auth";

const host = "localhost";
const port = 19000;

const server = fastify();
server.register(require("fastify-qs"));

setupAuth(server);

async function bootstrap() {
  await Sonamu.withFastify(server, {
    contextProvider: (defaultContext, request) => {
      return {
        ...defaultContext,
        session: request.session,
        user: request.user ?? null,
        passport: {
          login: request.login.bind(request) as Context["passport"]["login"],
          logout: request.logout.bind(request) as Context["passport"]["logout"],
        },
      };
    },
    guardHandler: (guard, request, _api) => {
      if (guard === "admin") {
        if (request.user?.role !== "admin") {
          throw new UnauthorizedException("관리자 권한이 필요합니다.");
        }
      } else if (guard === "normal") {
        if (!request.user) {
          throw new UnauthorizedException("로그인이 필요합니다.");
        }
      }
    },
  });

  server
    .listen({ port, host })
    .then(() => {
      console.log(`🌲 Server listening on http://${host}:${port}`);
      console.timeEnd("total");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
bootstrap();
