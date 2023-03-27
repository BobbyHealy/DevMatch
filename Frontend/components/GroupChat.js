import React,{useEffect} from "react";
import GC from "./GC";
import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";
export default function GroupChat({pid,project}) {
  const{user}= useAuth();
  useEffect(() => {
    if(user.uid)
    {
      updateDoc(doc(db, "users", user.uid), {
        currentProjPage:"#GC"
      })
    }
  }, [])
  return (
    <div>
        <GC pid={pid} project={project}/>
    </div>
  )
}
