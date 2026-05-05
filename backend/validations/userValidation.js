import zod from "zod";

export const userSchema = zod.object({
  name: zod.string().min(4, "UserName should be at least 4 characters long"),
  email: zod.string().email("Invalid email address"),
  password: zod
    .string()
    .min(6, "Password should be at least 6 characters long"),
  role: zod.enum(["user", "admin"]).optional(),
});

export const signinSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6),
});
