import React from 'react'

function GCVoiceChannel({pid,channelID, selectedID, channelName}) {
  return (
    <div>
       {selectedID!==channelID ?<span className='group flex items-center hover:text-gray-200  rounded-lg text-gray-500 cursor-pointer'>
            <div className='flex items-center w-[calc(90%)]'
            onClick={()=>{}}>
                <span className='text-lg pl-4'>#</span>
                <p className=' pl-2 text-sm truncate '> {channelName} </p>
            </div>
        </span>:
        <span className='flex items-center text-gray-200  rounded-lg  cursor-pointer'>
            <span className='text-lg pl-4'>#</span>
            <p className=' pl-2 text-sm truncate '> {channelName} </p>
        </span>} 
    </div>
  )
}

export default GCVoiceChannel