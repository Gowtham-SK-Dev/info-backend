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
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Invalid request data",
            });
        }
    }
};
exports.validateContactForm = validateContactForm;
