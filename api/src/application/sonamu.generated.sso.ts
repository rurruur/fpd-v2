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
      select: [
        "comments.id",
        "comments.created_at",
        "comments.name",
        "comments.content",
        "user.id as user__id",
        "user.name as user__name",
        "user.phone as user__phone",
      ],
      virtual: [],
      joins: [
        {
          as: "user",
          join: "inner",
          table: "users",
          from: "comments.user_id",
          to: "user.id",
        },
      ],
      loaders: [],
    },
    P: {
      select: [
        "comments.id",
        "comments.created_at",
        "comments.name",
        "comments.content",
        "comments.user_id",
      ],
      virtual: [],
      joins: [],
      loaders: [],
    },
  };

// SubsetQuery: Post
export const postSubsetQueries: { [key in PostSubsetKey]: SubsetQuery } = {
  A: {
    select: [
      "posts.id",
      "posts.created_at",
      "posts.title",
      "posts.content",
      "posts.name",
      "posts.file_url",
      "posts.user_id",
    ],
    virtual: [],
    joins: [],
    loaders: [],
  },
  P: {
    select: [
      "posts.id",
      "posts.created_at",
      "posts.title",
      "posts.content",
      "posts.name",
      "posts.file_url",
      "posts.views",
      "posts.user_id",
    ],
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
