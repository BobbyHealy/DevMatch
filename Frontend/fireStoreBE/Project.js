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
import { deleteChannel } from './GCText';

export async function createProject(pid) {
  const data = {
    name: "main",
    dateCreated: serverTimestamp(),
  };
  await setDoc(doc(db, "GCs", pid),{})
  await setDoc(doc(db, "GCs", pid, "textChannels", "main"), data);
}

export async function deleteProject(pid){
 
  const queryData = query(collection(db, "GCs", pid, "textChannels"));
  const querySnapshot = await getDocs(queryData);
  querySnapshot.docs.forEach(channel =>(
    deleteChannel(pid, channel.id)
  ))
  const queryData2 = query(collection(db, "GCs", pid, "voiceChannels"));
  const querySnapshot2 = await getDocs(queryData2);
  querySnapshot2.docs.forEach(channel =>(
    // deleteChannel(pid, channel.id)
    console.log("TODO: added remove voice channel")
  ))
  await deleteDoc(doc(db, "GCs", pid))
}