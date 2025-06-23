import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { messageAtom, roomAtom, usernameAtom } from "../atoms/atoms";
import { io } from "socket.io-client"
import axios from "axios"

let socket = null
function Chat() {
    
    const ref = useRef<HTMLDivElement | null>(null)

    const room = useRecoilValue(roomAtom)
    const username = useRecoilValue(usernameAtom)
    const [ buttonTxt, setButtonTxt] = useState(`Room ID:${room}`);
    const [ messages, setMessages ] = useRecoilState(messageAtom)

    const [text, setText] = useState("")

    useEffect(() => {
        socket = io("http://localhost:8000")
        if(!room || !username )return;
        socket.on("connect", () => {
            console.log("connected")
            socket.emit("join-room", {
                userName: username,
                roomID: room
            })
        })

        socket.on(room, (msg) => {
            console.log(msg)
            setMessages(prev => [...prev, msg])
        })
        return () => {
            socket.off(room, () => {})
            const deleteRequest = async () => {
                await axios.delete("http://localhost:8000/delete", {
                   data: {
                    userName: username
                   }
                })
            }
            deleteRequest()
        }

    }, [])
    
    useEffect(() => {
        if(ref.current)
        ref.current.scrollTop = ref.current.scrollHeight
    }, [messages])
    return (
        <>
        <div className="p-4 h-full flex flex-col gap-y-2 w-full">
            <button className="px-2 py-1 rounded-lg flex justify-center items-center fixed top-1 left-1 mb-3 text-gray-500 shadow " onMouseEnter={() => setButtonTxt("Copy")} onMouseLeave={() => setButtonTxt(`Room ID:${room}`)} onClick={() => {
                navigator.clipboard.writeText(room)
                setButtonTxt("Copied")
            }}>{buttonTxt}</button>
            <div className="scroll-smooth h-[90%] text-xl overflow-y-scroll flex flex-col gap-y-2" ref={ref}>
                {messages.map((msg) => (
                    <Message title={msg.text} user={msg.userName} alert={msg.alert} myuser={username}/>
                ))}
                
            </div>  
            <div className="outline outline-blue-900 rounded-xl text-xl shadow flex">
                <input type="text" placeholder="Type a message" className='outline-gray-500 rounded-xl w-[90%] active:outline outline-white p-2' onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        socket.emit("room-message", {
                            userName: username,
                            roomID: room,
                            text: text
                        })
                        setText("")
                    }
                }} value={text}/>
                <button className="w-[10%] bg-blue-500 rounded-r-xl text-white p-2 flex justify-center" onClick={() => {
                    socket.emit("room-message", {
                        userName: username,
                        roomID: room,
                        text: text
                    })
                    setText("")
                }}>Send</button>
            </div>
        </div>
        </>
        
    )
}

function Message(obj: {
    title: string,
    user: string,
    myuser: string,
    alert: boolean
}) {
  if(obj.alert) {
    return (
        <div className='bg-blue-400 text-white w-fit max-w-[50%] rounded-xl p-3 m-x-2 self-center'>
            <div className="text-xl">{obj.title}</div>
        </div>
    )
  }
  else if(obj.user === obj.myuser) {
    return (
        <div className='bg-blue-400 text-white w-fit max-w-[50%] rounded-xl p-3 m-x-2 self-end'>
        <div className="text-xs text-left">{obj.user}</div>
        <div className="text-xl">{obj.title}</div>
        </div>
    )
  }
  else {
    return (
        <div className='bg-blue-400 text-white w-fit max-w-[50%] rounded-xl p-3 m-x-2 self-start'>
        <div className="text-xs text-left">{obj.user}</div>
        <div className="text-xl">{obj.title}</div>
        </div>
    )
  }
  
}

export default Chat