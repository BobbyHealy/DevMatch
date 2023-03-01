import React,{ useRef, useState }  from 'react'
import Router from 'next/router';

export default function Projects() {
    const proj1 = {
        index: 1,
        name: 'DevMatch1',
        owner: 'John Doe',
        description: 'Description',
        avatar:'https://logopond.com/avatar/257420/logopond.png',
        banner:'https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg',
        banner2:'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    }
    const proj2 = {
        index: 2,
        name: 'DevMatch2',
        owner: 'John Doe',
        description: 'Description',
        avatar:'https://logopond.com/avatar/257420/logopond.png',
        banner:'https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg',
        banner2:'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    }
    const [projects, setProjects] =useState([proj1, proj2])
    const redirectToProject=(id)=>{
        // Router.push("./projctSpace"+id);
        Router.push("/projectSpace");
    }
    const dragOverItem = useRef();
    const dragItem = useRef();
    const dragStart = (e, position) => {
        dragItem.current = position;
        console.log(e.target.innerHTML);
      };
    const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
    };
    const drop = (e) => {
        const copyProjects = [...projects];
        const dragItemContent = copyProjects[dragItem.current];
        copyProjects.splice(dragItem.current, 1);
        copyProjects.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setProjects(copyProjects);
      };
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
            
            {projects.map((project, index)=>(
                <div className='flex p-2 items-center gap-2 hover:bg-blue-600'
                onClick={redirectToProject}
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={drop}
                key={project.index}
                draggable
                >
                    <img src ={project.avatar} className='bg-white h-6 w-6 rounded-full object-cover'></img>
                    <div className='info'>
                        <span className='text-lg font-medium'>{project.name}</span>
                        <p className='text-sm text-gray-100'>{project.description}</p>
                    </div>
                </div>))}
        </div>)
}

