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
        <div className="flex flex-col justify-center items-center w-[30%] h-auto">
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
                        navigate("/button")
                    }
                }
            }}/>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-xl w-[50%]" onClick={async () => {
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