import React, {useEffect,useState} from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,onSnapshot} from "firebase/firestore";
import { db } from "@/config/firebase";
import Navbar from "./Navbar";

export default function DMs() {
  const { user, userInfo} = useAuth();
  const [receiver, setReceiver] = useState(null);
  const [DMID, setDMID] = useState()
  useEffect(() => {
    updateDoc(doc(db, "users", user.uid), {
      currentPage:"DMs"
    })
  }, [user.uid])

  useEffect( () => {
    const getChat = () => {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if(doc.data().currentChat)
        {
          setReceiver(doc.data().currentChat);
        }
     
      });

      return () => {
        unsub();
      };
    };
    user.uid && getChat()
  }, [user.uid]);
  useEffect(() => {
    if (receiver)
    {
      const dmID =  user.uid > receiver.uid
      ? user.uid + receiver.uid
      : receiver.uid + user.uid;
    setDMID(dmID);
    }
  }, [receiver]);


  return (
    <div className=' h-[calc(100vh)] bg-zinc-700'>
          <div className='flex h-12  justify-between border-b border-black'>
              <div className='basis-1/5 bg-gray-700 ' >
                <span className='flex p-2 gap-2'>                
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='p-1 trancate'>{userInfo.name}</span>
                </span>
              </div>
              <div className='basis-4/5 bg-zinc-700 '>
              <span className=' flex p-2 gap-2 '>
                {!receiver&&<span className="p-1">Receiver</span>}
                {/* <img src= {receiver?.photoURL} className='bg-white h-8 w-8 rounded-full '/> */}
                <span className="p-1">@ {receiver?.displayName}</span>
                </span>
              </div>
          </div>
          <div>
        <div className='flex'>
          <div className=' h-[calc(100vh-48px)] flex-1  bg-gray-700 basis-1/5 overflow-hidden'>
          <Sidebar/>
          </div>
          <div className="flex-2  basis-4/5">
          <Chat receiver={receiver} DMID={DMID}/>
          </div>
        
        </div>
        
      </div>
    </div>

  );
}
