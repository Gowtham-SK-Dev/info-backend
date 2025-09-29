import { Router } from "express"
import { contactController } from "../controllers/contactController"
import { validateContactForm } from "../utils/validation"

const router = Router()

// Contact form submission endpoint
router.post("/contact", validateContactForm, contactController)

export { router as contactRoutes }
