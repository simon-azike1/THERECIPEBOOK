import { BAD_REQUEST, SUCCESS, VALIDATION_ERROR, NOT_FOUND, UNAUTHORIZED } from '../../constants/statusCode.js'
import { User } from '../../schema/Users/authSchema.js'
import { messageHandler, passwordValidator, hashPassword, verifyPassword, generateToken, sendEmail, verifyToken } from '../../utils/index.js'


export const registerService = async ({data}, callback) => {
  const { name, email, password, confirmPassword } = data;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return callback(messageHandler("Email already exists", false, BAD_REQUEST, {}));
    }

    // Validate password
    if (!passwordValidator(password)) {
      return callback(messageHandler(
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol (@#$%^&*!), and have a minimum length of 8 characters",
        false,
        VALIDATION_ERROR,
        {}
      ));
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return callback(messageHandler("Passwords do not match", false, VALIDATION_ERROR, {}));
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email, 
      password: hashedPassword
    });

    // Generate email verification token and URL
    const confirmationToken = await generateToken(
      { id: newUser._id, email: newUser.email },
      '1d'
    );
    const verificationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;

    // Send verification email
    await sendEmail(
      newUser.email,
      'Verify Your Email',
      'Please confirm your email address',
      'emailConfirmation',
      {
        username: newUser.name,
        verificationUrl
      }
    );

    // Save user
    const savedUser = await newUser.save();
    return callback(messageHandler("User registered successfully, a verification link has been sent to your email", true, SUCCESS, savedUser));

  } catch (error) {
    return callback(messageHandler("Failed to register user", false, BAD_REQUEST, {}));
  }
}


export const loginService = async ({data}, callback) => {
  try {
    const {email, password} = data;

    const user = await User.findOne({email});
    
    if (!user) {
      return callback(messageHandler("User not found!", false, NOT_FOUND));
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return callback(messageHandler("Invalid password", false, BAD_REQUEST));
    }

    if (!user.isVerified) {
      return callback(messageHandler("Please confirm your email. A confirmation link has been sent", true, SUCCESS));
    }

    const token = generateToken({id: user._id, email: user.email});
    return callback(messageHandler("User logged in successfully", true, SUCCESS, {user, token}));

  } catch (error) {
    return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, {}));
  }
}


export const verifyEmailService = async ({ token }, callback) => {
  if (!token) {
    return callback(messageHandler('Token is required', false, BAD_REQUEST))
  }

  const tokenVerification = verifyToken(token)

  const { decoded } = tokenVerification
  const user = await User.findOne({ email: decoded.email })

    if (!user) {
      return callback(messageHandler('Invalid token', false, UNAUTHORIZED))
    }

    user.isVerified = true
    await user.save()

    return callback(messageHandler('Email verified successfully', true, SUCCESS))   
}

export const forgotPasswordService = async ({email}, callback) => {
  try {
    const user = await User.findOne({email})
    if(!user){
      return callback(messageHandler('User not found', false, NOT_FOUND))
    }

    const resetToken = await generateToken({id: user._id, email: user.email}, '1h')
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await sendEmail(
      user.email,
      'Reset Password',
      'Please reset your password',
      'passwordReset',
      {
        username: user.name,
        resetUrl
      }
    )

    return callback(messageHandler('Password reset email sent', true, SUCCESS))
  } catch (error) {
    return callback(messageHandler('Failed to send password reset email', false, BAD_REQUEST))
  }
}

export const resetPasswordService = async ({token, password}, callback) => {
  try {
    const tokenVerification = verifyToken(token)
    const { decoded } = tokenVerification
    const user = await User.findOne({email: decoded.email})

    if(!user){
      return callback(messageHandler('Invalid token', false, UNAUTHORIZED))
    }
    
    user.password = await hashPassword(password)
    await user.save()

    return callback(messageHandler('Password reset successfully', true, SUCCESS))
  } catch (error) {
    return callback(messageHandler('Failed to reset password', false, BAD_REQUEST))
  }
}

export const logoutService = async ({data}, callback) => {
  try {
    const {user} = data
    user.tokens = user.tokens.filter(token => token !== data.token)
    await user.save()

    return callback(messageHandler('Logged out successfully', true, SUCCESS))
  } catch (error) {
    return callback(messageHandler('Failed to logout', false, BAD_REQUEST))
  }
}
