import mongoose from "mongoose"

const { Schema } = mongoose

const authSchema = Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
  },
  email : {
    type: String,
    required: [true, "Please provide your email."],
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide you password"],
    minLength: [6, "Please your password must not be less than 6 chracters."],
  },
  confirmPassword: {
    type: String  
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken : {
    type: String,
  },
   createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

export const Auth= mongoose.model('Auth', authSchema)