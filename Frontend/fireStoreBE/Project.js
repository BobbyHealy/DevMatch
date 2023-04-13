import { 
    updateDoc,
    doc,
    setDoc,
    deleteField,
    deleteDoc,
    Timestamp,
    serverTimestamp,
    query,
    collection,
    getDocs,
} from 'firebase/firestore'
import { db } from "../config/firebase";
import { deleteChannel } from './GCMsg';

export async function createProject(pid) {
  const data = {
    name: "main",
    dateCreated: serverTimestamp(),
  };
  await setDoc(doc(db, "GCs", pid),{})
  await setDoc(doc(db, "GCs", pid, "channels", "main"), data);
}

export async function deleteProject(pid){
  await deleteDoc(doc(db, "GCs", pid))
  const queryData = query(collection(db, "GCs", pid, "channels"));
  const querySnapshot = await getDocs(queryData);
  querySnapshot.docs.forEach(channel =>(
    deleteChannel(pid, channel.id)
  ))

  
}