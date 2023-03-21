import React,{useState, useEffect}from 'react'
import GroupMessages from './GroupMessages'
import GroupChatInput from './GroupChatInput';
import { useRouter } from 'next/router';


export default function GC() {
  
  const router = useRouter();
  const { pid } = router.query;
  const [project, setProject] = useState("");
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/getProject", requestOptions)
      .then((response) => response.text())
      .then((result) => setProject(JSON.parse(result)))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className='h-[calc(100vh)] bg-gray-100 '>
      <div className='flex-2 basis-3/4 bg-gray-500 '>
          <div className=' h-12 flex items-center justify-between p-2  gap-2'>
              <img src= {project.projectProfile}
              className='bg-white h-8 w-8 rounded-full'/>
              <span>{project.name}</span>
              <div className='flex gap-2'>
                  <img className='h-6 cursor-pointer'></img>
              </div>

          </div>
          <GroupMessages/>
          <GroupChatInput/>
      </div>
      
    </div>
  )
}

