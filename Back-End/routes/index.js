import userRouter  from "./userRoutes/index.js" 
import adminRouter from "./adminRoutes/index.js"


const router = (app) => {
  app.use("/api/v1/user", userRouter)
  app.use("/api/v1/admin", adminRouter)
}

export default router