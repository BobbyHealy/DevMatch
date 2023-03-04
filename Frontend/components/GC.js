import React from 'react'
import GroupMessages from './GroupMessages'
import ChatInput from './ChatInput'

export default function GC() {
  return (
    <div className='h-[calc(100vh)] bg-gray-100 '>
      <div className='flex-2 basis-3/4 bg-blue-300 '>
          <div className=' h-12flex items-center justify-between p-2  gap-2'>
              <span> Reciever</span>
              <div className='flex gap-2'>
                  <img className='h-6 cursor-pointer'></img>
              </div>

          </div>
          <GroupMessages/>
          <ChatInput/>
      </div>
      
    </div>
  )
}

