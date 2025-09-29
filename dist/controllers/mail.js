"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const createEmailTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || "mail.infosensetechnologies.com",
        port: Number.parseInt(process.env.SMTP_PORT || "465"),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER || "support@infosensetechnologies.com",
            pass: process.env.EMAIL_PASS || "Supp0rt!nfosense",
        },
    });
};
const sendContactEmails = async (formData) => {
    const transporter = createEmailTransporter();
    const businessEmailOptions = {
        from: process.env.EMAIL_USER || "support@infosensetechnologies.com",
        to: process.env.BUSINESS_EMAIL || "gowtham@infosensetechnologies.com",
        subject: `New Contact Form Submission: ${formData.subject}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #555;">${formData.message.replace(/\n/g, "<br>")}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This email was sent from the contact form on your website.
            Please reply directly to ${formData.email} to respond to this inquiry.
          </p>
        </div>
      </div>
    `,
    };
    const customerEmailOptions = {
        from: process.env.EMAIL_USER || "support@infosensetechnologies.com",
        to: formData.email,
        subject: "Thank you for contacting Infosense Technologies",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Infosense Technologies</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out!</p>
        </div>
        
        <div style="padding: 30px; background-color: #fff; border: 1px solid #dee2e6; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Dear ${formData.name},
          </p>
          
          <p style="line-height: 1.6; color: #555; margin-bottom: 20px;">
            Thank you for contacting us! We have received your message regarding 
            "<strong>${formData.subject}</strong>" and appreciate you taking the time to reach out.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">What happens next?</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li>Our team will review your inquiry within 2-4 hours during business days</li>
              <li>We'll respond with detailed information or schedule a consultation call</li>
              <li>For urgent matters, feel free to call us directly</li>
            </ul>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Contact Information</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${process.env.BUSINESS_EMAIL || "gowtham@infosensetechnologies.com"}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> +91 (Coming Soon)</p>
            <p style="margin: 5px 0; color: #555;"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 7:00 PM</p>
          </div>
          
          <p style="line-height: 1.6; color: #555;">
            We look forward to discussing your project and helping you achieve your goals!
          </p>
          
          <p style="margin-top: 30px; color: #555;">
            Best regards,<br>
            <strong>The Infosense Technologies Team</strong>
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    };
    await Promise.all([transporter.sendMail(businessEmailOptions), transporter.sendMail(customerEmailOptions)]);
};
const contactController = async (req, res) => {
    try {
        const formData = req.body;
        try {
            await sendContactEmails(formData);
            console.log(`✅ Contact form submission sent successfully: ${formData.name} (${formData.email})`);
            res.json({
                success: true,
                message: "Thank you for your message! We'll get back to you within 2-4 hours during business days.",
            });
        }
        catch (emailError) {
            console.error("❌ Email sending failed:", emailError);
            console.log("📝 Contact form submission (email failed):", {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                timestamp: new Date().toISOString(),
            });
            res.json({
                success: true,
                message: "Thank you for your message! We have received your inquiry and will get back to you soon.",
            });
        }
    }
    catch (error) {
        console.error("❌ Contact form error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};
exports.contactController = contactController;
