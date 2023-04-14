import {useEffect, useRef, useState, Fragment} from "react";
import { Timestamp } from "firebase/firestore";
import { Menu, Transition } from '@headlessui/react'
import { 
  EllipsisVerticalIcon, 
  PencilIcon 
} from '@heroicons/react/20/solid'
import { pinMsg,unpinMsg,deleteMsg,editMsg } from "@/fireStoreBE/GCText";
import { useAuth } from "@/context/AuthContext";

function classNames(...classes) 
{
    return classes.filter(Boolean).join(' ')
}
export default function GroupMessage({pid, channel, message, id}) {
    const ref = useRef(); 
    const date = message.date.toDate().toLocaleString('en-US').split(",")
    const time = date[1].split(":")
    const sign = time[2].split(" ")
    const today = new Date(Timestamp.now().toDate().toLocaleString('en-US').split(",")[0])
    const diff =(message.date.toDate()- today)
    const {user, userInfo} = useAuth();
    const [onEdit, setEdit] = useState(false);
    const [text, setText]= useState(message.text)
    const [sender, setSender] = useState("Loading...")
  
    useEffect(()=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            userID: message.senderID,
        });
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };
        fetch("http://localhost:3000/api/getUser", requestOptions)
            .then((response) => response.text())
            .then((result) => {
            setSender(JSON.parse(result).name);

            })
            .catch((err) => {
            console.log(err);
            });
 
    },[])
    
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);
    const handleKey = e=>{
        e.code ==="Enter" &&handleSend(); 
    }
    const handleSend = async () => {
        if(!message.img)
        {
            if (text.trim()&&text.trim()!==message.text)
            {
                await editMsg(pid,channel,id,text.trim())   
            }
        }
        else
        {
            if(text.trim()!==message.text)
            {
                await editMsg(pid,channel,id,text.trim())
            }
        }
        setEdit(false)
    }

    

  return (
    <div className="group hover:bg-zinc-500 p-1 rounded-lg">
        <div className='flex mb-5 gap-5 '> 
            <div className='info flex flex-col text-gray-300 font-light'>
                <img className='bg-white w-12 h-12 object-cover rounded-full' src={message.photoURL}/>

            </div>
            <div className='content flex flex-col w-[calc(90%-40px)]'>
                <div>
                    <span className='text-yellow-300'>{message.senderID===user.uid?sender+" (You)":sender}</span>
                    {diff<0&&<span className='text-xs pl-2'>{date[0]}</span>}
                    {diff>0&&<span className='text-xs pl-2'>Today at</span>}
                    <span className='text-xs pl-1'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                </div>
                {onEdit&&<div>
                    <img className='w-60 object-cover' src={message.img}/>
                    <input 
                    type="text" 
                    multiline 
                    placeholder={message.text}  
                    onChange={(e) => setText(e.target.value)}  
                    value={text}    
                    onKeyDown={handleKey} 
                    className='w-full bg-transparent text-white border-none outline-none placeholder-gray-400'
                    />
                    <span className="text-sm text-blue-400"
                    onClick={()=>{setText(message.text);setEdit(false);}}>cancel
                </span>
                </div>}
                {!onEdit&&<div className = "">
                    <img className='w-60 object-cover py-1' src={message.img}/>
                    {message.text&&<p className='text-white  max-w-max'>{message.text}</p>} 
                </div>}
            </div>
            <div className="flex h-8 bg-gray-700 rounded-lg">
                {message.senderID===user.uid&&<button className="hidden group-hover:block text-gray-400 hover:text-gray-600 p-1">
                    <PencilIcon className="h-5 w-5" 
                    onClick={()=>setEdit(true)}/>
                </button>}
            
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md shadow-lg bg-gray-600 ring-1 ring-black ring-opacity-5 focus:outline-none ">
                            <div className="py-1">
                                {!message.pinned&&<Menu.Item>
                                    {({ active }) => (
                                    <a
                                        href="#"
                                        onClick={()=>pinMsg(pid,channel,id, user.uid, userInfo.name)}
                                        className={classNames(
                                        active ? 'bg-gray-600 text-white' : 'text-gray-300',
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
                                        onClick={()=>unpinMsg(pid,channel,id)}
                                        className={classNames(
                                        active ? 'bg-gray-600 text-white' : 'text-gray-300',
                                        'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Unpin Message
                                    </a>
                                    )}
                                </Menu.Item>}
                                {message.senderID===user.uid&&<Menu.Item>
                                    {({ active }) => (
                                    <a
                                        href="#"
                                        onClick={()=>deleteMsg(pid,channel,id)}
                                        className={classNames(
                                        active ? 'bg-gray-600 text-white' : 'text-gray-300',
                                        'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Delete Messege
                                    </a>
                                    )}
                                </Menu.Item>}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
 
        </div> 
    </div>
    
  )
}

