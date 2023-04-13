import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteChannel } from '@/fireStoreBE/GCMsg';


function GCTextChannel({pid,channelID, selectedID, channelName, setChannel, setID}) {
  return (
    <div>
        {selectedID!==channelID?<span className='group flex items-center hover:bg-gray-400 hover:text-gray-200  rounded-lg text-gray-500 cursor-pointer'>
            <div className='flex items-center w-[calc(90%)]'
            onClick={()=>{setChannel(channelName); setID(channelID)}}>
            <span className='text-lg pl-4'>#</span>
            <p className=' pl-2 text-sm truncate '> {channelName} </p>
            </div>
        {channelID!=="main"&&
        <TrashIcon 
        className='hidden group-hover:block w-5 h-5 text-red-800 hover:text-red-500'
        onClick={()=>deleteChannel(pid,channelID)}
        />}
        </span>:
        <span className='flex items-center bg-gray-500 text-gray-200  rounded-lg  cursor-pointer'>
        <span className='text-lg pl-4'>#</span>
        <p className=' pl-2 text-sm truncate '> {channelName} </p>
        </span>}
    </div>
  )
}
export default GCTextChannel