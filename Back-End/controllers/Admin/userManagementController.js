import { 
  getAllUsersService, 
  getUserByIdService, 
  deleteUserService, 
  updateUserService,
  approveUserService
} from '../../services/Admin/userManagementService.js'

export const getAllUsersController = async (req, res) => {
  const result = await getAllUsersService()
  return res.status(result.statusCode).json({ result })
}

export const getUserByIdController = async (req, res) => {
  const { userId } = req.params
  const result = await getUserByIdService({ userId })
  return res.status(result.statusCode).json({ result })
}

export const deleteUserController = async (req, res) => {
  const { userId } = req.params
  const result = await deleteUserService({ userId })
  return res.status(result.statusCode).json({ result })
}

export const updateUserController = async (req, res) => {
  const { userId } = req.params
  const result = await updateUserService({ userId, data: req.body })
  return res.status(result.statusCode).json({ result })
}

// Add new controller for user approval
export const approveUserController = async (req, res) => {
  const { userId } = req.params
  const result = await approveUserService({ userId })
  return res.status(result.statusCode).json({ result })
} 