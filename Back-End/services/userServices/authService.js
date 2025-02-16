import { BAD_REQUEST, SUCCESS, VALIDATION_ERROR, NOT_FOUND, UNAUTHORIZED } from '../../constants/statusCode.js'
import { Auth } from '../../schema/userSchemas/authSchema.js'
import { messageHandler, passwordValidator, hashPassword, verifyPassword, generateToken, sendEmail, verifyToken } from '../../utils/index.js'


export const  registerService = async ({data}, callback) => {
    let { name, email, password, confirmPassword } = data

    Auth.findOne({ email }).exec( async (err, user) => {
      if(user){
        return callback(messageHandler("Email already exists", false, BAD_REQUEST, {}))
      }
      else {
       if(!passwordValidator(password)){
        return callback(messageHandler("Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol (@#$%^&*!), and have a minimum length of 8 characters", false, VALIDATION_ERROR, {} ))
       }

       if(password !== confirmPassword){
        return callback(messageHandler("Passwords do not match", false, VALIDATION_ERROR, {}))
       }
    
       if(password) {
        const hashedPassword = await hashPassword(password)
        const user = new Auth({
          name,
          email,
          password: hashedPassword
        }) 
        return await user.save((err, user) => {
          if(err){
            return callback(messageHandler("Failed to register", false, BAD_REQUEST, {}))
          }
          else {
            return callback(messageHandler("User registered successfully", true, SUCCESS, user))
          }
        })
       }
       else {
        return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, err))
       }
  }
})
}


export const loginService = ({data}, callback) => {
  let {email, password} = data

  Auth.findOne({email}).exec( async ( err, user) => {

      if(err){
          return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, {}))
      }
      if(!user){
        return callback(messageHandler("User not found!", false, NOT_FOUND))
      }
      const isPasswordValid = await verifyPassword(password, user.password)

      if(isPasswordValid){
        if(!user.isVerified) {
          const confirmationToken = await generateToken({id: user._id, email: user.email}, '1d')
          const verificationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`

          const subject = 'Verify Your Email'
          const text = 'Please comfirm your email address'
          const template = 'emailConfirmation' 
          const context = {
            username: user.name,
            verificationUrl: verificationUrl    
          } 
          
          await sendEmail(
            user.email,
            subject,
            text,
            template,
            context            
          )
          
          return callback(messageHandler("Please confirm your email. A confirmation link has been sent", true, SUCCESS))
        }
        const token = generateToken({id: user._id, email: user.email})
        return callback(messageHandler("User logged in successfully", true, SUCCESS, {user, token}))
      }
      else {
      return callback(messageHandler("Invalid password", false, BAD_REQUEST))
    }
 })
}


export const verifyEmailService = async ({ token }, callback) => {
  if (!token) {
    return callback(messageHandler('Token is required', false, BAD_REQUEST))
  }

  const tokenVerification = verifyToken(token)

  const { decoded } = tokenVerification
  const user = await Auth.findOne({ email: decoded.email })

    if (!user) {
      return callback(messageHandler('Invalid token', false, UNAUTHORIZED))
    }

    if (user.isVerified) {
      return callback(messageHandler('User is already verified', false, BAD_REQUEST))
    }

    user.isVerified = true
    await user.save()

    return callback(messageHandler('Email verified successfully', true, SUCCESS))   
}



