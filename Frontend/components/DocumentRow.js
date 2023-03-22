import React from 'react'
import Router from "next/router";
import {
    DocumentTextIcon,
    EllipsisVerticalIcon
  } from "@heroicons/react/24/outline";

function DocumentRow({id, fileName, date}) {
  return (
    <div onClick={()=> Router.push(`/doc/${id}`)} className='flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer'>
        <DocumentTextIcon className='fill-blue-500 h-6 w-6'/>
        <p className='flex-grow pl-5 w-10 pr-10 truncate'>{fileName}</p>
        <p className='pr-5 text-sm'>{date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
       
        <EllipsisVerticalIcon 
        // onClick={} 
        className=' h-6 hover:bg-gray-200'/>
        
    
    </div>
  )
}
export default DocumentRow