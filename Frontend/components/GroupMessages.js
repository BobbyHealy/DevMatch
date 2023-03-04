import React from 'react'
import Message from './Message'

export default function GroupMessages() {
  return (
    <div className='bg-gray-100 text-gray-400 p-2 overflow-scroll h-[calc(100vh-135px)] '>
        <Message/>
    </div> 
  )
}
