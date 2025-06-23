import mongoose from "mongoose";
import dotenv from "dotenv/config"

export const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(() => {
    console.log(`DB connected Successfully`)
}).catch((err) => {
    console.log(`DB Connection Error`, err)
    process.exit(1)
})
}

