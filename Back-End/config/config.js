import dotenv from 'dotenv'
dotenv.config()

// MongoDB URL
const MONGODB_URL = process.env.MONGODB_URL

const PORT = process.env.PORT ? Number(process.env.PORT) : 1337

export const config = {
    server: {
        port : PORT
    },
    mongodb : {
        url : MONGODB_URL
    }
}