import React, { useState, useEffect } from "react";
import Input from "../components/Input";
// import {Routes, Route, useNavigate} from 'react-router-dom';



const projectObj = {
  id: 1,
  owner: 'Auden',
  name: 'ATestProject1',
  members:['Auden'],
  description:"This is a test project",
  imageUrl:
    'https://cdn-icons-png.flaticon.com/512/1087/1087815.png'
}

function manageProject() {
    // const navigate = useNavigate();
    const [project, setProject] = useState(projectObj);
    {/*ToDO: fetch project */};
  
    const handleInput = (e) => {
      console.log(e.target.name, " : ", e.target.value);
      setProject({ ...project, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();  
      {/*update database */}
    };
    const routeChange = () =>{ 
        let path = `/account/profile`; 
        navigate(path);
      }

  return (
    <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-full bg-white">
        <h1 className="text-center">{project.name}</h1>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md scroll-smooth">
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit}>
                        Name:  
                    <Input
                        name="name"
                        type="text"
                        value={project.name}
                        placeholder={"Project name"}
                        handleInput={handleInput}
                    />
                    <br />
                    Owners: {project.owner}
                    <br/>
                    Members: {project.members}
                    <br />
                    Description: 
                    <Input
                        name="description"
                        type="text"
                        value={project.description}
                        placeholder={"Discription"}
                        handleInput={handleInput}
                    />

                    <div>
                        <button
                        type='submit'
                        className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        >
                        Update {/* TODO: Add functionality from backend*/}
                        </button>
                    </div>
                    
                    </form>
                </div>
            </div>
        </div>
  </div>
  );
}
export default manageProject
