import { useEffect, useState } from "react";
import Router from 'next/router';
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { 
    updateDoc,
    doc, 
    getDocs,
    collection,
    query,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import ProjTextEditor from "@/components/ProjTextEditor";


function ProjDoc() {

    const[ids, setIds]= useState(null);
    const[pid, setPid]= useState(null);
    const[docId, setDocId] = useState(null);

    useEffect(()=>{
        setIds(Router.query.id.split("DocId="))

    },[])

    useEffect(()=>{
        if(ids)
        {
            setPid(ids[0])
            setDocId(ids[1])
        }
    },[ids])
    const{user} = useAuth();
    const[document, setDoc] = useState(null)
    const[title, setTitle] = useState(null)
    const getDoc  = async() => 
    {
        const q = query(
            collection(db, "projDocs", pid,"docs")
          );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>
        {
            if(doc.id === docId)
            {
                setDoc(doc.data())
                setTitle(doc.data().fileName)
            }
        })
    }
    useEffect(() => 
    {
        pid&& getDoc()  
    }, [pid])
    useEffect(() => 
    {

        if(title!==null){
            if(title!=="")
            {
                updateDoc(doc(db, "projDocs", pid,"docs",docId), {
                    fileName: title
                  });

            }
            else{
                updateDoc(doc(db, "projDocs", pid,"docs",docId), {
                    fileName: "Default Title"
                  });
 
            }
            
        }

    }, [title])
    

  return (
    <div>
        <header className='flex justify-between item-center p-3 pb-1'>
            <span onClick={()=> Router.push(`/project?pid=${pid}`)} className="cursor-pointer">
                <DocumentTextIcon className='fill-blue-500 h-12 w-10'/>
            </span>
            <div className="flex-grow px-2">
                {document&&<input type="text" placeholder='Title'  onChange={(e)=> setTitle(e.target.value)}  value={title} className='w-1/2 bg-transparent text-black border-none outline-none placeholder-gray-400 truncate' />}
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
        <ProjTextEditor pid={pid} docId={docId}/>
    </div>
  )
}

export default ProjDoc