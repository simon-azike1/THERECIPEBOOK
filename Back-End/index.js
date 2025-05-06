import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectToDB } from './database/db.js'
import { handleErrors } from './middlewares/errorHandler.js'
import router from './routes/index.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { setupSwagger } from './config/swagger.js'

const app = express()
const port = process.env.PORT

// helmet to secure app by setting http response headers
app.use(helmet())
app.use(morgan('tiny'))

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())

// routes
// swagger
setupSwagger(app)
router(app)

// home
app.get('/', (req, res) => {
  res.json({success: true, message: 'Backend Connected Successfully'})
})

// error handler
app.use(handleErrors)

// connect to database
connectToDB()

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})
