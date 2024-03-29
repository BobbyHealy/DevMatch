import { useState, useEffect, useRef, Fragment } from "react";
import { Menu, Transition } from '@headlessui/react'
import { 
  EllipsisVerticalIcon, 
  PencilIcon 
} from '@heroicons/react/20/solid'

import { unpinMsg,pinMsg,deleteMsg, editMsg } from "@/fireStoreBE/DMs";
import { useAuth } from "@/context/AuthContext";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Message({DMID, id, message, receiver}) {
  const ref = useRef(); 
  const date = message.date.toDate().toLocaleString('en-US').split(",")
  const time = date[1].split(":")
  const sign = time[2].split(" ")
  const [onEdit, setEdit] = useState(false);
  const [text, setText]= useState(message.text)
  
  useEffect(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);
  const { user, userInfo} = useAuth();
  const handleKey = e=>{
      e.code ==="Enter" &&handleSend(); 
  }   
  const currentUser = {
      uid: user.uid,
      name: userInfo.name,
      photoURL: userInfo.profilePic, 
  }

  const handleSend = async () => {
    if(!message.img)
    {
        if (text.trim()&&text.trim()!==message.text)
        {
            await editMsg(DMID,id,text.trim())  
        }
    }
    else
    {
        if(text.trim()!==message.text)
        {
            await editMsg(DMID,id,text.trim()) 
        }
    }
    setEdit(false)

}
  return (
    <div className="group hover:bg-zinc-600">
        {/* if it is receiver */}
        { message.senderId !== currentUser.uid&&<div className='flex mb-5 gap-5 '> 
            <div className='info flex flex-col text-gray-300 font-light'>
                {receiver&&<img className='bg-white w-10 h-10 object-cover rounded-full' src={receiver.photoURL}/>}
                <span className='text-sm'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                <span className='text-sm'>{date[0]}</span>
            </div>
            <div className="flex h-8 bg-zinc-800 rounded-lg">
            
              <Menu as="div" className="hidden group-hover:block relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center  text-gray-400 hover:text-gray-600 focus:outline-none p-1">
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
                  <Menu.Items className="absolute left-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {!message.pinned&&<Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            // onClick={handlePin}
                            onClick={()=>{pinMsg(DMID,id,message,user.uid)}}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Pin Message
                          </a>
                        )}
                      </Menu.Item>}
                      {message.pinned&&<Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={()=>unpinMsg(DMID,id)}
                            // onClick={handleUnpin}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Unpin Message
                          </a>
                        )}
                      </Menu.Item>}
                      
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className='content flex flex-col gap-2 max-w-[calc(70%)]'>
                <img className='w-1/2 object-cover py-1' src={message.img}/>
                {message.text&&<p className='bg-orange-100 text-black rounded-tl-none rounded-lg px-4 py-2 max-w-max'>{message.text}</p>}
                
            </div>

        </div> }
        {/* if it is sender */}
        {message.senderId === currentUser.uid&&<div className='flex mb-5 gap-5 flex-row-reverse'> 
            <div className='info flex flex-col text-gray-300 font-light items-end'>
                <img className='bg-white w-10 h-10 object-cover rounded-full' src={currentUser.photoURL}/>
                <span className='text-sm'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                <span className='text-sm'>{date[0]}</span>
            </div>

            <div className="flex h-8 bg-zinc-800 rounded-lg">
              <button className="hidden group-hover:block text-gray-400 hover:text-gray-600 p-1">
                <PencilIcon className="h-5 w-5 "
                onClick={()=>setEdit(true)}/>
              </button>
            
              <Menu as="div" className="hidden group-hover:block relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center  text-gray-400 hover:text-gray-600 focus:outline-none p-1">
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {!message.pinned&&<Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            // onClick={handlePin}
                            onClick={()=>pinMsg(DMID,id,message,user.uid)}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Pin Message
                          </a>
                        )}
                      </Menu.Item>}
                      {message.pinned&&<Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            // onClick={handleUnpin}
                            onClick={()=>unpinMsg(DMID,id)}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Unpin Message
                          </a>
                        )}
                      </Menu.Item>}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={()=>deleteMsg(DMID,id)}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Delete Messege
                          </a>
                        )}
                      </Menu.Item>
                      
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            {onEdit&&<div className = "content flex  flex-col items-end w-[calc(70%)]">
              <img className='w-60 object-cover pb-2' src={message.img}/>
              <input type="text" placeholder={message.text}  onChange={(e) => setText(e.target.value)}  value={text}    onKeyDown={handleKey} className='bg-blue-300 w-full text-black rounded-tr-none rounded-lg px-4 py-2'/>
              <span className="text-sm text-blue-400"
              onClick={()=>{setText(message.text);setEdit(false);}}>cancel
              </span>
            </div>}
            {!onEdit&&<div className = "content flex flex-col items-end gap-2 max-w-[calc(70%)]">
              <img className='w-60 object-cover py-1' src={message.img}/>
              {message.text&&<p className='bg-blue-300 text-black rounded-tr-none rounded-lg px-4 py-2 max-w-max'>{message.text}
              </p>} 
            </div>}
        </div>}


    </div>
    
  )
}

