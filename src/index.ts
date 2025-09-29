import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { contactRoutes } from "./routes/contact"
import { errorHandler } from "./utils/errorHandler"

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(compression())

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000", "http://localhost:5173"]

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  const timestamp = new Date().toISOString()

  res.on("finish", () => {
    const duration = Date.now() - start
    console.log(`[${timestamp}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`)
  })

  next()
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API routes
app.use("/api", contactRoutes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Contact Form API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      contact: "/api/contact",
    },
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  })
})

// Error handling middleware
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📧 Mail service configured for ${process.env.EMAIL_USER}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})
