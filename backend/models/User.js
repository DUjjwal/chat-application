import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: true
    },
    roomID: {
        type: String,
        required: true,
        index: true
    }
})

export const User = mongoose.model("User", userSchema)