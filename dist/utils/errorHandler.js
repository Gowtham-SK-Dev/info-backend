"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("❌ Unhandled error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Internal Server Error" : message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
