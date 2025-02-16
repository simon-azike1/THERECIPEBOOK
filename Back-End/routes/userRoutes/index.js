import express from 'express'
import { loginController, registerController, verifyEmailController } from '../../controllers/userController/authControllers.js'
import { upload } from '../../utils/index.js'
import { verify } from '../../middlewares/auth-middleware.js'
const userRouter = express.Router()


userRouter.post('/register', upload.single('profilePics'), registerController)
userRouter.post('/login', loginController)
userRouter.get('/verify-email', verifyEmailController) 



export default userRouter