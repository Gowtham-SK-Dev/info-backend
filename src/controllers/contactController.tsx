import type { Request, Response } from "express"
import nodemailer from "nodemailer"
import type { ContactFormData } from "../types"

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

const sendContactEmails = async (formData: ContactFormData) => {
  const transporter = createEmailTransporter()

  // Business notification email
  const businessEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.BUSINESS_EMAIL,
    subject: `New Contact Form Submission: ${formData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${formData.subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 5px;">
              <p style="margin: 0; line-height: 1.6;">${formData.message}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This email was sent from your website contact form on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `,
  }

  // Customer auto-reply email
  const customerEmail = {
    from: process.env.EMAIL_USER,
    to: formData.email,
    subject: `Thank you for contacting us, ${formData.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #007bff; text-align: center; margin-bottom: 20px;">Thank You for Your Message!</h2>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">Dear ${formData.name},</p>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Thank you for reaching out to us! We have received your message regarding "<strong>${formData.subject}</strong>" 
            and appreciate you taking the time to contact us.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Your Message Summary:</h3>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${formData.subject}</p>
            <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Our team will review your inquiry and get back to you within 24-48 hours. If your matter is urgent, 
            please don't hesitate to call us directly.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
              <p style="margin: 0; font-weight: bold;">Need immediate assistance?</p>
              <p style="margin: 5px 0 0 0;">Contact us directly at ${process.env.BUSINESS_EMAIL}</p>
            </div>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            Best regards,<br>
            <strong>The Support Team</strong>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center;">
            <p>This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `,
  }

  // Send both emails concurrently
  await Promise.all([transporter.sendMail(businessEmail), transporter.sendMail(customerEmail)])
}

export const contactController = async (req: Request, res: Response): Promise<void> => {
  console.log("[v0] Contact controller called")
  console.log("[v0] Request body:", req.body)

  try {
    const { name, email, subject, message } = req.body as ContactFormData

    console.log("[v0] Processing contact form for:", email)

    await sendContactEmails({ name, email, subject, message })

    console.log("[v0] Emails sent successfully")

    res.status(200).json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: {
        name,
        email,
        subject,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Email sending failed:", error)

    // Log the contact form submission even if email fails
    console.log("📝 Contact form submission (email failed):", {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      timestamp: new Date().toISOString(),
    })

    res.status(500).json({
      success: false,
      message: "Thank you for your message. We've received it and will get back to you soon.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
