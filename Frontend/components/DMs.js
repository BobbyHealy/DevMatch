import React, {useEffect,useState} from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,onSnapshot} from "firebase/firestore";
import { db } from "@/config/firebase";
import Searchbar from "./Searchbar";
import Chats from "@/components/Chats";
import Navbar from "./Navbar";

export default function DMs() {
  const { user, userInfo} = useAuth();
  const[search,setSearch]=useState(false)
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
      ? user.uid + "-"+receiver.uid
      : receiver.uid + "-"+user.uid;
    setDMID(dmID);
    }
  }, [receiver]);


  return (

    <div className='h-[calc(100vh-56px)] bg-zinc-700 w-[calc(100vw)] lg:h-[calc(100vh)] lg:w-[calc(100vw-256px)] '>
          <div onClick={()=>setSearch(false)} className='flex h-12 justify-between border-b border-black'>
              <div className='bg-gray-700 w-[calc(246px)]' >
                <span className='flex p-2 gap-2'>                
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='p-1 truncate'>{userInfo.name}</span>
                </span>
              </div>
              <div className='  w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)] bg-zinc-700 '>
              <span className=' flex p-2 gap-2 '>
                {!receiver&&<span className="p-1">Receiver</span>}
                {/* <img src= {receiver?.photoURL} className='bg-white h-8 w-8 rounded-full '/> */}
                <span className="p-1">@ {receiver?.displayName}</span>
                </span>
              </div>
          </div>
          <div>
        <div className='flex'>
          <div className=' h-[calc(100vh-104px)] w-[calc(246px)] lg:h-[calc(100vh-48px)]   bg-gray-700  overflow-hidden'>
            <div className='h-[calc(100vh-246px)] lg:h-[calc(100vh-190px)]'>
            <div onClick={()=>setSearch(true)}>
            <Searchbar search={search}/>
            </div>
            <div className='overflow-y-scroll' onClick={()=>setSearch(false)}>
              <Chats search={search}/>
            </div>
            </div>
          </div>
          <div onClick={()=>setSearch(false)} className="flex-2  w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)]">
          <Chat receiver={receiver} DMID={DMID}/>
          </div>
        
        </div>
        
      </div>

    </div>

  );
}
