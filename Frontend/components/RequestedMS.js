import React from 'react'
import { approveRequest, denyRequest } from '@/fireStoreBE/Milestones'
export default function RequestedMS({pid, MSID, title, assign, label}) {
  return (

    <div className='flex items-center bg-blue-500 h-12 '>
         <tbody className="w-full divide-y divide-gray-200 "> 
            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{title}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{label} task</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">done by {assign}</td>
            
         </tbody>
        <div className='absolute right-0 flex gap-2'>
        <button className='bg-green-400  rounded-lg w-24 h-8'
        onClick={()=>approveRequest(pid, MSID)}> Approve</button>
        <button className='bg-red-400  rounded-lg  w-24 h-8 mr-4'
        onClick={()=>denyRequest(pid, MSID)}> Decline</button>
        
        </div>
    
        
    </div>

  )
}
