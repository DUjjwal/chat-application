import { useRecoilState } from "recoil"
import InputBox from "../components/InputBox.tsx"
import { usernameAtom } from "../atoms/atoms.ts"
import type { ChangeEvent } from "react"
import axios from "axios"
import {ToastContainer, Bounce, toast} from "react-toastify";
import { useNavigate } from "react-router";

function User() {
    const [username, setUsername] = useRecoilState(usernameAtom)
    const navigate = useNavigate()
    return (
        <div className="w-[90%] sm:w-[50%] md:w-[40%] lg:w-[30%] flex flex-col justify-center items-center h-auto text-lg md:text-xl xl:text-2xl">
            <InputBox title="What should we call you" onChange={(e:ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value)
            }} onKeyDown={async (e) => {
                if(e.key === "Enter") {
                    const res = await axios.post('http://localhost:8000/verify/user', {
                        userName: username
                    })
                    console.log(res.data.userExist)
                    if(res.data.userExist) {
                        toast.error('Username is already taken', {
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
                        setUsername("");
                    }
                    else {
                        sessionStorage.setItem("USER", username)
                        sessionStorage.removeItem("ROOM")
                        sessionStorage.removeItem("MESSAGES")
                        navigate("/button")
                    }
                }
            }}/>
            <button type="button" className="w-[100%] text-white bg-blue-700 font-medium rounded-lg text-lg md:text-xl xl:text-2xl px-5 py-2.5 me-2 mb-2 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 focus:ring-4 " onClick={async () => {
                const res = await axios.post('http://localhost:8000/verify/user', {
                    userName: username
                })
                
                if(res.data.userExist === true) {
                    toast.error('Username is already taken', {
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
                    setUsername("");
                }
                else {
                    
                    sessionStorage.setItem("USER", username)
                    sessionStorage.removeItem("ROOM")
                    sessionStorage.removeItem("MESSAGES")
                    navigate("/button")
                }
            }}>Enter</button>
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