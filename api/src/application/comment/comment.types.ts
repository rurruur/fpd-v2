import { z } from "zod";
import { CommentBaseSchema, CommentBaseListParams } from "../sonamu.generated";

// Comment - ListParams
export const CommentListParams = CommentBaseListParams;
export type CommentListParams = z.infer<typeof CommentListParams>;

// Comment - SaveParams
export const CommentSaveParams = CommentBaseSchema.partial({
  id: true,
  created_at: true,
});
export type CommentSaveParams = z.infer<typeof CommentSaveParams>;
