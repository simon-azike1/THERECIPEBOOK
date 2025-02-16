import mongoose from "mongoose"
import { config } from "../config/config.js"

export const connectToDB = async () => {
  mongoose
  .connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Connected to the database Successfully.");
  })
  .catch((err) => {
    console.log(err.message)
  })
}

