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

// Post - WriteParams
export const PostWriteParams = PostSaveParams.pick({
  id: true,
  title: true,
  content: true,
  name: true,
  file_url: true,
}).partial({
  file_url: true,
});
export type PostWriteParams = z.infer<typeof PostWriteParams>;
