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



export default function GC() {
  
  const router = useRouter();
  const { pid } = router.query;
  const [project, setProject] = useState("");
  const [edit, setEdit] = useState(false);
  const [expend, setExpend] = useState(false);
  const [title, setTitle] = useState("");
  const [channels, setChannels] =useState([])
  const{userInfo} =useAuth()

  const [channelName, setChannel]=useState("main")
  const [channelID, setID]=useState("main")
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/getProject", requestOptions)
      .then((response) => response.text())
      .then((result) => setProject(JSON.parse(result)))
      .catch((err) => {
      });
  }, []);

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
  if(title)
  {
    const data ={
      name:title,
      messages:[],
      dateCreated: serverTimestamp()
    }
    await setDoc(doc(db, "GCs", pid, "channels", uuid()),data)
    setTitle("")
    setEdit(false)
  }
  

}
  return (
    <div className='h-[calc(100vh)] bg-gray-600 '>
  
          <div className='flex bg-red-100 h-12  justify-between  border-b border-black'>
              <div className='flex-1  basis-1/4 bg-gray-700 ' >
                <span className='flex p-2'>                
                <img src= {project.projectProfile} className='bg-white h-8 w-8 rounded-full'/>
                <span className='pl-2 p-1 trancate'>{project.name}</span>
                </span>
              </div>
              <div className='flex-2 p-3 basis-3/4 bg-gray-600 '>
              <span className='pl-2 '># {channelName}</span>
              </div>
             

          </div>
          <div  className='flex'>
            <div className='flex-1 basis-1/4 '>

      
              <div className='flex-1  bg-gray-700 overflow-y-scroll h-[calc(100vh-105px)]'>
        
                  {!expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>setExpend(true)}>{">"}</span>}
                  {expend&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>setExpend(false)}>v</span>}
                  <span className='flex-grow pl-2 w-10 pr-2 text-gray-500 '>CHANNELS</span>
                  <span
                    onClick={()=>setEdit(true)}
                    className='flex-col text-gray-400 hover:text-white cursor-pointer'>+</span>
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
                  <div className='p-2 pl-1 pr-5'>
                    {!expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                      (channel[1].id===channelID&&<span onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                         className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
                       <span className='text-lg pl-4 '>#</span>
                       <p className=' pl-2 text-sm'> {channel[1].data().name} </p>
                     </span>)
                      )}
                    {expend&&Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                      (channel[1].id!==channelID?<span onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                        className='flex items-center hover:bg-gray-400 hover:text-gray-200  rounded-lg text-gray-500 cursor-pointer'>
                      <span className='text-lg pl-4'>#</span>
                      <p className=' pl-2 text-sm'> {channel[1].data().name} </p>
                      </span>:
                      <span onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                      className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
                      <span className='text-lg pl-4'>#</span>
                      <p className=' pl-2 text-sm'> {channel[1].data().name} </p>
                      </span>)
                      )}
        
                  </div>
              </div>
              <div className='flex-2 bg-gray-800 items-center justify-between h-14 p-3 pl-5 pr-5 '>
              <div className='flex'>
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='text-white pl-3 p-1 truncate'>{userInfo.name}</span>
              </div>
              </div>
            </div>

          
            <div className='flex-2 basis-3/4'>
            <GroupMessages channel={channelID}/>
            <GroupChatInput channel={channelID}/>
            </div>

          </div>
      
    </div>
  )
}

