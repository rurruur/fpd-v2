import { z } from "zod";
import { CommentBaseSchema, CommentBaseListParams } from "../sonamu.generated";

// Comment - ListParams
export const CommentListParams = CommentBaseListParams.extend({
  post_id: z.number().int().positive().optional(),
});
export type CommentListParams = z.infer<typeof CommentListParams>;

// Comment - SaveParams
export const CommentSaveParams = CommentBaseSchema.partial({
  id: true,
  created_at: true,
});
export type CommentSaveParams = z.infer<typeof CommentSaveParams>;

// Comment - SaveMineParams
export const CommentSaveMineParams = CommentSaveParams.pick({
  id: true,
  content: true,
  name: true,
  post_id: true,
});
export type CommentSaveMineParams = z.infer<typeof CommentSaveMineParams>;
