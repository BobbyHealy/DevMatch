import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {doc,
    updateDoc,
    query,
    serverTimestamp,
    setDoc,
    getDocs,
    collection,} from "firebase/firestore";
import { db } from "@/config/firebase";
import Router from 'next/router';
import ProjDocRow from "./ProjDocRow";
export default function ProjectDocs() {
    const { pid } = Router.query;
    const {user, userInfo} = useAuth()
    const [showModal, setShowModal] = useState(false);
    const [input, setInput]= useState("")
    const [snap, setSnap]= useState()
    const [sortByCreate, setCreate]= useState(false)
    const [sortByName, setName]= useState(false)
    const [sortByEdit, setEdit]= useState(true)
    const [createNew, setCreateNew] = useState(false)
    const [editNew, setEditNew] = useState(true)
    const [nameNew, setNameNew] = useState(false)
    const [project, setProject] = useState("");
    useEffect(() => {
        if(user.uid)
        {
          updateDoc(doc(db, "users", user.uid), {
            currentProjPage:"#Docs"
          })
        }
      }, [])
    const fetchDoc  = async () => 
    {
      const q = query(
        collection(db, "projDocs", pid,"docs")
      );
      const querySnapshot = await getDocs(q);
      setSnap(querySnapshot)
    }
    useEffect(() => 
    {
      pid&&fetchDoc()
      console.log(pid)
    }, [pid]);
    useEffect(() => {

    }, [project]);
    const onclickCreate = () =>{
        if(!sortByCreate)
        {
          setCreate(true)
          setName(false)
          setEdit(false)
          setCreateNew(true)
    
        }else
        {
          if(createNew)
          {
            setCreateNew(false)
          }else
          {
            setCreateNew(true)
          }
        }
   
      }
      const onclickEditDate = () =>{
        if(!sortByEdit)
        {
          setCreate(false)
          setName(false)
          setEdit(true)
          setEditNew(true)
        }else
        {
          if(editNew)
          {
            setEditNew(false)
          }else
          {
            setEditNew(true)
          }
        }
      }
      const onclickName = () =>{
        if(!sortByName)
        {
          setCreate(false)
          setName(true)
          setEdit(false)
          // setNameNew(true)
        }else
        {
          // if(nameNew)
          // {
          //   setNameNew(false)
          // }else
          // {
          //   setNameNew(true)
          // }
        }
      }
      const createDocument =async ()=>
      {
          if(!input) return;
          const data =
          {
            fileName: input,
            time: serverTimestamp(),
            lastEdit: serverTimestamp()
          }
          await setDoc(doc(db, "projDocs", pid, "docs", input ),data)
        //   Router.push(`/doc/${input}`)
          setInput("")
          setShowModal(false)
      };

  return (
    <div>
        <section className='bg-[#F8F9FA] pb-10 px-10'>
            <div className='max-w-3xl mx-auto'>
                <div className='flex item-center justify-between py-6'>
                    <h2 className='text-lg'>
                        Start a New Document
                    </h2>
                </div>
                <div>
                    <div className='relative h-52 w-40 object-cover cursor-pointer hover:border-blue-700 border-transparent border-2' onClick={() => setShowModal(true)}>
                        <img src='https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/newDoc.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'/>
                    </div>
                </div>
            </div>
            {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none" >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">Creating New Document</h3>
                </div>
                <div className="relative p-6 flex-auto">
                    <label className="block text-black text-sm font-bold mb-1">
                      Title
                    </label>
                    <input value = {input} 
                    onChange={(e)=> setInput(e.target.value)}
                    type = "text"
                    onKeyDown={(e)=>e.key ==="Enter"&& createDocument()}
                    placeholder='Enter title of document...'
                    className="shadow appearance-none border rounded w-full py-2 px-1 text-black" 
                    />
                
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() =>  {setShowModal(false); setInput("")}}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => createDocument()}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
        </section>
        <section className=' bg-white px-10 md:px-0'>
            <div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
                <div className='flex items-center justify-between pb-5'>
                    <h2 onClick={onclickName}
                    className='font-medium flex-grow cursor-pointer'>
                        My Documents
                    </h2>
                    <p onClick={onclickEditDate}
                    className='mr-12 cursor-pointer'>
                        Last Edit
                    </p>
                    <p onClick={onclickCreate}
                    className='mr-8 cursor-pointer'>
                        Date Created
                    </p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-4">
                    <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                    </svg>
                </div>
            
            <div className='overflow-y-scroll'>
            {snap&&sortByEdit&&editNew&&Object.entries(snap.docs)?.sort((a,b)=>(b[1].data().lastEdit - a[1].data().lastEdit))
            .map((doc)=>(
              <ProjDocRow key = {doc[1].id} id ={doc[1].id} fileName ={doc[1].data().fileName} lastEdit ={doc[1].data().lastEdit}date = {doc[1].data().time}/>
            ))
            }
            {snap&&sortByEdit&&!editNew&&Object.entries(snap.docs)?.sort((a,b)=>(a[1].data().lastEdit - b[1].data().lastEdit))
            .map((doc)=>(
              <ProjDocRow key = {doc[1].id} id ={doc[1].id} fileName ={doc[1].data().fileName} lastEdit ={doc[1].data().lastEdit}date = {doc[1].data().time}/>
            ))
            }
            {snap&&sortByCreate&&createNew&&Object.entries(snap.docs)?.sort((a,b)=>(b[1].data().time - a[1].data().time))
            .map((doc)=>(
              <ProjDocRow key = {doc[1].id} id ={doc[1].id} fileName ={doc[1].data().fileName} lastEdit ={doc[1].data().lastEdit}date = {doc[1].data().time}/>
            ))
            }
            {snap&&sortByCreate&&!createNew&&Object.entries(snap.docs)?.sort((a,b)=>(a[1].data().time - b[1].data().time))
            .map((doc)=>(
              <ProjDocRow key = {doc[1].id} id ={doc[1].id} fileName ={doc[1].data().fileName} lastEdit ={doc[1].data().lastEdit}date = {doc[1].data().time}/>
            ))
            }
            {snap&&sortByName&&Object.entries(snap.docs)?.sort((a,b)=>(b[1].data().fileName -a[1].data().fileName))
            .map((doc)=>(
              <ProjDocRow key = {doc[1].id} id ={doc[1].id} fileName ={doc[1].data().fileName} lastEdit ={doc[1].data().lastEdit}date = {doc[1].data().time}/>
            ))
            }
            </div>
            </div>
        </section>

    </div>
  )
}
