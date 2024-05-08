import { z } from "zod";
import { NotiBaseSchema, NotiBaseListParams } from "../sonamu.generated";

// Noti - ListParams
export const NotiListParams = NotiBaseListParams;
export type NotiListParams = z.infer<typeof NotiListParams>;

// Noti - SaveParams
export const NotiSaveParams = NotiBaseSchema.partial({
  id: true,
  created_at: true,
});
export type NotiSaveParams = z.infer<typeof NotiSaveParams>;
