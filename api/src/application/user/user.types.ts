import { z } from "zod";
import { UserBaseSchema, UserBaseListParams } from "../sonamu.generated";
import { zArrayable } from "sonamu";

// User - ListParams
export const UserListParams = UserBaseListParams.extend({
  phone: zArrayable(z.string()).optional(),
  name: zArrayable(z.string()).optional(),
  nickname: zArrayable(z.string()).optional(),
});
export type UserListParams = z.infer<typeof UserListParams>;

// User - SaveParams
export const UserSaveParams = UserBaseSchema.partial({
  id: true,
  created_at: true,
});
export type UserSaveParams = z.infer<typeof UserSaveParams>;

// User - JoinParams
export const UserJoinParams = UserBaseSchema.pick({
  name: true,
  nickname: true,
  phone: true,
  password: true,
});
export type UserJoinParams = z.infer<typeof UserJoinParams>;

// User - LoginParams
export const UserLoginParams = UserBaseSchema.pick({
  phone: true,
  password: true,
});
export type UserLoginParams = z.infer<typeof UserLoginParams>;
