"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const contact_1 = require("./routes/contact");
const errorHandler_1 = require("./utils/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
const corsOrigins = process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000", "http://localhost:5173"];
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
});
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});
app.use("/api", contact_1.contactRoutes);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Contact Form API Server",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            contact: "/api/contact",
        },
    });
});
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.originalUrl,
    });
});
app.use(errorHandler_1.errorHandler);
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    process.exit(0);
});
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📧 Mail service configured for ${process.env.EMAIL_USER}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
