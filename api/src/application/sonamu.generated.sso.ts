import { SubsetQuery } from "sonamu";
import {
  CommentSubsetKey,
  PostSubsetKey,
  UserSubsetKey,
} from "./sonamu.generated";

// SubsetQuery: Comment
export const commentSubsetQueries: { [key in CommentSubsetKey]: SubsetQuery } =
  {
    A: {
      select: ["comments.id", "comments.created_at"],
      virtual: [],
      joins: [],
      loaders: [],
    },
  };

// SubsetQuery: Post
export const postSubsetQueries: { [key in PostSubsetKey]: SubsetQuery } = {
  A: {
    select: ["posts.id", "posts.created_at"],
    virtual: [],
    joins: [],
    loaders: [],
  },
};

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
