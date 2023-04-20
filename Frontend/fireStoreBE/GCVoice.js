import { 
doc,
setDoc,
serverTimestamp,
deleteDoc,
} from 'firebase/firestore'
import { db } from "../config/firebase";

export async function addChannel(pid, channelID, title) 
{
  const data =
  {
    name: title,
    dateCreated: serverTimestamp()
  }
  await setDoc(doc(db, "Projects", pid, "VoiceChannels", channelID),data)
}
export async function deleteChannel(pid, channelID){
  await deleteDoc(doc(db, "Projects", pid, "VoiceChannels", channelID));
}

