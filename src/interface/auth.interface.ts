// interface/auth.interface.ts
import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

export interface ILoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export type LoginFormValues = yup.InferType<typeof loginSchema>;

// file: /interface/auth.interface.ts hoặc /interface copy/auth.interface.ts

export const registerSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Za-z]/, "Password must contain letters")
    .matches(/\d/, "Password must contain numbers")
    .required("Password is required"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms")
    .required(),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
