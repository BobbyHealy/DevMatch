import {useState, useEffect}from 'react'
import GroupMessages from './GroupMessages'
import GroupChatInput from './GroupChatInput';
import { useRouter } from 'next/router';
import {
  onSnapshot,
  doc,
  collection,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "@/config/firebase";
import { useAuth } from '@/context/AuthContext';



export default function GC({pid,project}) {
  
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [expend, setExpend] = useState(false);
  const [title, setTitle] = useState("");
  const [channels, setChannels] =useState([])
  const{userInfo} =useAuth()

  const [channelName, setChannel]=useState("main")
  const [channelID, setID]=useState("main")

  useEffect(() => {
    if(pid){
      const ref = collection(db, "GCs", pid,"channels")
      // const snap = getDoc(ref)
      
      const unSub = onSnapshot(collection(db, "GCs", pid, "channels"), (col) => {
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
    const data ={
      name:title.trim(),
      messages:[],
      dateCreated: serverTimestamp()
    }
    await setDoc(doc(db, "GCs", pid, "channels", uuid()),data)
  }
  setTitle("")
  setEdit(false)
}
  return (
    <div className='h-[calc(100vh-56px)] bg-gray-600 w-[calc(100vw)] lg:h-[calc(100vh)] lg:w-[calc(100vw-256px)] '>
  
          <div onClick={()=>{setEdit(false); setTitle("")}} className='flex bg-red-100 h-12  justify-between  border-b border-black'>
              <div className='  w-[calc(246px)] bg-gray-700 ' >
                <span className='flex p-2'>                
                <img src= {project.projectProfile} className='bg-white h-8 w-8 rounded-full'/>
                <span className='pl-2 p-1 trancate'>{project.name}</span>
                </span>
              </div>
              <div className='w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)] '>
              <div className='flex-2 p-3 bg-gray-600 '>
                <span className='pl-2 truncate'># {channelName}</span>
              </div>
              </div>
             

          </div>
          <div  className='flex'>
            <div className='h-[calc(100vh-104px)] w-[calc(246px)] lg:h-[calc(100vh-48px)]  '>

      
              <div className='bg-gray-700 overflow-y-scroll h-[calc(100vh-160px)] lg:h-full'>
        
                  {!expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend(true); setEdit(false); setTitle("")}}>{">"}</span>}
                  {expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend(false); setEdit(false);setTitle("")}}>v</span>}
                  <span onClick={()=>{setEdit(false); setTitle("")}} className='flex-grow pl-2 w-10 pr-2 text-gray-500 '>CHANNELS</span>
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
                      (channel[1].id===channelID&&<span onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                         className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
                       <span className='text-lg pl-4 '>#</span>
                       <p className=' pl-2 text-sm truncate'> {channel[1].data().name} </p>
                     </span>)
                      )}
                    {expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                      (channel[1].id!==channelID?<span onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                        className='flex items-center hover:bg-gray-400 hover:text-gray-200  rounded-lg text-gray-500 cursor-pointer'>
                      <span className='text-lg pl-4'>#</span>
                      <p className=' pl-2 text-sm truncate'> {channel[1].data().name} </p>
                      </span>:
                      <span onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                      className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
                      <span className='text-lg pl-4'>#</span>
                      <p className=' pl-2 text-sm truncate'> {channel[1].data().name} </p>
                      </span>)
                      )}
        
                  </div>
              </div>
              <div onClick={()=>{setEdit(false); setTitle("")}} className='flex-2 bg-gray-800 items-center justify-between h-14 p-3 pl-5 pr-5 lg:hidden '>
              <div className='flex'>
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='text-white pl-3 p-1 truncate'>{userInfo.name}</span>
              </div>
              </div>
            </div>

          
            <div onClick={()=>{setEdit(false); setTitle("")}} className='w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)]'>
            <GroupMessages channel={channelID}/>
            <div className='pl-2 pr-2'>
            <GroupChatInput channel={channelID}/>
            </div>
            </div>

          </div>
      
    </div>
  )
}

