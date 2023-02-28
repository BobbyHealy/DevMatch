import React from 'react'
import Sidebar from '@/components/Sidebar'
import Chat from '@/components/Chat'

export default function dm() {
  return (
    <div className='fixed top-0 left-0 right-0 h-full bg-orange-100'>
        <div className='flex justify-center h-full content-center '>
            <div className= "flex border border-white rounded-lg w-11/12 h-5/6 overflow-hidden">
               
            <Sidebar/>
            
            <Chat/>

            </div>
        </div>
    </div>
  )
}


