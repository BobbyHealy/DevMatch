import React from 'react'
import Router from "next/router";

const user = {
    name: "Auden Huang",
    imageUrl:
    "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
}

const redirecttoFeed= () => {
    Router.push('/feed');
}

export default function Navbar() {
  return (
    <div className='flex items-center h-12 p-2 justify-between bg-indigo-400 text-white'>
        <span className='font-bold'>DMs</span>
        <div className='flex h-12 p-2 gap-2  items-center gap-2' > 
            <img src ={user.imageUrl} className='bg-white h-6 w-6 rounded-full'></img>
            <span className='text-sm'> {user.name}</span>
            <button className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' onClick={()=> redirecttoFeed()}> exit</button>
        </div>
    </div>
  )
}
