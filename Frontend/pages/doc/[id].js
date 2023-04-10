import { useEffect, useState } from "react";
import Router from "next/router";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { updateDoc, doc, getDocs, collection, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import TextEditor from "@/components/TextEditor";

function Doc() {
  const { id } = Router.query;
  const { user } = useAuth();
  const [document, setDoc] = useState(null);
  const [title, setTitle] = useState(null);
  const getDoc = async () => {
    const q = query(collection(db, "userDocs", user.email, "docs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        setDoc(doc.data());
        setTitle(doc.data().fileName);
      }
    });
  };
  useEffect(() => {
    id && getDoc();
  }, [id]);
  useEffect(() => {
    if (title !== null) {
      if (title !== "") {
        updateDoc(doc(db, "userDocs", user.email, "docs", id), {
          fileName: title,
        });
      } else {
        updateDoc(doc(db, "userDocs", user.email, "docs", id), {
          fileName: "Default Title",
        });
      }
    }
  }, [title]);

  return (
    <div>
      <header className='flex justify-between item-center p-3 pb-1'>
        <span
          onClick={() => Router.push(`/account`)}
          className='cursor-pointer'
        >
          <DocumentTextIcon className='fill-blue-500 h-12 w-10' />
        </span>
        <div className='flex-grow px-2'>
          {document && (
            <input
              type='text'
              placeholder='Title'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className='w-1/2 bg-transparent text-black border-none outline-none placeholder-gray-400 truncate'
            />
          )}
          <div className='flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600'>
            <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
              File
            </p>
            <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
              Edit
            </p>
            <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
              View
            </p>
            <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
              Insert
            </p>
            <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
              Format
            </p>
            <p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
              Tool
            </p>
          </div>
        </div>
      </header>
      <TextEditor />
    </div>
  );
}

export default Doc;
