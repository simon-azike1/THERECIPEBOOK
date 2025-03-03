import Admin from '../../schema/Admin/authSchema.js'
import { messageHandler, hashPassword, verifyPassword, generateToken, passwordValidator } from '../../utils/index.js'
import { BAD_REQUEST, SUCCESS, UNAUTHORIZED } from '../../constants/statusCode.js'


export const registerAdminService = async ({data}, callback) => {
  const { email, password } = data
  
  Admin.findOne({ email }).exec(async (err, admin) => {
    if(admin) {
      return callback(messageHandler("Email already exists", false, BAD_REQUEST, {}))
    }

    if(!email || !password) {
      return callback(messageHandler("Email and password are required", false, BAD_REQUEST, {}))
    }
    
    const isPasswordValid = passwordValidator(password)

    if(!isPasswordValid) {
      return callback(messageHandler("Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol (@#$%^&*!), and have a minimum length of 8 characters", false, BAD_REQUEST, {}))
    }

    if(password) {
      const hashedPassword = await hashPassword(password)
      const admin = new Admin({
        email,
        password: hashedPassword
      })
      
      return await admin.save((err, admin) => {
        if(err) {
          return callback(messageHandler("Failed to register admin", false, BAD_REQUEST, err))
        }
        return callback(messageHandler("Admin registered successfully", true, SUCCESS, admin))
      })
    }
    return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, err))
  })
}

export const loginAdminService = ({data}, callback) => {
  const { email, password } = data

  Admin.findOne({email}).exec(async (err, admin) => {
    if(err) {
      return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, {}))
    }
    if(!admin) {
      return callback(messageHandler("Admin not found!", false, BAD_REQUEST, {}))
    }

    const isPasswordValid = await verifyPassword(password, admin.password)

    if(isPasswordValid) {
      const token = generateToken({id: admin._id, email: admin.email, role: 'admin'})
      return callback(messageHandler("Admin logged in successfully", true, SUCCESS, {admin, token}))
    }
    return callback(messageHandler("Invalid password", false, UNAUTHORIZED, {}))
  })
}
