import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Unhandled error:", err)

  const status = err.status || err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  })
}
