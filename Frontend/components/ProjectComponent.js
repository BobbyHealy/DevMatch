import { Fragment, useState,useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import ProjectModal from "./ProjectModal";



const default_project = {
  name: "The project",
  owners: ["1029292"],
  members: ["1212121", "423432423243", "42343243423"],
  skills: ["JavaScript", "HTML"],
  avatar: "https://logopond.com/avatar/257420/logopond.png",
  profile_picture:
    "https://i.pinimg.com/474x/97/aa/84/97aa847d061a14894178805f1d551500.jpg",
  banner_picture:
    "https://t4.ftcdn.net/jpg/04/95/28/65/360_F_495286577_rpsT2Shmr6g81hOhGXALhxWOfx1vOQBa.jpg",
};

export default function ProjComponent(props) {
  const { project = default_project, ...restProps } = props;
  const { user } = useAuth();
  const [owners, setOwners]=useState([])
  const [load, setload] =useState(false)
  const [members, setMembers]=useState([])
  const [otherMembers, setOtherMembers] = useState([])
  const [showModal, setShowModal] = useState(false);
  function addOwner(name){
        
    if(owners!==null)
    {
        var newList = [...owners,name]
        setOwners(newList)
    }else
    {
      setOwners([name])
    }
  }
  function addOtherMember(name){
        
    if(otherMembers!==null)
    {
        var newList = [...otherMembers,name]
        setOtherMembers(newList)
    }else
    {
      setOtherMembers([name])
    }
  }
  function addMember(name){
        
    if(members!==null)
    {
        var newList = [...members,name]
        setMembers(newList)
    }else
    {
      setMembers([name])
    }
  }
  function getOwner(id){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        userID: id,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/getUser", requestOptions)
      .then((response) => response.text())
      .then((result) => 
      {
        addOwner(JSON.parse(result).name)
    }
      )
      .catch((err) => {
        console.log(err);
      });

}
function getMember(id){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
      userID: id,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  fetch("http://localhost:3000/api/getUser", requestOptions)
    .then((response) => response.text())
    .then((result) => 
    {
      addMember(JSON.parse(result).name)
  }
    )
    .catch((err) => {
      console.log(err);
    });

}
useEffect(() => {

  if(!load&&project.owners)
  {
    project.owners.map((owner)=>{getOwner(owner)})
    project.tmembers.map((mem)=>{getMember(mem)})
    setload(true)
    
  }
}, [project])
useEffect(() => {
  if(load)
  {
    console.log(members)
    members.map((mem)=>{
      console.log(mem);
      if(!mem.includes(owners))
      {
        addOtherMember(mem)
      }})
    console.log()
  }
}, [load])


  const handleJoinProject = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      uid: user.uid,
      pid: project.pid,
      isOwner: false,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/joinProject", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setUserInfo(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <div className='bg-grey rounded-lg'>
      <h1>
        <img
          className='h-18 w-full object-cover lg:h-24 rounded-t-lg'
          src={project.projectBannerPic}
          alt=''
        />
      </h1>
      <div className='bg-white px-4 py-5 sm:py-6 rounded-lg'>
        <div className='flex space-x-3'>
          <div className='flex-shrink-0'>
            <img
              className='h-10 w-10 rounded-full'
              src={project.projectProfile}
              alt=''
            />
          </div>
          <div className='min-w-0 flex-1 space-y-1'>
            <p className='text-sm font-semibold text-gray-900'>
              <a href='#' className='hover:underline'onClick={() => setShowModal(true)}>
                {project.name}
              </a>
            </p>
            <p className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                Owner:{" "}
                {owners!==null? owners.map((owner)=><span>{owner}</span>) : "N/a"}
              </a>
            </p>
            <p className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                Project Type:{" "}
                {project.type}
              </a>
            </p>
            <div className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                Skills Needed:{" "}
                {project.skills !== undefined
                  ? project.skills.map((e, i) => <p key={i}>{e + " "}</p>)
                  : "N/a"}
              </a>
            </div>
            <div className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                Other members:{" "}
                {otherMembers.length!==0? otherMembers.map((mem)=><span>{mem}</span>) : "N/a"} 
              </a>
            </div>
          </div>
          <div className='flex flex-shrink-0 self-center'>
            <button
              type='button'
              onClick={() => handleJoinProject()}
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Join
              <UserGroupIcon
                className='ml-2 -mr-1 h-5 w-5'
                aria-hidden='true'
              />
            </button>
          </div>
          <div className='flex flex-shrink-0 self-center'>
            <button
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Message
              <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
      <ProjectModal isVisible={showModal} onClose={() => setShowModal(false)}>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <h1>
                <img
                  className='h-18 w-full object-cover lg:h-24 rounded-t-lg'
                  src={project.projectBannerPic}
                  alt=''
                />
              </h1>
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">{project.name}</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Project Owner</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{" "}
                      {owners!==null? owners.map((owner)=><span>{owner}</span>) : "N/a"} </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Looking for</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{" "}
                      {project.skills !== undefined
                        ? project.skills.map((e, i) => <p key={i}>{e + " "}</p>)
                        : "N/a"}</dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Other members</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{" "}
                    {otherMembers.length!==0? otherMembers.map((mem)=><span>{mem}</span>) : "N/a"} 

                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Expected hours per week</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">30</dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Project Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {project.type}
                      </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Project Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {project.projectDes}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
      </ProjectModal>
    </div>
  );
}
