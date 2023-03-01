import React from 'react'
import Messages from './Messages'
import ChatInput from './ChatInput'

export default function Chat() {
  return (
    <div className='flex-2 basis-3/4 bg-orange-300 '>
        <div className=' h-12 bg-orange-700 flex items-center justify-between p-2  gap-2'>
            <span> Reciever</span>
            <div className='flex gap-2'>
                <img className='h-6 cursor-pointer'></img>
            </div>

        </div>
        <Messages/>
        <ChatInput/>

    </div>
  )
}

