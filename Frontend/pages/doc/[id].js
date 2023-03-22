import React, { useEffect, useState } from "react";
import Router from 'next/router';
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import TextEditor from "@/components/TextEditor";

function Doc() {
    const{id} =Router.query;
    const{user} = useAuth();
    const[document, setDoc] = useState(null)
    const getDoc  = () => 
    {
      const unSub = onSnapshot(doc(db, "userDocs", user.email), (doc) => 
      {
        doc.exists() && doc.data().docs.map((doc)=>{

            if(doc.id === id){setDoc(doc)}
        })
      });
      

      return () => 
      {
        unSub();
      };
    }
    useEffect(() => {
    id&& getDoc()  
    }, [id])

  return (
    <div>
        <header className='flex justify-between item-center p-3 pb-1'>
            <span onClick={()=> Router.push(`/account`)} className="cursor-pointer">
                <DocumentTextIcon className='fill-blue-500 h-12 w-10'/>
            </span>
            <div className="flex-grow px-2">
                {document&&<h2>{document.fileName}</h2>}
                <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600">
                    <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>File</p>
                    <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>Edit</p>
                    <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>View</p>
                    <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>Insert</p>
                    <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>Format</p>
                    <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>Tool</p>
                </div>
            </div>
        </header>
        <TextEditor/>

    </div>
  )
}

export default Doc