import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address").max(255, "Email too long"),
  subject: z.string().min(1, "Please select a subject").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});

// Validation middleware
export const validateContactForm = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validatedData = contactFormSchema.parse(req.body);
    req.body = validatedData; // Replace with validated data
    next();
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        errors: err.format(), // use Zod's format() for proper TypeScript typing
      });
      return;
    } else if (err instanceof Error) {
      res.status(500).json({
        success: false,
        errors: [{ message: err.message }],
      });
      return;
    } else {
      res.status(500).json({
        success: false,
        errors: [{ message: "Unknown validation error" }],
      });
      return;
    }
  }
};
