import React from 'react'
import Router from "next/router";
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const{user, userInfo} = useAuth();
  return (
    <div className='flex items-center h-12 p-2 justify-between bg-indigo-400 text-white'>
        <span className='font-bold'>DMs</span>
        <div className='flex h-12 p-2 gap-2  items-center gap-2' > 
            <img src ={userInfo.profilePic} className='bg-white h-6 w-6 rounded-full'></img>
            <span className='text-sm'> {userInfo.name}</span>
           
        </div>
    </div>
  )
}
