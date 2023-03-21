import {useState, useEffect} from "react";
import { db,storage } from "@/config/firebase";
import { v4 as uuid } from "uuid";
import {
  onSnapshot,
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

export default function GroupChatInput() {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);



    const handleKey = e=>{
        e.code ==="Enter" &&handleSend(); 
    }
    
    const handleSend = async () => {

        setText("");
        setImg(null);
      };
    return (
        <div className='h-12 bg-orange-200 p-2 flex items-center justify-between'>
            <input type="text" placeholder='input'  onChange={(e) => setText(e.target.value)}  value={text}    onKeyDown={handleKey} className='w-full bg-transparent text-gray-600 text-lg border-none outline-none placeholder-gray-400' />
            <div className='flex items-center gap-2'>
                {/* <img className='h-6 cursor-pointer' src={'https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/file.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'}/> */}
                {/* attach icon */}
                <input type="file" style={{display:"none"}} id="file" onChange={(e) => setImg(e.target.files[0])} />
                <label htmlFor='file'>
                    <img className='h-6 w-14 cursor-pointer' src={'https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/img.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'}/>
                    {/* image icon*/}
                </label>
                <button className='border-none text-black bg-orange-300 cursor-pointer px-4 py-2'
                onClick={handleSend}
                > Send</button>
            </div>

        </div>
    )
}
   