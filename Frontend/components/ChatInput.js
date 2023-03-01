import React from 'react'

export default function ChatInput() {
    const handleSend = async () => {
        // update database
    }
    return (
        <div className='h-12 bg-orange-200 p-2 flex items-center justify-between'>
            <input type="text" placeholder='input' className='w-full bg-transparent text-gray-600 text-lg border-none outline-none placeholder-gray-400'/>
            <div className='flex items-center gap-2'>
                <img className='h-6 cursor-pointer' src=""/>
                {/* attach icon */}
                <input type="file" style={{display:"none"}} id="file" />
                <label htmlFor='file'>
                    <img className='h-6 cursor-pointer' csrc=''/>
                    {/* image icon*/}
                </label>
                <button className='border-none text-black bg-orange-300 cursor-pointer px-4 py-2'
                onClick={handleSend}
                > Send</button>
            </div>

        </div>
    )
}
   