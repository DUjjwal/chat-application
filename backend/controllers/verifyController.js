import { User } from "../models/User.js"

export const userVerify = async (req, res, next) => {
    const {userName} = req.body
    const user = await User.findOne({userName})
    console.log(user)
    if(user) {
        return res.status(200).json({
            userExist: true
        })
    }
    return res.status(200).json({
        userExist: false
    })
}

export const roomVerify = async (req, res, next) => {
    const {roomID} = req.body
    const user = await User.findOne({roomID})
    if(user) {
        return res.status(200).json({
            roomExist: true
        })
    }
    return res.status(200).json({
        roomExist: false
    })
}