import React from 'react'

export default function Chats() {
  return (
    <div className=''>
        <div className='flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ="" className='bg-white h-6 w-6 rounded-full object-cover'></img>
            <div className='info'>
                <span className='text-lg font-medium'>User1</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div>
        <div className='flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ="" className='bg-white h-6 w-6 rounded-full object-cover'></img>
            <div className='info'>
                <span className='text-lg font-medium'>User2</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div>
        <div className='flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ="" className='bg-white h-6 w-6 rounded-full object-cover'></img>
            <div className='info'>
                <span className='text-lg font-medium'>User3</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div>
    </div>
  )
}
