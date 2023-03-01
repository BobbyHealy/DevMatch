import React from 'react'
import Navbar from './Navbar'
import Searchbar from './Searchbar'
import Chats from './Chats'


export default function Sidebar() {
  return (
    <div className='bg-indigo-500 basis-1/4'>
        <Navbar/>
        <Searchbar/>
        <Chats/>
    </div>
  )
}

