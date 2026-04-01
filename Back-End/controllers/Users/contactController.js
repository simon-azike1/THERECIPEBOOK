import nodemailer from 'nodemailer'
import { BAD_REQUEST, SUCCESS } from '../../constants/statusCode.js'

const messageHandler = (message, success, statusCode, data = {}) => ({
  message,
  success,
  statusCode,
  data
})

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(BAD_REQUEST).json(
        messageHandler('All fields are required', false, BAD_REQUEST)
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(BAD_REQUEST).json(
        messageHandler('Please provide a valid email address', false, BAD_REQUEST)
      )
    }

    // Send email to admin
    const adminEmail = 'azikeshinye@gmail.com'
    const emailSubject = `Contact Form: ${subject}`
    const emailText = `
New contact form submission from TheRecipeBook:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `

    // Send email without template (plain text)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }
    })

    const mailOptions = {
      from: {
        name: 'The Recipe Book',
        address: process.env.NODEMAILER_MAIL
      },
      to: adminEmail,
      subject: emailSubject,
      text: emailText
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to:', adminEmail)
    console.log('Message ID:', info.messageId)

    return res.status(SUCCESS).json(
      messageHandler('Message sent successfully', true, SUCCESS)
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(BAD_REQUEST).json(
      messageHandler('Failed to send message. Please try again later.', false, BAD_REQUEST)
    )
  }
}
