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
const port = process.env.PORT || 5000

// Security
app.use(helmet())
app.use(morgan('tiny'))

// Body parsers
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// CORS - Frontend Vite ports + Vercel + Render
app.use(cors({
  origin: [
    /^https?:\/\/localhost(:\d+)?$/,
    'https://therecipebook-liard.vercel.app',
    'https://therecipebook-4uw5.onrender.com'
  ],
  credentials: true
}));

// Routes
setupSwagger(app)
router(app)

// Health check
app.get('/', (req, res) => {
  res.json({success: true, message: 'Backend Connected Successfully'})
})

// Error handler
app.use(handleErrors)

// DB
connectToDB()

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

export default server
