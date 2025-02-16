import userRouter  from "./userRoutes/index.js" 


const router = (app) => {
  app.use("/api/v1/user", userRouter)
}

export default router