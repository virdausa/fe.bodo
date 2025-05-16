import { z } from "zod";

const signinSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(32, "Username must not exceed 32 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(99, "Password must not exceed 99 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    ),
});

const signupSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters long")
      .max(32, "Username must not exceed 32 characters long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(99, "Password must not exceed 99 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(99, "Password must not exceed 99 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match given password",
    path: ["confirmPassword"],
  });

type User = { username: string };

export type { User };
export { signinSchema, signupSchema };
