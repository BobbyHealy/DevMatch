import {useState, useEffect} from "react";
import { db,storage } from "@/config/firebase";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

export default function ChatInput({DMID, receiver}) {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const { user, userInfo} = useAuth();

    const handleKey = e=>{
      if(receiver)
      {
        e.code ==="Enter" &&handleSend(); 
      }

    }
    
    const handleSend = async () => {
      
      if(receiver){
        console.log(DMID)
        const msgID = uuid();
        if (img) 
        {
          const storageRef = ref(storage, userInfo.name+"DM"+msgID);
          uploadBytes(storageRef, img).then (()=>
          {
            getDownloadURL(storageRef).then(async (downloadURL) => 
            {
              await updateDoc(doc(db, "chats", DMID), 
              {
                messages: arrayUnion(
                {
                  id: msgID,
                  text: text.trim(),
                  senderId: user.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          })
          await updateDoc(doc(db, "userChats", user.uid), {
            [DMID + ".lastMessage"]: {
              text: text.trim(),
              img: true,
            },
            [DMID + ".date"]: serverTimestamp(),
          });
      
          await updateDoc(doc(db, "userChats", receiver.uid), {
            [DMID+ ".lastMessage"]: {
              text: text.trim(),
              img: true,
            },
            [DMID+ ".date"]: serverTimestamp(),
          });
        } else if (text.trim())
        {
          await updateDoc(doc(db, "chats", DMID), 
          {
            messages: arrayUnion(
            {
              id: msgID,
              text: text.trim(),
              senderId: user.uid,
              date: Timestamp.now(),
            }),
          });
          await updateDoc(doc(db, "userChats", user.uid), {
            [DMID + ".lastMessage"]: {
              text: text.trim(),
            },
            [DMID + ".date"]: serverTimestamp(),
          });
      
          await updateDoc(doc(db, "userChats", receiver.uid), {
            [DMID+ ".lastMessage"]: {
              text: text.trim(),
            },
            [DMID+ ".date"]: serverTimestamp(),
          });
        } }
        else{
          console.log("no receiver")
        }
        setText("");
        setImg(null);
      };
    return (
        <div className='h-12 bg-zinc-600  rounded-lg p-2 flex items-center justify-between'>
            {receiver&&<input type="text" placeholder='input'  onChange={(e) => setText(e.target.value)}  value={text}    onKeyDown={handleKey} className='bg-transparent textblack text-lg rounded-lg border-none outline-none placeholder-gray-400 w-[calc(100%-120px)]' />}
            {!receiver&&<input type="text" placeholder='Please Select a Receiver' className='w-full bg-transparent text-gray-600 text-lg border-none outline-none placeholder-gray-400' />}
            <div className='flex items-center gap-2'>
                {/* <img className='h-6 cursor-pointer' src={'https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/file.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'}/> */}
                {/* attach icon */}
                <input type="file" style={{display:"none"}} id="file" onChange={(e) => setImg(e.target.files[0])} />
                <label htmlFor='file'>
                    <img className='h-6 w-[calc(36px)] cursor-pointer' src={'https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/img.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'}/>
                    {/* image icon*/}
                </label>
                <button className='border-none text-black rounded-lg bg-zinc-700 cursor-pointer px-4 py-2'
                onClick={handleSend}
                > Send</button>
            </div>

        </div>
    )
}
   