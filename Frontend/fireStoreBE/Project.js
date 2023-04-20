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
import { deleteMS } from './Milestones';
import { delDoc } from './ProjDoc';
import { deleteChannel as  deleteVChannel} from './GCVoice';

export async function createProject(pid) {
  const data = {
    name: "main",
    dateCreated: serverTimestamp(),
  };
  await setDoc(doc(db, "Projects", pid),{})
  await setDoc(doc(db, "Projects", pid, "TextChannels", "main"), data);
}

export async function deleteProject(pid){
 
  const queryData = query(collection(db, "Projects", pid, "TextChannels"));
  const querySnapshot = await getDocs(queryData);
  querySnapshot.docs.forEach(channel =>(
    deleteChannel(pid, channel.id)
  ))
  const queryData2 = query(collection(db, "Projects", pid, "VoiceChannels"));
  const querySnapshot2 = await getDocs(queryData2);
  querySnapshot2.docs.forEach(channel =>(
    deleteVChannel(pid, channel.id)
  ))

  const queryMS = query(collection(db, "Projects", pid, "MileStones"));
  const querySnapshotMS = await getDocs(queryMS);
  querySnapshotMS.docs.forEach(milestone =>(
    deleteMS(pid, milestone.id)
  ))

  const queryDocs = query(collection(db, "Projects", pid, "Docs"));
  const querySnapshotDocs = await getDocs(queryDocs);
  querySnapshotDocs.docs.forEach(document =>(
    delDoc(pid, document.id)
  ))
  await deleteDoc(doc(db, "Projects", pid))
 
}