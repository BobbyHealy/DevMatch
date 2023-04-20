import {useState, useEffect}from 'react'
import {
  onSnapshot,
  collection,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "@/config/firebase";
import { addChannel } from '@/fireStoreBE/GCVoice';
import { useAuth } from '@/context/AuthContext';
import GCVoiceChannel from './GCVoiceChannel';

function GCVoiceChannels({pid,project, vTitle, vEdit, channelID,setVTitle, setVEdit, setChannel, joined, setJoined}) {
const [expend, setExpend] = useState(false);
const [channels, setChannels] =useState([])

const{userInfo} =useAuth()
useEffect(() => {
  console.log(joined)
  if(!joined){
  
    setChannel("")
  }     

}, [joined]);
useEffect(() => {
    if(pid){      
      const unSub = onSnapshot(collection(db, "GCs", pid, "voiceChannels"), (channels) => {
        setChannels(channels.docs)
      });
      return () => {
        unSub();
      };
    }
  }, [pid]);
    const handleKey = e=>
    {
        e.code ==="Enter" &&handleSend(); 
    }
    const handleSend = async () => 
    {
        if(vTitle.trim())
        {
            addChannel(pid,uuid(),vTitle.trim())
        }
        setVTitle("")
        setVEdit(false)
    }
    return (
        <div>
            {/* heading */}
            {!joined&&!expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend(true); setVEdit(false); setVTitle("")}}>{">"}</span>}
            {!joined&&expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend(false); setVEdit(false);setVTitle("")}}>v</span>}
            <span onClick={()=>{setVEdit(false); setVTitle("")}} className='flex-grow pl-2 w-10 pr-2 text-gray-500 '>VOICE CHANNELS</span>
            {project.owners?.includes(userInfo.userID)&&<span
            onClick={()=>setVEdit(true)}
            className='flex-col text-gray-400 hover:text-white cursor-pointer'>+</span>}
            {vEdit&&<div className='p-2 pl-5 pr-5'>
            
            {/* Add Button */}
            <input type="text" 
                placeholder='new-channel'  
                onChange={(e) => setVTitle(e.target.value)}  
                value={vTitle} 
                onKeyDown={handleKey}
                className='w-full h-6 bg-gray-500 text-gray-200 text-sm border-none outline-none placeholder-gray-600'/>
            <p className='text-red-800 hover:text-red-600 cursor-pointer'
                onClick={()=>{setVEdit(false); setVTitle("")}}>cancel</p>
            </div>}
            {/* Channels */}
            {!joined?<div onClick={()=>{setVEdit(false); setVTitle("")}} className='p-2 pl-1 pr-2'>
            {!expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>

                (channel[1].id===channelID&&<div className='text-white' onClick={()=>{setChannel(channel[1].id);}}>
                  <GCVoiceChannel channelID={channel[1].id} selectedID={channelID} pid={pid} channelName={channel[1].data().name} setJoined={setJoined}  setChannel={setChannel} />
                </div>)
                )}
            {expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                (<div className='text-white' onClick={()=>{setChannel(channel[1].id);setJoined(true)}}>
                  <GCVoiceChannel channelID={channel[1].id} selectedID={channelID} pid={pid} channelName={channel[1].data().name} setJoined={setJoined}  setChannel={ setChannel}/>
                </div>)
                )}
            </div>:<div onClick={()=>{setVEdit(false); setVTitle("")}} className='p-2 pl-1 pr-2'>
              {Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
              (channel[1].id===channelID&&<div className='text-white' onClick={()=>{setChannel(channel[1].id);}}>
                <GCVoiceChannel channelID={channel[1].id} selectedID={channelID} pid={pid} channelName={channel[1].data().name} setJoined={setJoined}  setChannel={ setChannel}/>
              </div>)
              )}
            </div>}
        </div>
    )
}
export default GCVoiceChannels