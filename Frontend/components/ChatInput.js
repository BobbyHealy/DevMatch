import { useState, useEffect } from "react";
import { storage } from "@/config/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { sendMsgWithImage, sendMsg } from "@/fireStoreBE/DmMsg";

export default function ChatInput({ DMID, receiver }) {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { user, userInfo } = useAuth();

  const handleKey = (e) => {
    if (receiver) {
      e.code === "Enter" && handleSend();
    }
  };

  const handleSend = async () => {
    if (receiver) {
      const msgID = uuid();
      if (img) {
        const storageRef = await ref(storage, userInfo.name + "DM" + msgID);
        console.log(storageRef)
        uploadBytes(storageRef, img).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            sendMsgWithImage(DMID,msgID,user.uid,receiver.uid,text.trim(),downloadURL)
          });
        });
       
      } else if (text.trim()) {
        await sendMsg(DMID,msgID,user.uid,receiver.uid,text.trim())
      }
    } else {
      console.log("no receiver");
    }
    setText("");
    setImg(null);
  };
  return (
    <div className='h-12 bg-zinc-600  rounded-lg p-2 flex items-center justify-between'>
      {receiver && (
        <input
          type='text'
          placeholder='input'
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={handleKey}
          className='bg-transparent text-black text-lg rounded-lg border-none outline-none placeholder-gray-400 w-[calc(100%-120px)]'
        />
      )}
      {!receiver && (
        <input
          type='text'
          placeholder='Please Select a Receiver'
          className='bg-transparent text-gray-600 text-lg border-none outline-none placeholder-gray-400 w-[calc(100%-120px)]'
        />
      )}
      <div className='flex items-center gap-2'>
        <input
          type='file'
          style={{ display: "none" }}
          id='file'
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor='file'>
          <img
            className='h-6 w-[calc(36px)] cursor-pointer'
            src={
              "https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/img.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd"
            }
          />
        </label>
        <button
          className='border-none text-black rounded-lg bg-zinc-700 cursor-pointer px-4 py-2'
          onClick={handleSend}
        >
          {" "}
          Send
        </button>
      </div>
    </div>
  );
}
