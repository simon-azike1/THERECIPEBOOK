import cloudinaryModule from 'cloudinary'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import multer from 'multer'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// message handler
export const messageHandler = (message, success, statusCode, data) => {
  return { message, success, statusCode, data }
}

// hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}


// verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword) 
}


// generate token
const SECRET_KEY = process.env.JWT_SECRET

export const generateToken = (payload, expiresIn = '1hr') => {
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// verify token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return { success: true, decoded }
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' }
  }
}



// cloudinary setup
export const cloudinary = cloudinaryModule.v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


// multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]
  const fileExtension = path.extname(file.originalname).toLowerCase()

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only (.jpg, .jpeg, .png, and .gif) files are allowed."))
  }
}

export const upload = multer({ 
  storage, 
  fileFilter,
  // limit file size to 5MB
  limits: { fileSize: 1024 * 1024 * 5 } 
})


// phone number validator
const COUNTRY_CODE = "234"

export const passwordValidator = value => {
  const criteria =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/
  // console.log('Password to Validate:', value)
  const isValid = criteria.test(value)
  // console.log('Password Validation Result:', isValid)
  return isValid
}

export const verifyPhoneNumber = (phone) => {
  return /^([0]{1}|\+?234)([7-9]{1})([0|1]{1})([\d]{1})([\d]{7})$/g.test(phone)
}

export const sanitizePhoneNumber = (phone) => {
  if (!verifyPhoneNumber(phone)) {
    return { status: false, message: "Phone number is invalid", phone: "" }
  }
  if (phone.startsWith("0") || phone.startsWith("+")) {
    phone = phone.substring(1);
  }
  if (phone.startsWith(COUNTRY_CODE)) {
    return {
      status: true,
      message: "Phone number is valid",
      phone: "+" + phone,
    };
  }
  return {
    status: true,
    message: "Phone number is valid",
    phone: `+${COUNTRY_CODE}${phone}`,
  }
}


// nodemailer setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })
}

export const sendEmail = async (to, subject, text, template, context) => {
  const transporter = createTransporter()

  const hbsOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.resolve(__dirname, '../modules/views'),
      layoutsDir: path.resolve(__dirname, '../modules/views'),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, '../modules/views'),
    extName: '.handlebars',
  }

  transporter.use('compile', hbs(hbsOptions))

  const mailOptions = {
    from: {
      name: 'Docify App',
      address: process.env.NODEMAILER_MAIL
    },
    to: Array.isArray(to) ? to.join(', ') : to,
    subject: subject,
    text: text,
    template: template,
    context : context
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}