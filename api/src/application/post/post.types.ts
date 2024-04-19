import { z } from "zod";
import { PostBaseSchema, PostBaseListParams } from "../sonamu.generated";

// Post - ListParams
export const PostListParams = PostBaseListParams;
export type PostListParams = z.infer<typeof PostListParams>;

// Post - SaveParams
export const PostSaveParams = PostBaseSchema.partial({
  id: true,
  created_at: true,
});
export type PostSaveParams = z.infer<typeof PostSaveParams>;
