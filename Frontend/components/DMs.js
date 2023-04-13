import {useEffect,useState, Fragment} from "react";
import Chat from "@/components/Chat";
import { useAuth } from "@/context/AuthContext";
import {doc,onSnapshot} from "firebase/firestore";
import { db } from "@/config/firebase";
import Searchbar from "./Searchbar";
import Chats from "@/components/Chats";
import { Menu, Transition } from '@headlessui/react'
import { 
  EllipsisVerticalIcon, 
} from '@heroicons/react/20/solid'
import { switchPage } from "@/fireStoreBE/User";
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DMs() {
  const { user, userInfo} = useAuth();
  const[search,setSearch]=useState(false)
  const [receiver, setReceiver] = useState(null);
  const [DMID, setDMID] = useState()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    switchPage(user.uid, "DMs")
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


  const handleShow= ()=>{
    setOpen(true)
  }
  return (

    <div className='h-[calc(100vh-56px)] bg-zinc-700 w-[calc(100vw)] lg:h-[calc(100vh)] lg:w-[calc(100vw-256px)] '>
          <div onClick={()=>setSearch(false)} className='flex h-12 justify-between border-b border-black'>
              <div className='bg-gray-700 w-[calc(246px)]' >
                <span className='flex p-2 gap-2'>                
                <img src= {userInfo.profilePic} className='bg-white h-8 w-8 rounded-full'/>
                <span className='p-1 truncate'>{userInfo.name}</span>
                </span>
              </div>
              <div className='  w-[calc(100vw-290px)] lg:w-[calc(100vw-546px)] bg-zinc-700 '>
              <span className=' flex p-2 gap-2 '>
                {!receiver&&<span className="p-1">Receiver</span>}
                {/* <img src= {receiver?.photoURL} className='bg-white h-8 w-8 rounded-full '/> */}
                <span className="p-1">@ {receiver?.displayName}</span>
                </span>
              </div>
              <div>
                <Menu as="div" className=" relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center  text-gray-400 hover:text-gray-600 focus:outline-none p-3">
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {<Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={handleShow}
                              className={classNames(
                                active ? 'text-gray-100' : 'text-gray-400',
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
          <div onClick={()=>{setSearch(false); setOpen(false)}} className="flex-2  w-[calc(100vw-246px)] lg:w-[calc(100vw-502px)]">
            <Chat receiver={receiver} DMID={DMID} open={open}/>
          </div>
        
        </div>
        
      </div>

    </div>

  );
}
