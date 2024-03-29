import {useEffect, useState}from 'react'
import Router from "next/router";
import {
  DocumentTextIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import {   Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { delDoc } from '@/fireStoreBE/UserDoc';


function DocumentRow({id, fileName, lastEdit,date}) {
  const  dateTime =lastEdit?.toDate().toLocaleString('en-US').split(",")
  const [time, setTime] = useState()
  const today = new Date(Timestamp.now().toDate().toLocaleString('en-US').split(",")[0])
  const diff =(lastEdit?.toDate()- today)
  const [open ,setOpen] = useState(false)
  const {user}=useAuth()
  
  useEffect(() => {
    if(dateTime)
    {
      const  times = dateTime[1].split(":")
      setTime(times[0]+":"+times[1]+" "+times[2].split(" ")[1])
    }

  }, [dateTime])
  
  

  return (
  
    <div className='flex '>
      <div onClick={()=> Router.push(`/doc/${id}`)} className=' flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer w-11/12'>
          <DocumentTextIcon className='fill-blue-500 h-6 w-6'/>
          <p className='flex-grow pl-5 w-10 pr-10 truncate '>{fileName}</p>
          {diff>0&&<p className='mr-14 flex-col text-sm'>{time}</p>}
          {diff<0&&<p className='mr-12 flex-col text-sm'>{dateTime[0]}</p>}

          <p className='text-sm'>{date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
      </div>
      <div  onMouseLeave={() => setOpen(false)} className='p-4'>
        
      {!open&&<EllipsisVerticalIcon 
        onMouseOver={()=>setOpen(true)}
        className=' h-6 hover:bg-gray-200 cursor-pointer'/>}
        <ul
             
            className={`  w-12 py-2 mt-2 rounded-lg shadow-xl ${
              open ? "block" : "hidden"
            }`}
          >
            <li onClick={()=>delDoc(user.email,id)}
            className="flex w-full items-center px-2 py-2 text-xs text-red-600 hover:bg-gray-100">
              delete
            </li>
 
          </ul>

      </div>

    </div>
  )

}
export default DocumentRow