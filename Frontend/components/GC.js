import {useState, Fragment, useEffect}from 'react'
import GroupMessages from './GroupMessages'
import GroupChatInput from './GroupChatInput';
import { 
  EllipsisVerticalIcon, 
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '@/context/AuthContext';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
import GCTextChannels from './GCTextChannels';
import GCVoiceChannels from './GCVoiceChannels';


export default function GC({pid,project}) {
  const [joined, setJoined] = useState(false)
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [vTitle, setVTitle] = useState("");
  const [vEdit, setVEdit] = useState(false);
  // const [mic, setMic] = useState(true);
  // const [sound, setSound] = useState(true);
  const {userInfo} =useAuth()
  const [channelName, setChannel]=useState("main")
  const [channelID, setID]=useState("main")
  const [channelVID, setVID]=useState("")
  const [open, setOpen] = useState(false)
  const handleShow= ()=>{
    setOpen(true)
  }
  useEffect(() => {
    console.log(joined)
    if(!joined){

      setVID("")
    }     
  
  }, [joined]);
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
            {/* {!channelVID? */}
            <div className='bg-gray-700 overflow-y-scroll h-[calc(100vh-160px)] lg:h-full'>
              {!joined&&<GCTextChannels pid={pid} project={project} channelID={channelID} title={title} edit={edit} setChannel={setChannel} setTitle={setTitle} setEdit={setEdit} setID={setID}/>}
              {/* Voice Channels */}
              <GCVoiceChannels pid={pid} project={project} channelID={channelVID} vTitle={vTitle} vEdit={vEdit} setVTitle={setVTitle} setVEdit={setVEdit} setChannel={setVID} joined={joined} setJoined={setJoined}/>
              {/* voice channel input control */}
            </div>
            {/* :<div className='bg-gray-700 overflow-y-scroll h-[calc(100vh-210px)] lg:h-[calc(100vh-100px)]'>
              <GCTextChannels pid={pid} project={project} channelID={channelID} title={title} edit={edit} setChannel={setChannel} setTitle={setTitle} setEdit={setEdit} setID={setID}/> */}
              {/* Voice Channels */}
              {/* <GCVoiceChannels pid={pid} project={project} channelID={channelVID} vTitle={vTitle} vEdit={vEdit} setVTitle={setVTitle} setVEdit={setVEdit} setChannel={setVID}  />
            
            </div>} */}
            {/* {channelVID&&<div className='flex items-center bg-gray-800 h-[calc(50px)] '>
              <span className='mx-1 text-green-700 text-sm'>VOICE CONNECTED</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'> {mic?<MicrophoneIcon onClick={()=>setMic(false)} className='ml-1.5 text-white h-5 w-5 '/>:<MicrophoneIcon onClick={()=>setMic(true)}  className='ml-1.5 text-red-800 h-5 w-5 '/>}</span>
             
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'> {sound?<SpeakerWaveIcon onClick={()=>setSound(false)} className='ml-1.5 text-white h-5 w-5'/>:<SpeakerXMarkIcon onClick={()=>setSound(true)} className='ml-1.5 text-red-800 h-5 w-5'/>}</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'
              onClick={()=>setVID("")}><PhoneXMarkIcon className='ml-1.5 text-white h-5 w-5'/></span>
            </div>} */}
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
      
    </div>
  )
}

