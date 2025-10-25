import express from "express"
import cors from "cors"
import router from "./routes/verifyRoutes.js"
import { connectDB } from "./db/db.js"
import { User } from "./models/User.js"
import { Server } from "socket.io"
import ShortUniqueId from "short-unique-id"
import dotenv from "dotenv/config"

const app = express()

await connectDB()


app.use(express.json())
app.use(cors())

app.use('/verify', router)

app.post('/add' ,async (req, res) => {
    const {userName, roomID} = req.body

    const user = await User.create({
        userName,
        roomID
    })

    if(!user) {
        return res.status(400).json({
            message: "FAIL"
        })
    }

    return res.status(200).json({
        message: "SUCCESS",
        user
    })

})

app.get('/roomID', (req, res) => {
    const uid = new ShortUniqueId({length: 4})
    return res.status(200).json( {
        roomID: uid.rnd()
    })
})

app.get("/", (req, res) => {
    res.status(200).send("hi")
})

app.delete("/delete", async (req, res) => {
    const {userName} = req.body
    await User.deleteOne({userName})
    return res.status(200).send('ok')
})

const PORT = process.env.PORT || 8000
const server = app.listen(process.env.PORT || 8000, ()=> {
    console.log(`Server is listening at port ${PORT}`)
})


const io = new Server(server, {
    cors: {
        origin: "*"
    }
})



//when someone will join room will send userName, roomID
//when someone will send message to room will send userName, roomID, text
//user will always receive userName, roomID, text, alert from server
io.on('connection', (socket) => {
    socket.on("join-room", (obj) => {
        socket.join(obj.roomID)
        io.to(obj.roomID).emit(obj.roomID, {
            userName: obj.userName,
            roomID: obj.roomID,
            alert: true,
            text: `${obj.userName} entered the room`,
            date: new Date().toLocaleString('en-US',{hour: '2-digit', minute:'2-digit'})
        })
    })
    socket.on("room-message", (obj) => {
        io.to(obj.roomID).emit(obj.roomID, {
            userName: obj.userName,
            roomID: obj.roomID,
            alert: false,
            text: obj.text,
            date: new Date().toLocaleString('en-US',{hour: '2-digit', minute:'2-digit'})
        })
    })
})


