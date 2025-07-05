import { useNavigate } from "react-router"
import axios from "axios"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { roomAtom, usernameAtom } from "../atoms/atoms"
import {ToastContainer, Bounce, toast} from "react-toastify";

function Button() {
    const navigate = useNavigate()
    const setRoom = useSetRecoilState(roomAtom)
    const username = useRecoilValue(usernameAtom)
    return (
        <div className="mt-4 flex flex-col justify-center items-center w-[70%] sm:w-[50%] md:w-[40%] lg:w-[30%] h-auto">
            <button type="button" className="w-[100%] text-white bg-blue-700 font-medium rounded-lg text-lg md:text-xl xl:text-2xl px-5 py-2.5 me-2 mb-2 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 focus:ring-4" onClick={async () => {
                const res = await axios.get("http://localhost:8000/roomID")
                const id = res.data.roomID
                setRoom(id)
                const res2 = await axios.post("http://localhost:8000/add", {
                    userName: username,
                    roomID: id
                })
               
                    sessionStorage.setItem("ROOM", id)
                if(res2.data.message === 'FAIL') {
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
                    navigate("/chat")

                }
            }}>Create Room</button>
            <button type="button" className="w-[100%] text-white bg-blue-700 font-medium rounded-lg text-lg md:text-xl xl:text-2xl px-5 py-2.5 me-2 mb-2 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 focus:ring-4" onClick={() => {
                navigate("/room")
            }}>Join Room</button>
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

export default Button