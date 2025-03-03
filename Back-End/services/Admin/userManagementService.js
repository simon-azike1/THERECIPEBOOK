import { User } from '../../schema/Users/authSchema.js'
import { messageHandler } from '../../utils/index.js'
import { BAD_REQUEST, SUCCESS, NOT_FOUND } from '../../constants/statusCode.js'

// Get all users
export const getAllUsersService = async (callback) => {
  User.find({}).exec((err, users) => {
    if(err) {
      return callback(messageHandler("Failed to fetch users", false, BAD_REQUEST, {}))
    }
    return callback(messageHandler("Users fetched successfully", true, SUCCESS, users))
  })
}

// Get single user
export const getUserByIdService = async ({userId}, callback) => {
  User.findById(userId).exec((err, user) => {
    if(err) {
      return callback(messageHandler("Failed to fetch user", false, BAD_REQUEST, {}))
    }
    if(!user) {
      return callback(messageHandler("User not found", false, NOT_FOUND, {}))
    }
    return callback(messageHandler("User fetched successfully", true, SUCCESS, user))
  })
}

// Delete user
export const deleteUserService = async ({userId}, callback) => {
  User.findByIdAndDelete(userId).exec((err, user) => {
    if(err) {
      return callback(messageHandler("Failed to delete user", false, BAD_REQUEST, {}))
    }
    if(!user) {
      return callback(messageHandler("User not found", false, NOT_FOUND, {}))
    }
    return callback(messageHandler("User deleted successfully", true, SUCCESS, {}))
  })
}

// Update user
export const updateUserService = async ({userId, data}, callback) => {
  const { name, email, isApproved } = data

  User.findById(userId).exec(async (err, user) => {
    if(err) {
      return callback(messageHandler("Failed to update user", false, BAD_REQUEST, {}))
    }
    if(!user) {
      return callback(messageHandler("User not found", false, NOT_FOUND, {}))
    }

    // Check if email is being changed and if it's already taken
    if(email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if(existingUser) {
        return callback(messageHandler("Email already exists", false, BAD_REQUEST, {}))
      }
    }

    // Update fields if provided
    if(name) user.name = name
    if(email) user.email = email
    if(typeof isApproved === 'boolean') user.isApproved = isApproved

    return user.save((err, updatedUser) => {
      if(err) {
        return callback(messageHandler("Failed to save user updates", false, BAD_REQUEST, {}))
      }
      return callback(messageHandler("User updated successfully", true, SUCCESS, updatedUser))
    })
  })
} 