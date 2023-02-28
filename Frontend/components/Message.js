import React, { useContext, useEffect, useRef } from "react";

export default function Message({ message }) {
    const ref = useRef();
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);
    const currentUser = {
        id: 1,
        name: "Auden",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8", 
    }
    const receiver = {
        id: 13,
        name: "Henry",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8", 
    }
  return (
    <div>
        {/* if it is receiver */}
        <div className='flex mb-5 gap-5 '> 
            <div className='info flex flex-col text-gray-300 font-light'>
                <img className='bg-white w-10 h-10 object-cover rounded-full' src={receiver.imageUrl}/>
                <span>just now</span>
            </div>
            <div className='content flex flex-col gap-2 max-w-[calc(80%)]'>
                <p className='bg-orange-100 text-black rounded-tl-none rounded-lg px-4 py-2 max-w-max'>this is a very very long message that will exceed the window length so it should go to another line</p>
                <img className='w-1/2' src="https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg"/>
            </div>
        </div> 
        {/* if it is sender */}
        <div className='flex mb-5 gap-5 flex-row-reverse'> 
            <div className='info flex flex-col text-gray-300 font-light'>
                <img className='bg-white w-10 h-10 object-cover rounded-full' src={currentUser.imageUrl}/>
                <span>just now</span>
            </div>
            <div className='content flex flex-col items-end gap-2 max-w-[calc(80%)]'>
                <p className='bg-blue-300 text-black rounded-tr-none rounded-lg px-4 py-2 max-w-max'>this is drom the user so should be on left</p>
                <img className='w-1/2' src="https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg"/>
            </div>
        </div> 
    </div>
    
  )
}

