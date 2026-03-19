import { z } from "zod";

// Login Form Schema 
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

// Register Form Schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long"),
});

// Task Form Schema 
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  status: z.enum(["pending", "in-progress", "completed"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});
