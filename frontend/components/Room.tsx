import { useRecoilState, useRecoilValue } from "recoil"
import InputBox from "../components/InputBox.tsx"
import { roomAtom, usernameAtom } from "../atoms/atoms.ts"
import { useEffect, useState, type ChangeEvent } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import {ToastContainer, Bounce, toast} from "react-toastify";

function User() {
    const [room, setRoom] = useRecoilState(roomAtom)
    const username= useRecoilValue(usernameAtom)
    const navigate = useNavigate()
    const [flag, setFlag] = useState(false)
    useEffect(() => {
        const user = sessionStorage.getItem("USER")
        if(user === null)
            setFlag(true)
            console.log(user, flag)
    }, [])

    if(flag === true) {
        setTimeout(() => {
            navigate("/user")
        }, 2000)
        return (
            <div className="text-center">Please enter username first Redirecting to main page</div>            
        )
    }
    return (
        <div className="flex flex-col justify-content items-center w-[30%] h-auto">
            <InputBox title="Enter Room ID" onChange={(e: ChangeEvent<HTMLInputElement>) => {setRoom(e.target.value)} } onKeyDown={async (e) => {
                if(e.key === "Enter") {
                    const res = await axios.post(`${import.meta.env.VITE_URL}/add`, {
                        userName: username,
                        roomID: room
                    })
                    if(res.data.message === 'FAIL') {
                        toast.error('Database error try again', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                        });
                    }
                    else {
                        sessionStorage.setItem("ROOM", room ?? "")
                        sessionStorage.removeItem("MESSAGE")
                        navigate("/chat")
                    }
                }
            }}/>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none text-xl w-[50%]" onClick={async () => {
                const res = await axios.post(`${import.meta.env.VITE_URL}/add`, {
                    userName: username,
                    roomID: room
                })
                if(res.data.message === 'FAIL') {
                    toast.error('Database error try again', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    });
                }
                else {
                    sessionStorage.setItem("ROOM", room ?? "")
                        sessionStorage.removeItem("MESSAGE")
                    navigate("/chat")
                }
            }}>JOIN</button>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
            />
        </div>
    )
}

export default User