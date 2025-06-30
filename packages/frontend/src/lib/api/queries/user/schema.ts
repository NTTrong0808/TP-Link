import { z } from 'zod';
import { roleSchema } from '../role/schema';
import { USER_STATUS } from './constant';

export const userSchema = z.object({
  _id: z.string(),
  createdAt: z.string(),
  email: z.string(),
  firstName: z.string().default(''),
  updatedAt: z.string(),
  cognitoEnableStatus: z.boolean(),
  cognitoId: z.string(),
  cognitoStatus: z.union([z.literal('CONFIRMED'), z.literal('UNCONFIRMED')]),
  status: z.union([
    z.literal(USER_STATUS.activated),
    z.literal(USER_STATUS.deactivated),
    z.literal(USER_STATUS.noAccount),
    z.literal(USER_STATUS.unActivated),
  ]),
  roleId: z.string().optional(),
  username: z.string(),
  isSuperAdmin: z.boolean().optional(),
  isProvidedNewPassword: z.boolean().default(false),
  searchValue: z.string().default(''),
  lastName: z.string().default(''),
  role: roleSchema,
  phoneNumber: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
