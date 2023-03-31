import {useState} from "react";
import { db,storage } from "@/config/firebase";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import Router from "next/router";

export default function GroupChatInput({channel}) {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const { userInfo} = useAuth();
    const {pid} = Router.query;



    const handleKey = e=>{
        e.code ==="Enter" &&handleSend(); 
    }
    
    const handleSend = async () => {
        const msgID = uuid();
        if (img) 
        {
          const storageRef = ref(storage, userInfo.name+pid+msgID);
          uploadBytes(storageRef, img).then (()=>
          {
            getDownloadURL(storageRef).then(async (downloadURL) => 
            {
              await updateDoc(doc(db, "GCs", pid,"channels", channel), 
              {
                messages: arrayUnion(
                {
                  id: msgID,
                  text: text.trim(),
                  sender: userInfo.name,
                  photoURL: userInfo.profilePic,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          })
        } else if (text.trim())
        {
          await updateDoc(doc(db, "GCs", pid,"channels", channel), 
          {
            messages: arrayUnion(
            {
                id: msgID,
                text: text.trim(),
                sender: userInfo.name,
                photoURL: userInfo.profilePic,
                date: Timestamp.now(),
            }),
          });
        }
    
        setText("");
        setImg(null);
      };
    return (
        <div className='h-12  rounded-lg bg-gray-700 p-2 flex items-center justify-between'>
            <input type="text" placeholder='input'  onChange={(e) => setText(e.target.value)}  value={text}    onKeyDown={handleKey} className='w-[calc(100%-120px)] bg-transparent text-gray-200 text-lg border-none outline-none placeholder-gray-400' />
            <div className='flex items-center gap-2'>
                <input type="file" style={{display:"none"}} id="file" onChange={(e) => setImg(e.target.files[0])} />
                <label htmlFor='file'>
                    <img className='h-6 w-10 cursor-pointer' src={'https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/img.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'}/>
                </label>
                <button className='border-none text-white bg-gray-800 cursor-pointer rounded-lg px-4 py-2'
                onClick={handleSend}
                > Send</button>
            </div>

        </div>
    )
}
   