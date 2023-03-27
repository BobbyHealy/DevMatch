import React, {useState}from 'react'
import Navbar from './Navbar'
import Searchbar from './Searchbar'
import Chats from './Chats'


export default function Sidebar() {
  const[search,setSearch]=useState(false)
  return (
  
    <div className='h-[calc(100vh-190px)]'>
          <div onClick={()=>setSearch(true)}>
          <Searchbar search={search}/>
          </div>
          <div className='overflow-y-scroll' onClick={()=>setSearch(false)}>
            <Chats/>
          </div>
    </div>
  )
}

