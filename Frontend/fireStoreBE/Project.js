import { 
    updateDoc,
    doc,
    setDoc,
    deleteField,
    deleteDoc,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from "../config/firebase";

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
}