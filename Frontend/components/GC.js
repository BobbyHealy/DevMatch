import {useState, Fragment, useEffect}from 'react'
import GroupMessages from './GroupMessages'
import GroupChatInput from './GroupChatInput';
import { 
  EllipsisVerticalIcon, 
  PhoneXMarkIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '@/context/AuthContext';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import GCTextChannels from './GCTextChannels';
import GCVoiceChannels from './GCVoiceChannels';
import AgoraRTC from "agora-rtc-sdk-ng"
import AgoraRTM from "agora-rtm-sdk"
import Router from 'next/router';


export default function GC({pid,project}) {
  
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [vTitle, setVTitle] = useState("");
  const [vEdit, setVEdit] = useState(false);
  const [mic, setMic] = useState(false);
  const [sound, setSound] = useState(false);
  const {user, userInfo} =useAuth()
  const [channelName, setChannel]=useState("main")
  const [channelID, setID]=useState("main")
  const [channelVID, setVID]=useState("")
  const [open, setOpen] = useState(false)
  const [roomID, setRoomID] =useState()
  const [localAudioTrack, setLocalAudioTrack] =useState(null)
  const [remoteAudioTracks, setRemoteAudioTrack] = useState({})
  const [rtcClient , setrtcClient] = useState(null)
  const handleShow= ()=>{
    setOpen(true)
  }

const appid = "cbe38fe4d8f3419793086c6b2cf42312"
const token = null

const rtcUid =  user.uid
const rtmUid =  String(user.uid)

useEffect(() => {
  setRoomID(channelID)
},[channelID])



let micMuted = true

let rtmClient;
let channel;

let avatar;


const initRtm = async (name) => {

  rtmClient = AgoraRTM.createInstance(appid)
  await rtmClient.login({'uid':rtmUid, 'token':token})

  channel = rtmClient.createChannel(roomID)
  await channel.join()

  await rtmClient.addOrUpdateLocalUserAttributes({'name':name, 'userRtcUid':rtcUid.toString()})

  getChannelMembers()

  // window.addEventListener('beforeunload', leaveRtmChannel)

  channel.on('MemberJoined', handleMemberJoined)
  channel.on('MemberLeft', handleMemberLeft)
}



const initRtc = async () => {
  let rtcC = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  rtcC.on("user-published", handleUserPublished)
  rtcC.on("user-left", handleUserLeft);
  console.log("initRTC")
  await rtcC.join(appid, channelVID, token, rtcUid)
  let localAudio =AgoraRTC.createMicrophoneAudioTrack();
  (await localAudio).setMuted(micMuted)
  setLocalAudioTrack(localAudio)
  await rtcC.publish(localAudio.localAudioTrack);
  setrtcClient(rtcC)

  initVolumeIndicator()
}

let initVolumeIndicator = async () => {

  //1
  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
  rtcClient.enableAudioVolumeIndicator();
  
  //2
  rtcClient.on("volume-indicator", volumes => {
    volumes.forEach((volume) => {
      console.log(`UID ${volume.uid} Level ${volume.level}`);

      //3
      // try{
      //     let item = document.getElementsByClassName(`avatar-${volume.uid}`)[0]

      //    if (volume.level >= 50){
      //      item.style.borderColor = '#00ff00'
      //    }else{
      //      item.style.borderColor = "#fff"
      //    }
      // }catch(error){
      //   console.error(error)
      // }


    });
  })
}


let handleUserPublished = async (user, mediaType) => {
  await  rtcClient.subscribe(user, mediaType);
  var remoteTracks = []
  if (mediaType == "audio"){
    
    remoteTracks[user.uid] = [user.audioTrack]
    user.audioTrack.play();
  }
  setRemoteAudioTrack(remoteTracks)
}

let handleUserLeft = async (user) => {
  // delete audioTracks.remoteAudioTracks[user.uid]
  //document.getElementById(user.uid).remove()
}

let handleMemberJoined = async (MemberId) => {

  let {name, userRtcUid, userAvatar} = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid', 'userAvatar'])

  // let newMember = `
  // <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
  //   <img class="user-avatar avatar-${userRtcUid}" src="${userAvatar}"/>
  //     <p>${name}</p>
  // </div>`

}

let handleMemberLeft = async (MemberId) => {
  // document.getElementById(MemberId).remove()
}

let getChannelMembers = async () => {
  let members = await channel.getMembers()

  for (let i = 0; members.length > i; i++){

    let {name, userRtcUid, userAvatar} = await rtmClient.getUserAttributesByKeys(members[i], ['name', 'userRtcUid', 'userAvatar'])

    let newMember = `
    <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}">
        <img class="user-avatar avatar-${userRtcUid}" src="${userAvatar}"/>
        <p>${name}</p>
    </div>`
  
  }
}

const toggleMic = async () => {
  console.log("toggleMic")
  if (!mic){
    setMic(true)
    localAudioTrack.setMuted(false)
  }else{

    setMic(false)
    localAudioTrack.setMuted(true)
  }

}


const enterRoom = async (e) => {
  e.preventDefault()
  console.log(e)
  console.log("enterRoom")
  // Router.push(`?pid=${pid}?room=${roomID}`)
  // window.history.replaceState(null, null, `?room=${roomId}`);

  initRtc()

  let displayName = userInfo.name
  initRtm(displayName)

}

let leaveRtmChannel = async () => {
  await channel.leave()
  await rtmClient.logout()
}

let leaveRoom = async () => {
  localAudioTrack&&localAudioTrack.stop()
  localAudioTrack&&localAudioTrack.close()
  rtcClient&&rtcClient.unpublish()
  rtcClient&&rtcClient.leave()

  leaveRtmChannel()
  console.log("keave rtc")

}

const leaveVR = ()=>{
  setVID("");
  leaveRoom;
}

// lobbyForm.addEventListener('submit', enterRoom)
// document.getElementById('leave-icon').addEventListener('click', leaveRoom)
// document.getElementById('mic-icon').addEventListener('click', toggleMic)


// const avatars = document.getElementsByClassName('avatar-selection')

// for (let i=0; avatars.length > i; i++){
  
//   avatars[i].addEventListener('click', ()=> {
//     for (let i=0; avatars.length > i; i++){
//       avatars[i].style.borderColor = "#fff"
//       avatars[i].style.opacity = .5
//     }

//       avatar = avatars[i].src
//       avatars[i].style.borderColor = "#00ff00"
//       avatars[i].style.opacity = 1
//   })
// }
  return (
    <div className='h-[calc(100vh-56px)] bg-gray-600 w-[calc(100vw)] lg:h-[calc(100vh)] lg:w-[calc(100vw-256px)] '>
      <div onClick={()=>{setEdit(false); setTitle("")}} className='flex bg-red-100 h-12  justify-between  border-b border-black'>
        <div className='  w-[calc(246px)] bg-gray-700 ' >
          <span className='flex p-2'>                
          <img src= {project.projectProfile} className='bg-white h-8 w-8 rounded-full'/>
          <span className='pl-2 p-1 trancate'>{project.name}</span>
          </span>
        </div>
        <div className='w-[calc(100vw-290px)] lg:w-[calc(100vw-546px)] '>
          <div className='flex-2 p-3 bg-gray-600 '>
            <span className='pl-2 truncate'># {channelName}</span>
          </div>
        </div>
        <div>
          <Menu as="div" className=" relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center  bg-gray-600 h-12 text-gray-400 hover:text-gray-200 focus:outline-none p-3">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md  shadow-lg bg-gray-600 ring-1 ring-gray-700 focus:outline-none">
                <div className="py-1">
                  {<Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={handleShow}
                        className={classNames(
                          active ? 'bg-gray-600 text-white' : 'text-gray-300',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Pin Board
                      </a>
                    )}
                  </Menu.Item>}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
          <div  className='flex'>
            <div className='h-[calc(100vh-104px)] w-[calc(246px)] lg:h-[calc(100vh-48px)]  '>
            {/* Text Channels */}
            {!channelVID?<div className='bg-gray-700 overflow-y-scroll h-[calc(100vh-160px)] lg:h-full'>
              <GCTextChannels  pid={pid} project={project} channelID={channelID} title={title} edit={edit} setChannel={setChannel} setTitle={setTitle} setEdit={setEdit} setID={setID}/>
              {/* Voice Channels */}
              <GCVoiceChannels pid={pid} project={project} channelID={channelVID} vTitle={vTitle} vEdit={vEdit} setVTitle={setVTitle} setVEdit={setVEdit} setChannel={setVID} enterRoom ={enterRoom}/>
              {/* voice channel input control */}
            </div>:<div className='bg-gray-700 overflow-y-scroll h-[calc(100vh-210px)] lg:h-[calc(100vh-100px)]'>
              <GCTextChannels pid={pid} project={project} channelID={channelID} title={title} edit={edit} setChannel={setChannel} setTitle={setTitle} setEdit={setEdit} setID={setID}/>
              {/* Voice Channels */}
              <GCVoiceChannels pid={pid} project={project} channelID={channelVID} vTitle={vTitle} vEdit={vEdit} setVTitle={setVTitle} setVEdit={setVEdit} setChannel={setVID} enterRoom ={enterRoom}/>
              {/* voice channel input control */}
            </div>}
            {channelVID&&<div className='flex items-center bg-gray-800 h-[calc(50px)] '>
              <span className='mx-1 text-green-700 text-sm'>VOICE CONNECTED</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'> {mic?<MicrophoneIcon onClick={toggleMic} className='ml-1.5 text-white h-5 w-5 '/>:<MicrophoneIcon onClick={toggleMic}  className='ml-1.5 text-red-800 h-5 w-5 '/>}</span>
             
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'> {sound?<SpeakerWaveIcon onClick={()=>setSound(false)} className='ml-1.5 text-white h-5 w-5'/>:<SpeakerXMarkIcon onClick={()=>setSound(true)} className='ml-1.5 text-red-800 h-5 w-5'/>}</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'
              onClick={leaveRoom}><PhoneXMarkIcon className='ml-1.5 text-white h-5 w-5'/></span>
            </div>}
            <div onClick={()=>{setEdit(false); setTitle("");setOpen(false)}} className='flex-2 bg-gray-800 items-center justify-between h-14 p-3 pl-5 pr-5 lg:hidden '>
              <div className='flex'>
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='text-white pl-3 p-1 truncate'>{userInfo.name}</span>
              </div>
            </div>
            </div>
            <div onClick={()=>{setEdit(false); setTitle("");setOpen(false)}} className='w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)]'>
            <GroupMessages open={open} channel={channelID} />
            <div className='pl-2 pr-2'>
            <GroupChatInput channel={channelID}/>
            </div>
            </div>

          </div>
          <button onClick={enterRoom}>Enter Room</button>
      
    </div>
  )
}

