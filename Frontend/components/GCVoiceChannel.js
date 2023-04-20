import dynamic from 'next/dynamic'
import { useEffect } from 'react';
const VCRoom = dynamic(() => import('@/components/VCRoom'), { ssr: false });


function GCVoiceChannel({channelID, selectedID, channelName, setJoined, setChannel, joined}) {
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
        {console.log(channelID)}
        {selectedID===channelID &&<VCRoom roomId={channelID} setJoined={setJoined} setChannel={setChannel}/> }
        
    </div>
  )
}

export default GCVoiceChannel