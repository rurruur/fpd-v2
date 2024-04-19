import { SubsetQuery } from "sonamu";
import { UserSubsetKey } from "./sonamu.generated";

// SubsetQuery: User
export const userSubsetQueries: { [key in UserSubsetKey]: SubsetQuery } = {
  A: {
    select: [
      "users.id",
      "users.created_at",
      "users.name",
      "users.nickname",
      "users.phone",
      "users.role",
    ],
    virtual: [],
    joins: [],
    loaders: [],
  },
  SS: {
    select: [
      "users.id",
      "users.name",
      "users.nickname",
      "users.phone",
      "users.role",
    ],
    virtual: [],
    joins: [],
    loaders: [],
  },
};
