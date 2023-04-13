import {useEffect} from "react";
import GC from "./GC";
import { useAuth } from "@/context/AuthContext";
import { switchProjPage } from "@/fireStoreBE/User";
export default function GroupChat({pid,project}) {
  const{user}= useAuth();
  useEffect(() => {
    if(user.uid)
    {
      switchProjPage(user.uid, "#GC")
    }
  }, [])
  return (
    <div>
        <GC pid={pid} project={project}/>
    </div>
  )
}
