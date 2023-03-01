import React from 'react'
import Router from 'next/router';

export default function Project() {
    const proj = {
        name: 'DevMatch',
        owner: 'John Doe',
        description: 'Description',
        avatar:'https://logopond.com/avatar/257420/logopond.png',
        banner:'https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg',
        banner2:'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    }
    const redirectToProject=(id)=>{
        // Router.push("./projctSpace"+id);
        Router.push("/projectSpace");
    }
    return(
        <div className=''>
            {/* {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
            <div
                className="userChat"
                key={chat[0]}
                onClick={() => handleSelect(chat[1].userInfo)}
            >
                <img src={chat[1].userInfo.photoURL} alt="" />
                <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
                </div>
            </div>
            ))} */}
            <div className='flex p-2 items-center gap-2 hover:bg-blue-600'
             onClick={redirectToProject}>
                <img src ={proj.avatar} className='bg-white h-6 w-6 rounded-full object-cover'></img>
                <div className='info'>
                    <span className='text-lg font-medium'>{proj.name}</span>
                    <p className='text-sm text-gray-100'>{proj.description}</p>
                </div>
            </div>
        </div>)
}

