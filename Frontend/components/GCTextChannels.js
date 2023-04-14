import {useState, useEffect}from 'react'
import {
  onSnapshot,
  collection,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "@/config/firebase";
import { addChannel } from '@/fireStoreBE/GCText';
import GCTextChannel from './GCTextChannel';
import { useAuth } from '@/context/AuthContext';

function GCTextChannels({pid, project, channelID, title, edit, setChannel, setTitle, setEdit, setID}) {
    const [expend, setExpend] = useState(false);
    const [channels, setChannels] =useState([])
    const{userInfo} =useAuth()
    useEffect(() => {
      if(pid){      
        const unSub = onSnapshot(collection(db, "GCs", pid, "textChannels"), (col) => {
          setChannels(col.docs)
        });
        return () => {
          unSub();
        };
      }
    }, [pid]);
    const handleKey = e=>{
      e.code ==="Enter" &&handleSend(); 
    }
    
    const handleSend = async () => 
    {
      if(title.trim())
      {
        addChannel(pid,uuid(),title.trim())
      }
      setTitle("")
      setEdit(false)
    }
  return (
    <div>
        
    {!expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend(true); setEdit(false); setTitle("")}}>{">"}</span>}
    {expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend(false); setEdit(false);setTitle("")}}>v</span>}
    <span onClick={()=>{setEdit(false); setTitle("")}} className='flex-grow pl-2 w-10 pr-2 text-gray-500 '>TEXT CHANNELS</span>
    {project.owners?.includes(userInfo.userID)&&<span
      onClick={()=>setEdit(true)}
      className='flex-col text-gray-400 hover:text-white cursor-pointer'>+</span>}
    {edit&&<div className='p-2 pl-5 pr-5'>
      <input type="text" 
        placeholder='new-channel'  
        onChange={(e) => setTitle(e.target.value)}  
        value={title} 
        onKeyDown={handleKey}
        className='w-full h-6 bg-gray-500 text-gray-200 text-sm border-none outline-none placeholder-gray-600'/>
      <p className='text-red-800 hover:text-red-600 cursor-pointer'
        onClick={()=>{setEdit(false); setTitle("")}}>cancel</p>
    </div>}
    <div onClick={()=>{setEdit(false); setTitle("")}} className='p-2 pl-1 pr-2'>
      {!expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
        (channel[1].id===channelID&&<div onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}>
          <GCTextChannel pid={pid} channelID={channel[1].id} selectedID={channelID} channelName={channel[1].data().name}/>
       </div>)
        )}
      {expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
        (<div >
          <GCTextChannel pid={pid} channelID={channel[1].id} selectedID={channelID} channelName={channel[1].data().name} setChannel={setChannel} setID={setID}/>
        </div>)
        )}
    </div>
</div>
  )
}

export default GCTextChannels