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



export default function GC() {
  
  const router = useRouter();
  const { pid } = router.query;
  const [project, setProject] = useState("");
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [channels, setChannels] =useState([])

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
    <div className='h-[calc(100vh)] bg-gray-100 '>
      <div className='flex-2 basis-3/4 bg-gray-500 '>
          <div className=' h-12 flex items-center justify-between p-2  gap-2'>
              <img src= {project.projectProfile}
              className='bg-white h-8 w-8 rounded-full'/>
              <span>{channelName}</span>
              <div className='flex gap-2'>
                  <img className='h-6 cursor-pointer'></img>
              </div>

          </div>
          <div  className='flex  overflow-hidden'>
            <div className='flex-1 bg-gray-700 overflow-y-scroll '>
         
              <span className='flex-grow pl-5 w-10 pr-2 text-gray-500 '>CHANNELS</span>
              <span
                onClick={()=>setEdit(true)}
                className='flex-col text-gray-400 hover:text-white cursor-pointer'>+</span>
              {edit&&<div className='border-t border-gray-400 p-2 pl-5 pr-5'>
                <input type="text" 
                  placeholder='new-channel'  
                  onChange={(e) => setTitle(e.target.value)}  
                  value={title} 
                  onKeyDown={handleKey}
                  className='w-full h-6 bg-gray-500 text-gray-200 text-sm border-none outline-none placeholder-gray-600'/>
                <p className='text-red-800 hover:text-red-600 cursor-pointer'
                   onClick={()=>{setEdit(false); setTitle("")}}>cancel</p>
              </div>}
              <div className='border-t border-gray-400 p-2 pl-5 pr-5'>
                {Object.entries(channels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                  (<p  onClick={()=>{setChannel(channel[1].data().name); setID(channel[1].id)}}
                    className='rounded-lg text-gray-800 cursor-pointer hover:bg-gray-400 hover:text-gray-200'>
                  # {channel[1].data().name}
                  </p>)
                  )}
              </div>
            </div>
            <div className='flex-2 basis-3/4'>
            <GroupMessages channel={channelID}/>
            <GroupChatInput channel={channelID}/>
            </div>

          </div>
      </div>
      
    </div>
  )
}

