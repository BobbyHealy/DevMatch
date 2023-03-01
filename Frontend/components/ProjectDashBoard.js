import React from 'react'
import ProjectSearchBar from './ProjectSearchBar'
import Project from './Project'
export default function ProjectDashBoard() {
    const project = {
        name: 'DevMatch',
        owner: 'John Doe',
        avatar:'https://logopond.com/avatar/257420/logopond.png',
        banner:'https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg',
        banner2:'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    }
  return (
    <div className='flex justify-center h-full content-center'>
        <div className='bg-blue-300'>
            <ProjectSearchBar/>
            <Project/>
        </div>
    </div>
  )
}
