import { z } from 'zod';

export const logInValidationSchema = z.object({
  usernameOrEmail: z.union([
    z
      .string()
      .min(2, { message: 'Username must be at least 2 characters long' }),
    z
      .string()
      .min(1, { message: 'E-mail is required' })
      .email({ message: 'E-mail must be a valid e-mail' }),
  ]),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});
export type LogInValidationSchema = z.infer<typeof logInValidationSchema>;

export const registerValidationSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long' }),
  email: z
    .string()
    .min(1, { message: 'E-mail is required' })
    .email({ message: 'E-mail must be a valid e-mail' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});
export type RegisterValidationSchema = z.infer<typeof registerValidationSchema>;

export const resetPasswordStepOneValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail is required' })
    .email({ message: 'E-mail must be a valid e-mail' }),
});
export type ResetPasswordStepOneValidationSchema = z.infer<
  typeof resetPasswordStepOneValidationSchema
>;

export const resetPasswordStepTwoValidationSchema = z.object({
  code: z.string().min(1, { message: 'Verification code is required' }),
});
export type ResetPasswordStepTwoValidationSchema = z.infer<
  typeof resetPasswordStepTwoValidationSchema
>;

export const resetPasswordStepThreeValidationSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    passwordConfirmation: z
      .string()
      .min(1, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match',
  });
export type ResetPasswordStepThreeValidationSchema = z.infer<
  typeof resetPasswordStepThreeValidationSchema
>;
