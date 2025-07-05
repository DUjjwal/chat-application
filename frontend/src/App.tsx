import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import  User  from "../components/User.tsx"
import Header from "../components/Header.tsx"
import Button2 from "../components/Button.tsx"
import Room from "../components/Room.tsx"
import Chat from "../components/Chat.tsx"

function App() {

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-y-4 p-2 overflow-hidden'>
      <Header/>
      <div className="w-full h-[90%] flex flex-col items-center">
        <BrowserRouter>
        
          <Routes>
            
            <Route path="/user" element={<User />} />
            <Route path="/button" element={<Button2 />} />
            <Route path="/room" element={<Room />} />
            <Route path="/chat" element={<Chat id="room-id"/>} />
            
          </Routes>
          
        </BrowserRouter>  
      </div>
      
    </div>
    
  )
}


export default App
