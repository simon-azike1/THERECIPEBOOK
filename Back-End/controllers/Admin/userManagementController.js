import { 
  getAllUsersService, 
  getUserByIdService, 
  deleteUserService, 
  updateUserService 
} from '../../services/Admin/userManagementService.js'

export const getAllUsersController = async (req, res) => {
  return await getAllUsersService((result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const getUserByIdController = async (req, res) => {
  const { userId } = req.params
  return await getUserByIdService({ userId }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const deleteUserController = async (req, res) => {
  const { userId } = req.params
  return await deleteUserService({ userId }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const updateUserController = async (req, res) => {
  const { userId } = req.params
  return await updateUserService({ userId, data: req.body }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
} 