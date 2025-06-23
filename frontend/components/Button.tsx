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
        <div className="flex flex-col justify-center items-center w-[30%] h-auto">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-xl w-[50%]" onClick={async () => {
                const res = await axios.get("http://localhost:8000/roomID")
                const id = res.data.roomID
                setRoom(id)
                const res2 = await axios.post("http://localhost:8000/add", {
                    userName: username,
                    roomID: id
                })
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
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-xl w-[50%]" onClick={() => {
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