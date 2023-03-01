import React, { useState, useEffect } from "react";
import Input from "../components/Input";
// import {Routes, Route, useNavigate} from 'react-router-dom';


const projectObj = {
  id: 1,
  name: 'ATestProject1',
  owner: 'Auden',
  members:['Auden',],
  skills:['skill1','skill2'],
  description:"This is a test project",
  avatar:
    'https://cdn-icons-png.flaticon.com/512/1087/1087815.png'
}
const projectObj2= {
    id:2,
    name: 'DevMatch',
    owner: 'John',
    members: ['John','Auden'],
    skills:['skill1','skill2'],
    description: "Description",
    avatar:'https://logopond.com/avatar/257420/logopond.png',
}
const projets = [
    projectObj,projectObj2
    // More projects
  ]

function manageProject() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">
                A list of all projects that you are in
            </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                type="button"
                className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Add Projects
            </button>
            </div>
        </div>
        <div className="mt-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                    <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
   
                    </th>
                    <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Owner
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Members
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Description
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Require Skills
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">leave</span>
                        <span className="sr-only">Edit</span>
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {projets.map((project) => (
                    <tr key={project.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                        <img className = "bg-white h-8 w-8 rounded-full object-cover"src={project.avatar}/>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {project.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{project.owner}</td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {project.members.map((member)=>
                        (<li key={member}>{member}</li>))}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                        {project.description}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {project.skills.map((skill)=>
                        (<li key={skill}>{skill}</li>))}
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 ">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {project.name}</span>
                        </a>
                        <a href="#" className="text-red-600 hover:text-indigo-900 p-2">
                            Remove<span className="sr-only">, {project.name}</span>
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    )   
}
export default manageProject
