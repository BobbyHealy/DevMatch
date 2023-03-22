import React, {useEffect} from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";

export default function DMs() {
  const {user} = useAuth()
  useEffect(() => {
    updateDoc(doc(db, "users", user.uid), {
      currentPage:"DMs"
    })
  }, [user.uid])

  return (
    <div className=''>
      <div className='flex justify-center h-full content-center '>
        <div className='flex border border-white rounded-lg w-11/12 h-5/6 overflow-hidden'>
          
          <Sidebar />

          <Chat />
        </div>
      </div>
    </div>
  );
}
