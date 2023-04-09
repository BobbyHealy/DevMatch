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
import AgoraRTC from 'agora-rtc-sdk-ng';

let audioTracks = {
  localAudioTracks: null,
  remoteAudioTracks: {}
}
const initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


  rtcClient.on('user-joined', handleUserJoined)
  rtcClient.on("user-published", handleUserPublished)
  rtcClient.on("user-left", handleUserLeft);
  

  await rtcClient.join(appid, roomId, token, rtcUid)
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  await rtcClient.publish(audioTracks.localAudioTrack);


  document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${rtcUid}" id="${rtcUid}"><p>${rtcUid}</p></div>`)
}

export default function GC({pid,project}) {
  const appID = "cbe38fe4d8f3419793086c6b2cf42312"
  const appToken = null
  const [edit, setEdit] = useState(false);
  const [expend, setExpend] = useState(false);
  const [title, setTitle] = useState("");
  const [edit2, setEdit2] = useState(false);
  const [expend2, setExpend2] = useState(false);
  const [title2, setTitle2] = useState("");
  const [channels, setChannels] =useState([])
  const [vchannels, setVChannels] =useState([])
  const{user,userInfo} =useAuth()

  const [channelName, setChannel]= useState("main")
  const [channelID, setID]= useState("main")
  const [vChannelID, setVID]= useState("")
  let handleUserJoined = async () => {
    console.log('USER:', user)
  }
  let handleUserPublished = async (user, mediaType) => {
    await  rtcClient.subscribe(user, mediaType);
    if (mediaType == "audio"){
      audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
      user.audioTrack.play();
    }
  }
  let handleUserLeft = async (user) => {
    delete audioTracks.remoteAudioTracks[user.uid]
    document.getElementById(user.uid).remove()
  }
  const enterRoom = async (e) => {
    e.preventDefault()
    initRtc()
  
  }
  let leaveRoom = async () => {
    audioTracks.localAudioTrack.stop()
    audioTracks.localAudioTrack.close()
    rtcClient.unpublish()
    rtcClient.leave()
  
  }

  useEffect(() => {
    if(pid){
    
      
      const unSub = onSnapshot(collection(db, "GCs", pid, "channels"), (col) => {
        setChannels(col.docs)
      });
      const ref2 = collection(db, "GCs", pid,"channels")
      // const snap = getDoc(ref)
      
      const unSub2 = onSnapshot(collection(db, "GCs", pid, "voice-channels"), (col) => {
        setVChannels(col.docs)
      });
      return () => {
        unSub();
        unSub2();
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
const handleKey2 = e=>{
  e.code ==="Enter" &&handleSend2(); 
}


const handleSend2 = async () => 
{
if(title2.trim())
{
  const data ={
    name:title2.trim(),
    dateCreated: serverTimestamp()
  }
  await setDoc(doc(db, "GCs", pid, "voice-channels", uuid()),data)
}
setTitle2("")
setEdit2(false)
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
                  {/* Voice channels */}
                  {!expend2&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend2(true); setEdit2(false); setTitle2("")}}>{">"}</span>}
                  {expend2&&<span className='flex-grow  pl-1 w-5 text-gray-500 cursor-pointer hover:text-white ' onClick={()=>{setExpend2(false); setEdit2(false);setTitle2("")}}>v</span>}
                  <span onClick={()=>{setEdit2(false); setTitle2("")}} className='flex-grow pl-2 w-10 pr-2 text-gray-500 '>TEXT CHANNELS</span>
                  {project.owners?.includes(userInfo.userID)&&<span
                    onClick={()=>setEdit2(true)}
                    className='flex-col text-gray-400 hover:text-white cursor-pointer'>+</span>}
                  {edit2&&<div className='p-2 pl-5 pr-5'>
                    <input type="text" 
                      placeholder='new-channel'  
                      onChange={(e) => setTitle2(e.target.value)}  
                      value={title2} 
                      onKeyDown={handleKey2}
                      className='w-full h-6 bg-gray-500 text-gray-200 text-sm border-none outline-none placeholder-gray-600'/>
                    <p className='text-red-800 hover:text-red-600 cursor-pointer'
                      onClick={()=>{setEdit2(false); setTitle2("")}}>cancel</p>
                  </div>}
                  <div onClick={()=>{enterRoom;setEdit2(false); setTitle2("")}} className='p-2 pl-1 pr-2'>
                    {!expend2&&Object.entries(vchannels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                      (channel[1].id===vChannelID&&<span onClick={()=>{ setVID(channel[1].id)}}
                         className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
                       <span className='text-lg pl-4 '>#</span>
                       <p className=' pl-2 text-sm truncate'> {channel[1].data().name} </p>
                     </span>)
                      )}
                    {expend2&&Object.entries(vchannels)?.sort((a,b)=>a[1].data().dateCreated- b[1].data().dateCreated).map((channel)=>
                      (channel[1].id!==vChannelID?<span onClick={()=>{ setVID(channel[1].id)}}
                        className='flex items-center hover:bg-gray-400 hover:text-gray-200  rounded-lg text-gray-500 cursor-pointer'>
                      <span className='text-lg pl-4'>#</span>
                      <p className=' pl-2 text-sm truncate'> {channel[1].data().name} </p>
                      </span>:
                      <span onClick={()=>{setVID(channel[1].id)}}
                      className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
                      <span className='text-lg pl-4'>#</span>
                      <p className=' pl-2 text-sm truncate'> {channel[1].data().name} </p>
                      </span>)
                      )}
        
                  </div>
                  
              </div>
              <div onClick={()=>{setEdit(false); setTitle("");setEdit2(false); setTitle2("")}} className='flex-2 bg-gray-800 items-center justify-between h-14 p-3 pl-5 pr-5 lg:hidden '>
              <div className='flex'>
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='text-white pl-3 p-1 truncate'>{userInfo.name}</span>
              </div>
              </div>
            </div>

          
            <div onClick={()=>{setEdit(false); setTitle("");setEdit2(false); setTitle2("")}} className='w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)]'>
            {channelID&&<GroupMessages channel={channelID}/>}
            <div className='pl-2 pr-2'>
            {channelID&&<GroupChatInput channel={channelID}/>}
            </div>
            </div>

          </div>
      
    </div>
  )
}

