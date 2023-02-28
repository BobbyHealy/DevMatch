import React from 'react'
import Message from './Message'
export default function Messages() {
  return (
    <div className='bg-orange-500 text-gray-400 p-2 overflow-scroll h-[calc(100vh-257px)]'>
        <Message/>
        <Message/>
        <Message/>
        <Message/>

    </div>
  )
}
