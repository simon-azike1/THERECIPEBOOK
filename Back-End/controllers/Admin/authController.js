import { registerAdminService, loginAdminService } from '../../services/Admin/authService.js'

export const registerAdminController = async (req, res) => {
  return await registerAdminService({ data: req.body }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const loginAdminController = async (req, res) => {
  return await loginAdminService({ data: req.body }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}
