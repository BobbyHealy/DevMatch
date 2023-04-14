import { 
doc,
setDoc,
serverTimestamp,
} from 'firebase/firestore'
import { db } from "../config/firebase";

export async function addChannel(pid, channelID, title) 
{
  const data =
  {
    name: title,
    dateCreated: serverTimestamp()
  }
  await setDoc(doc(db, "GCs", pid, "voiceChannels", channelID),data)
}
