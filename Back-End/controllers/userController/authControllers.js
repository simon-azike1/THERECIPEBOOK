import { loginService, registerService, verifyEmailService } from '../../services/userServices/authService.js'


export const registerController = async (req, res) => {
   return await registerService({ data: req.body }, (result) => {
    return res.status(result.statusCode).json({ result })
   })
}

export const loginController = async (req, res) => {
  return await loginService({ data : req.body}, (result) => {
    return res.status(result.statusCode).json({ result })
  }) 
}

export const verifyEmailController = async (req, res) => {
  const { token } = req.query
  return await verifyEmailService({ token }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}
