import Messages from './Messages'
import ChatInput from './ChatInput'

export default function Chat({receiver,DMID, open}) {

  return (
    
    <div className='flex-2 basis-3/4'>
        {<Messages DMID={DMID} open={open} receiver ={receiver}/>}
        <div className="px-2">
        <ChatInput DMID={DMID} receiver ={receiver}/>
        </div>

    </div>
  )
}

