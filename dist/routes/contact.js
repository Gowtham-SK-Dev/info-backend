"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRoutes = void 0;
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
exports.contactRoutes = router;
router.post("/contact", validation_1.validateContactForm, contactController_1.contactController);
