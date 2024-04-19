import { Session } from "@fastify/secure-session";
import { UserSubsetSS } from "../application/sonamu.generated";

declare module "sonamu" {
  export interface ContextExtend {
    session: Session;
    passport: {
      login: (user: UserSubsetSS) => Promise<void>;
      logout: () => void;
    };
    user: UserSubsetSS | null;
  }
}
