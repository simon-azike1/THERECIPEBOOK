import { User } from '../../schema/Users/authSchema.js'
import { messageHandler } from '../../utils/index.js'
import { BAD_REQUEST, SUCCESS, NOT_FOUND } from '../../constants/statusCode.js'

// Get all users
export const getAllUsersService = async () => {
  try {
    const users = await User.find({})
    return messageHandler("Users fetched successfully", true, SUCCESS, users)
  } catch (error) {
    return messageHandler("Failed to fetch users", false, BAD_REQUEST, {})
  }
}

// Get single user
export const getUserByIdService = async ({userId}) => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      return messageHandler("User not found", false, NOT_FOUND, {})
    }
    return messageHandler("User fetched successfully", true, SUCCESS, user)
  } catch (error) {
    return messageHandler("Failed to fetch user", false, BAD_REQUEST, {})
  }
}

// Delete user
export const deleteUserService = async ({userId}) => {
  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return messageHandler("User not found", false, NOT_FOUND, {})
    }
    return messageHandler("User deleted successfully", true, SUCCESS, {})
  } catch (error) {
    return messageHandler("Failed to delete user", false, BAD_REQUEST, {})
  }
}

// Update user
export const updateUserService = async ({userId, data}) => {
  try {
    const { name, email } = data

    const user = await User.findById(userId)
    if (!user) {
      return messageHandler("User not found", false, NOT_FOUND, {})
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return messageHandler("Email already exists", false, BAD_REQUEST, {})
      }
    }

    // Update fields if provided
    if (name) user.name = name
    if (email) user.email = email

    const updatedUser = await user.save()
    return messageHandler("User updated successfully", true, SUCCESS, updatedUser)
  } catch (error) {
    return messageHandler("Failed to update user", false, BAD_REQUEST, {})
  }
}

// Add new service for user approval
export const approveUserService = async ({userId}) => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      return messageHandler("User not found", false, NOT_FOUND, {})
    }

    user.isApproved = true
    const updatedUser = await user.save()
    return messageHandler("User approved successfully", true, SUCCESS, updatedUser)
  } catch (error) {
    return messageHandler("Failed to approve user", false, BAD_REQUEST, {})
  }
} 