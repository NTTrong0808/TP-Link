import { z } from "zod";

export const roleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  roleCode: z.string().optional(),
  totalUsers: z.number().optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  permissionKeys: z.array(z.string()).optional(),
});

export type Role = z.infer<typeof roleSchema>;
