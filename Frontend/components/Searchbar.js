import React from 'react'

export default function Searchbar() {
  return (
    <div className='search border-b-2 border-gray-400'>
        <div className='searchForm p-2'>
            <input type="text" className='bg-transparent border-none outline-none text-white placeholder-gray-300' placeholder='search for a user'/>
        </div>
        {/* <div className='userChat flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ="" className='bg-white h-6 w-6 rounded-full'></img>
            <div className='info'>
                <span className='text-lg font-medium'>Name</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div> */}
    </div>
  )
}
