import { z } from "zod";

export const adminSigninSchema = z.object({
  adminId: z.string().min(1, "Admin ID is required"),
  password: z.string().min(1, "Password is required"),
});
