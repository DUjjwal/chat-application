import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { messageAtom, roomAtom, usernameAtom } from "../atoms/atoms";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom"
import axios from "axios"



function Chat() {
    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const navigate = useNavigate()
    

    const ref = useRef<HTMLDivElement | null>(null)

    const [room, setRoom] = useRecoilState(roomAtom)
    const [username, setUsername] = useRecoilState(usernameAtom)
    const [ buttonTxt, setButtonTxt] = useState(`Room ID:${room}`);
    const [ messages, setMessages ] = useRecoilState(messageAtom)

    const [text, setText] = useState("")

    const [flag, setFlag] = useState(false)
    
    
    useEffect(() => {
        const roomVal = sessionStorage.getItem("ROOM")
        const userVal = sessionStorage.getItem("USER")
        if(!userVal || !roomVal) {
            setFlag(true)
            return;
        }

        setRoom(roomVal)
        setButtonTxt(`Room ID:${roomVal}`)
        setUsername(userVal)

        const msg = sessionStorage.getItem("MESSAGES")
        setMessages(msg==null?[]:JSON.parse(msg))
    }, [])


    useEffect(() => {

        
        if(!room || !username)return;

        socketRef.current = io("https://ujjwalcheck-bxdheaa4b3beg5ed.centralindia-01.azurewebsites.net/")
        socketRef.current.on("connect", () => {
            console.log("connected")
            socketRef.current?.emit("join-room", {
                userName: username,
                roomID: room
            })
        })

        socketRef.current.on(room ?? "", (msg: {
            userName: string,
            roomID: string,
            alert: boolean,
            text: string,
            date: string
        }) => {
            msg.date = new Date().toLocaleString('en-US',{hour: '2-digit', minute:'2-digit'})
            setMessages(prev => {
                const updatedMessages = [...(prev ?? []), msg]
                sessionStorage.setItem("MESSAGES", JSON.stringify(updatedMessages))
                return updatedMessages
            })
        })

        


        return () => {
            // socketRef.current?.off(room, () => {})
            const deleteRequest = async () => {
                await axios.delete(`${import.meta.env.VITE_URL}/delete`, {
                   data: {
                    userName: username
                   }
                })
            }
            deleteRequest()
        }

    }, [room, username])
    
    useEffect(() => {
        const handleUnload = () => {
            socketRef.current?.off(room ?? "", () => {})
            fetch("https://ujjwalcheck-bxdheaa4b3beg5ed.centralindia-01.azurewebsites.net/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: username
                }),
                keepalive: true
            })
        }

        window.addEventListener("beforeunload", handleUnload)

        return () => {
            window.removeEventListener("beforeunload", handleUnload)
        }
    }, [username])
    
    useEffect(() => {
        if(ref.current)
        ref.current.scrollTop = ref.current.scrollHeight
    }, [messages])



    if(flag) {
        setTimeout(() => {
            navigate("/user")
        }, 2000)
        return (
            <div>Username and room not found redirecting to main page...</div>
        )
    }

    return (
        <>
        <div className="sm:mt-4 h-full flex flex-col gap-y-2 w-full items-center pb-5">
            <button className="text-xs w-auto sm:text-base md:text-lg lg:text-xl px-2 py-1 rounded-lg flex justify-center items-center sm:fixed sm:top-1 sm:left-1 mb-3 text-gray-500 shadow " onMouseEnter={() => setButtonTxt("Copy")} onMouseLeave={() => setButtonTxt(`Room ID:${room}`)} onClick={() => {
                navigator.clipboard.writeText(room ?? "")
                setButtonTxt("Copied")
            }}>{buttonTxt}</button>
            <div className="scroll-smooth w-[100%] h-[90%] text-xl overflow-y-scroll flex flex-col gap-y-2" ref={ref}>
                {messages?.map((msg) => (
                    <Message title={msg.text} user={msg.userName} alert={msg.alert} myuser={username ?? ""} date={msg.date} />
                ))}
                {/* <Message title="hello" user="abc" alert="true" myuser={username}/>
                <Message title="helloawd awda wd awda wd awd a" user="abc" myuser="abc" date="12:44"/>
                <Message title="helloaw daw daw daw da d awd" user="aabc" myuser="abc"/> */}
                    
            </div>  
            <div className="h-[10%] outline outline-blue-900 rounded-xl shadow flex w-[100%]">
                <input type="text" placeholder="Type a message" className='text-base md:text-lg xl:text-xl outline-gray-500 rounded-xl w-[100%] active:outline outline-white p-2' onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                    if(e.key === "Enter" && text!=="") {
                        socketRef.current?.emit("room-message", {
                            userName: username,
                            roomID: room,
                            text: text
                        })
                        setText("")
                    }
                }} value={text}/>
                <button className="flex justify-center items-center text-sm md:text-xl xl:text-xl w-[10%] bg-blue-500 rounded-r-xl text-white p-2 flex justify-center" onClick={() => {
                    if(text==="")return;
                    socketRef.current?.emit("room-message", {
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
    alert: boolean,
    date: string
}) {
  const user = obj.user.charAt(0).toUpperCase() + obj.user.slice(1)
  const myuser = obj.myuser.charAt(0).toUpperCase() + obj.myuser.slice(1)
  if(obj.alert) {
    return (
        <div className='bg-blue-500 text-white w-fit max-w-[50%] rounded-xl px-2 py-1 sm:px-3 s:py-2 m-x-2 self-center'>
            <div className="text-center text-base md:text-lg xl:text-xl">{obj.title}</div>
        </div>
    )
  }
  else if(user === myuser) {
    return (
        <div className='bg-blue-500 text-white w-fit max-w-[50%] rounded-xl px-2 py-1 sm:px-3 s:py-2 m-x-2 self-end'>
        <div className="text-base/6 md:text-lg/6 xl:text-xl/6">{obj.title}</div>
        <div className="text-xs text-right">{obj.date}</div>
        </div>
    )
  }
  else {
    return (
        <div className='bg-blue-500 text-white w-fit max-w-[50%] rounded-xl px-2 py-1 sm:px-3 s:py-2 m-x-2 self-start'>
        <div className="text-base md:text-lg xl:text-xltext-left underline">{user}</div>
        <div className="text-base/6 md:text-lg/6 xl:text-xl/6">{obj.title}</div>
        <div className="text-xs text-right">{obj.date}</div>
        
        </div>
    )
  }
  
}

export default Chat