import { Fragment, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";
import { storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";


export default function Overview() {
  const project = {
    name: "DevMatch",
    owner: "John Doe",
    avatar: "https://logopond.com/avatar/257420/logopond.png",
    banner:
      "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg",
    banner2:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description: "Description",
    type: "type"
  };
  const[icon, setIcon] = useState(null)
  const[iconURL, setIconUrl] = useState(null)
  const[banner, setBanner] = useState(null)
  const[bannerURL, setBannerURL] = useState(null)
  const [newSkills, setNewSkills] = useState();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [projectD, setProject] = useState("");
  const router = useRouter();
  const { pid } = router.query;
  const{user}=useAuth();
  const [owners, setOwners]=useState([])
  const [load, setload] =useState(false)
  const [members, setMembers]=useState([])
  useEffect(() => {
    if(user.uid)
    {
      updateDoc(doc(db, "users", user.uid), {
        currentProjPage:"#Overview"
      })
    }
  }, [])
  
  

  function refreshPage() {
    window.location.reload(false);
  }
  useEffect(() => {
    updateDoc(doc(db, "users", user.uid), {
      currentPage:"Overview"
    })
  }, [user.uid])



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
  useEffect(() => {
    if(!load&&projectD.owners)
    { 
      setload(true)
      var owners =[]
      var members =[]
      projectD.owners.map((owner)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            userID: owner,
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
            owners.push(JSON.parse(result).name)
            if(projectD.owners.length===owners.length)
            {
              setOwners(owners)
            }
          }
          )
          .catch((err) => {
            console.log(err);
          });
      })
      projectD.tmembers.map((mem)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            userID: mem,
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
            members.push(JSON.parse(result).name)
            if(projectD.tmembers.length===members.length)
            {
              setMembers(members)
            }
          }
          )
          .catch((err) => {
            console.log(err);
          });
      })

    }

  }, [projectD]);


  useEffect(() => {
    setNewSkills(
      projectD.skills !== undefined ? projectD.skills.join(",") : []
    );
    setName(projectD.name);
  }, [projectD]);

  const [des, setDes] = useState(projectD.projectDes);
  const handleEdit = () => {
    setEdit(true);
  };
  useEffect(() => {
    if (!icon) {
        setIconUrl(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(icon)
    setIconUrl(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [icon])
useEffect(() => {
  if (!banner) {
      setBannerURL(undefined)
      return
  }

  const objectUrl = URL.createObjectURL(banner)
  setBannerURL(objectUrl)

  // free memory when ever this component is unmounted
  return () => URL.revokeObjectURL(objectUrl)
}, [banner])

  const handleSubmit = async (e) => {

    if(!icon&&!banner)
    {

      const skillsArr = newSkills.split(",");
      var raw = JSON.stringify({
        pid: pid,
        name: name,
        skills: skillsArr,
        tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
        owners: projectD.owners !== undefined ? projectD.owners : undefined,
        projectProfile:
          projectD.projectProfile !== undefined
            ? projectD.projectProfile
            : undefined,
        projectBannerPic:
          projectD.projectBannerPic !== undefined
            ? projectD.projectBannerPic
            : undefined,
        projectDes: des !==undefined? des: projectD.projectDes,
        type: projectD.type !== undefined? projectD.type : undefined,
        
      });


      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      fetch("http://localhost:3000/api/addProject", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          refreshPage()
          setEdit(false);
        })
        .catch((error) => console.log("error", error));
    }
    else if(!banner)
    {
      var imageRef = ref(storage, name+"Icon")
      uploadBytes(imageRef, icon).then(()=>{
        getDownloadURL(imageRef).then((url)=>{
          const skillsArr = newSkills.split(",");
      var raw = JSON.stringify({
        pid: pid,
        name: name,
        skills: skillsArr,
        tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
        owners: projectD.owners !== undefined ? projectD.owners : undefined,
        projectProfile: url,
        projectBannerPic: projectD.projectBannerPic !== undefined
        ? projectD.projectBannerPic
        : undefined,
        projectDes: des !==undefined? des: projectD.projectDes,
        type: projectD.type !== undefined? projectD.type: undefined,
      });

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      fetch("http://localhost:3000/api/addProject", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          refreshPage()
          setEdit(false);
        })
        .catch((error) => {});
        })
      })


    }
    else if(!icon)
    {
 
      var imageRef = ref(storage, name+"Banner")
      uploadBytes(imageRef, banner).then(()=>{
        getDownloadURL(imageRef).then((url)=>{
          const skillsArr = newSkills.split(",");
          var raw = JSON.stringify({
            pid: pid,
            name: name,
            skills: skillsArr,
            tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
            owners: projectD.owners !== undefined ? projectD.owners : undefined,
            projectProfile:
              projectD.projectProfile !== undefined
                ? projectD.projectProfile
                : undefined,
            projectBannerPic: url,
            projectDes: des !==undefined? des: projectD.projectDes,
            type: projectD.type !== undefined? projectD.type: undefined,
          });

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
          };

          fetch("http://localhost:3000/api/addProject", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              refreshPage()
              setEdit(false);
            })
        .catch((error) => console.log("error", error));

        })
      })
    }
    else{

      var imageRef = ref(storage, name+"Icon")
      var imageRef2 = ref(storage, name+"Banner")
      uploadBytes(imageRef, icon).then(()=>{
        uploadBytes(imageRef2, banner).then(()=>{
          getDownloadURL(imageRef).then((url1)=>{
          
            getDownloadURL(imageRef2).then((url2)=>{
            const skillsArr = newSkills.split(",");
            var raw = JSON.stringify({
              pid: pid,
              name: name,
              skills: skillsArr,
              tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
              owners: projectD.owners !== undefined ? projectD.owners : undefined,
              projectProfile: url1,
              projectBannerPic: url2,
              projectDes: des !==undefined? des: projectD.projectDes,
              type: projectD.type !== undefined? projectD.type: undefined,
            });
  
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      
            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
            };
  
            fetch("http://localhost:3000/api/addProject", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              refreshPage()
              setEdit(false);
            })
            .catch((error) => console.log("error", error));

            })
          })
          
        }
        )

      })

    }
    setIcon(null)
    setBanner(null)
    setDes(undefined)
  };

  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <>
      <div>
          
            <main className='flex-1'>

              <div className='py-6'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                  <div className=''>
                    {!edit&&<img
                      className='h-32 w-full object-cover lg:h-48'
                      src={projectD.projectBannerPic}
                      alt=''
                    />}
                    {edit&&<img
                      className='h-32 w-full object-cover lg:h-48'
                      src={bannerURL}
                      alt=''
                    />}

                  </div>
                  <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
                    <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
                      <div className='flex'>
                        {!edit&&<img
                          className='h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32'
                          src={projectD.projectProfile}
                          alt=''
                        />}
                        {edit&&<img
                          className='h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32'
                          src={iconURL}
                          alt=''
                        />}
                        {edit && (
                          <InputText
                            type='file'
                            onChange={(event) => {
                              const file = event.target.files[0];
                              setBanner(file)
                              
                            }}
                          />
                        )}
                      </div>

                      <div className='mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
                        {!edit && (
                          <div className='mt-6 min-w-0 flex-1 sm:hidden 2xl:block'>
                            <h1 className='truncate text-2xl font-bold text-gray-900'>
                              {projectD.name}
                            </h1>
                          </div>
                        )}
                        {edit && (
                          <div className='mt-6 min-w-0 flex-1 sm:hidden 2xl:block'>
                            <input
                              type='text'
                              className='truncate text-2xl font-bold text-gray-900  placeholder-gray-300'
                              placeholder={projectD.name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {!edit && (
                      <div className='mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden'>
                        <h1 className='truncate text-2xl font-bold text-gray-900'>
                          {projectD.name}
                        </h1>
                      </div>
                    )}
                    {edit && (
                      <div className='mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden'>
                        <InputText
                          type='file'
                          accept='*.jpg'
                          onChange={(event) => {
                            const file = event.target.files[0];
                            setIcon(file)
                          }}
                        />
                        <input
                          type='text'
                          className='truncate text-2xl font-bold text-gray-900  placeholder-gray-300'
                          placeholder={projectD.name}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {!edit && (
                  <div className='mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
                    <span className='' onClick={handleEdit}>
                      {" "}
                      Edit Info
                    </span>
                    <dl className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2'>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Owner(s)
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                        {owners.length>0? owners.sort((a,b)=>
                        { if(a<b){ return -1}else{return 1}
                        }).map((owner)=><p>{owner}</p>) : <p>N/a</p>}
                        </dd>
                      </div>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Members
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                        {
                          members.length>1? 
                          members.sort((a,b)=>
                          { if(a<b){ return -1}else{return 1}
                          }).map((mem)=>
                          (!owners.includes(mem)&&<p key={mem}>{mem}</p>)) 
                          : <p>N/a</p>
                        }
                        </dd>
                      </div>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Type
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                        {projectD.type? projectD.type: "N/a"} 
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          About
                        </dt>
                        <dd
                          className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'
                          dangerouslySetInnerHTML={{
                            __html: projectD.projectDes,
                          }}
                        />
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Require Skill
                        </dt>
                        <dd className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'>
                          {projectD.skills !== null
                            ? projectD.skills !== undefined
                              ? projectD.skills.join(", ")
                              : "N/a"
                            : "N/a"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
                {edit && (
                  <div className='mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
                    <div className='flex h-12 p-2 gap-2  items-center gap-2'>
                      <button
                        className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        onClick={handleSubmit}
                      >
                        {" "}
                        Submit
                      </button>
                      <button
                        className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        onClick={handleCancel}
                      >
                        {" "}
                        Cancel
                      </button>
                    </div>
                    <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Owner(s)
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                        {owners.length>0? owners.sort((a,b)=>
                        { if(a<b){ return -1}else{return 1}
                        }).map((owner)=><p>{owner}</p>) : <p>N/a</p>}
                        </dd>
                        <button className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                          {" "}
                          Transfer Ownership
                        </button>
                      </div>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Members
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                        {
                          members.length>1? 
                          members.sort((a,b)=>
                          { if(a<b){ return -1}else{return 1}
                          }).map((mem)=>
                          (!owners.includes(mem)&&<p key={mem}>{mem}</p>)) 
                          : <p>N/a</p>
                        }
                        </dd>
                      </div>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Type
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                        {projectD.type} 
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          About
                        </dt>
                        <dd className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'>
                          {" "}
                          <input
                            type='text'
                            className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                            placeholder={project.description}
                            onChange={(e) => setDes(e.target.value)}
                          />
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Require Skill
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          <input
                            type='text'
                            className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                            placeholder={projectD.skills}
                            value={newSkills}
                            onChange={(e) => setNewSkills(e.target.value)}
                          />
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </main>
        </div>
    </>
  );
}
