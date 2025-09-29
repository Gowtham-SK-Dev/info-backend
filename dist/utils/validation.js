"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContactForm = void 0;
const zod_1 = require("zod");
const contactFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    email: zod_1.z.string().email("Please enter a valid email address").max(255, "Email too long"),
    subject: zod_1.z.string().min(1, "Please select a subject").max(200, "Subject too long"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});
const validateContactForm = (req, res, next) => {
    try {
        const validatedData = contactFormSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                errors: err.format(),
            });
            return;
        }
        else if (err instanceof Error) {
            res.status(500).json({
                success: false,
                errors: [{ message: err.message }],
            });
            return;
        }
        else {
            res.status(500).json({
                success: false,
                errors: [{ message: "Unknown validation error" }],
            });
            return;
        }
    }
};
exports.validateContactForm = validateContactForm;
