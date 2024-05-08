import { SubsetQuery } from "sonamu";
import {
  CommentSubsetKey,
  NotiSubsetKey,
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
          join: "outer",
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
        "comments.post_id",
        "comments.user_id",
      ],
      virtual: [],
      joins: [],
      loaders: [],
    },
  };

// SubsetQuery: Noti
export const notiSubsetQueries: { [key in NotiSubsetKey]: SubsetQuery } = {
  A: {
    select: ["notis.id", "notis.created_at"],
    virtual: [],
    joins: [],
    loaders: [],
  },
  P: {
    select: [
      "notis.id",
      "notis.created_at",
      "notis.read",
      "notis.content",
      "notis.post_id",
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
    loaders: [
      {
        as: "comments",
        table: "comments",
        manyJoin: {
          fromTable: "posts",
          fromCol: "id",
          idField: "id",
          toTable: "comments",
          toCol: "post_id",
        },
        oneJoins: [],
        select: ["comments.id"],
        loaders: [],
      },
    ],
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
