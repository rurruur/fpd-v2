import { z } from "zod";
import { zArrayable, SQLDateTimeString, SonamuQueryMode } from "src/services/sonamu.shared";

// Enums: Comment
export const CommentOrderBy = z.enum(["id-desc"]).describe("CommentOrderBy");
export type CommentOrderBy = z.infer<typeof CommentOrderBy>;
export const CommentOrderByLabel = { "id-desc": "ID최신순" };
export const CommentSearchField = z.enum(["id"]).describe("CommentSearchField");
export type CommentSearchField = z.infer<typeof CommentSearchField>;
export const CommentSearchFieldLabel = { id: "ID" };

// Enums: Post
export const PostOrderBy = z.enum(["id-desc"]).describe("PostOrderBy");
export type PostOrderBy = z.infer<typeof PostOrderBy>;
export const PostOrderByLabel = { "id-desc": "ID최신순" };
export const PostSearchField = z.enum(["id"]).describe("PostSearchField");
export type PostSearchField = z.infer<typeof PostSearchField>;
export const PostSearchFieldLabel = { id: "ID" };

// Enums: User
export const UserOrderBy = z.enum(["id-desc"]).describe("UserOrderBy");
export type UserOrderBy = z.infer<typeof UserOrderBy>;
export const UserOrderByLabel = { "id-desc": "ID최신순" };
export const UserSearchField = z.enum(["id"]).describe("UserSearchField");
export type UserSearchField = z.infer<typeof UserSearchField>;
export const UserSearchFieldLabel = { id: "ID" };
export const UserRole = z.enum(["admin", "normal"]).describe("UserRole");
export type UserRole = z.infer<typeof UserRole>;
export const UserRoleLabel = { admin: "관리자", normal: "일반사용자" };

// BaseSchema: Comment
export const CommentBaseSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  post_id: z.number().int(),
  user_id: z.number().int().nullable(),
  name: z.string().max(30),
  content: z.string().max(512),
});
export type CommentBaseSchema = z.infer<typeof CommentBaseSchema>;

// BaseSchema: Post
export const PostBaseSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  title: z.string().max(100),
  content: z.string().max(65535),
  name: z.string().max(30),
  file_url: z.string().max(128).nullable(),
  views: z.number().int().nonnegative(),
  user_id: z.number().int().nullable(),
});
export type PostBaseSchema = z.infer<typeof PostBaseSchema>;

// BaseSchema: User
export const UserBaseSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  name: z.string().max(30),
  nickname: z.string().max(30),
  phone: z.string().max(20),
  password: z.string().max(128),
  role: UserRole,
});
export type UserBaseSchema = z.infer<typeof UserBaseSchema>;

// BaseListParams: Comment
export const CommentBaseListParams = z
  .object({
    num: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    search: CommentSearchField,
    keyword: z.string(),
    orderBy: CommentOrderBy,
    queryMode: SonamuQueryMode,
    id: zArrayable(z.number().int().positive()),
  })
  .partial();
export type CommentBaseListParams = z.infer<typeof CommentBaseListParams>;

// BaseListParams: Post
export const PostBaseListParams = z
  .object({
    num: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    search: PostSearchField,
    keyword: z.string(),
    orderBy: PostOrderBy,
    queryMode: SonamuQueryMode,
    id: zArrayable(z.number().int().positive()),
  })
  .partial();
export type PostBaseListParams = z.infer<typeof PostBaseListParams>;

// BaseListParams: User
export const UserBaseListParams = z
  .object({
    num: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    search: UserSearchField,
    keyword: z.string(),
    orderBy: UserOrderBy,
    queryMode: SonamuQueryMode,
    id: zArrayable(z.number().int().positive()),
  })
  .partial();
export type UserBaseListParams = z.infer<typeof UserBaseListParams>;

// Subsets: Comment
export const CommentSubsetA = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
});
export type CommentSubsetA = z.infer<typeof CommentSubsetA>;
export type CommentSubsetMapping = {
  A: CommentSubsetA;
};
export const CommentSubsetKey = z.enum(["A"]);
export type CommentSubsetKey = z.infer<typeof CommentSubsetKey>;

// Subsets: Post
export const PostSubsetA = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  title: z.string().max(100),
  content: z.string().max(65535),
  name: z.string().max(30),
  file_url: z.string().max(128).nullable(),
  user_id: z.number().int().nonnegative().nullable(),
});
export type PostSubsetA = z.infer<typeof PostSubsetA>;
export type PostSubsetMapping = {
  A: PostSubsetA;
};
export const PostSubsetKey = z.enum(["A"]);
export type PostSubsetKey = z.infer<typeof PostSubsetKey>;

// Subsets: User
export const UserSubsetA = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  name: z.string().max(30),
  nickname: z.string().max(30),
  phone: z.string().max(20),
  role: UserRole,
});
export type UserSubsetA = z.infer<typeof UserSubsetA>;
export const UserSubsetSS = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().max(30),
  nickname: z.string().max(30),
  phone: z.string().max(20),
  role: UserRole,
});
export type UserSubsetSS = z.infer<typeof UserSubsetSS>;
export type UserSubsetMapping = {
  A: UserSubsetA;
  SS: UserSubsetSS;
};
export const UserSubsetKey = z.enum(["A", "SS"]);
export type UserSubsetKey = z.infer<typeof UserSubsetKey>;
