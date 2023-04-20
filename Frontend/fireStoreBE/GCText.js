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
  getDocs
} from 'firebase/firestore'
import { db } from "../config/firebase";

export async function addChannel(pid, channelID, title) 
{
  const data ={
    name:title,
    dateCreated: serverTimestamp()
  }
  await setDoc(doc(db, "Projects", pid, "TextChannels", channelID),data)
}

export async function deleteChannel(pid, channelID) 
{
  
  const queryData = query(collection(db, "Projects", pid, "TextChannels",channelID,"messages"));
  const querySnapshot = await getDocs(queryData);
  querySnapshot.docs.forEach(msg =>(
    deleteMsg(pid, channelID, msg.id)
  ))
  await deleteDoc(doc(db, "Projects", pid,"TextChannels", channelID));
}
export async function pinMsg(pid, channel, id,pinnerID , pinner) 
{
  await updateDoc(doc(db, "Projects", pid,"TextChannels", channel, "messages", id),
  {
    pinned: true,
    pinner: {
      name: pinner,
      id: pinnerID
    }
  })
}

export async function unpinMsg(pid, channel, id) 
{
  updateDoc(doc(db, "Projects", pid,"TextChannels", channel, "messages", id),
  {
    pinned: false,
    pinnedBy: deleteField()
  })
}

export async function deleteMsg(pid, channel, id) 
{
  await deleteDoc(doc(db, "Projects", pid,"TextChannels", channel, "messages", id));
}

export async function sendMsg(pid, channel,msgID,sender, text){
  const data = {
      text: text.trim(),
      senderID: sender.userID,
      sender: sender.name,
      photoURL: sender.profilePic,
      date: Timestamp.now(),
      pinned: false
  }
  await setDoc(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgID), data);
}

export async function sendMsgWithImage(pid, channel,msgID,sender, text, downloadURL){
  const data =
  {
      text: text.trim(),
      senderID: sender.userID,
      photoURL: sender.profilePic,
      date: Timestamp.now(),
      img: downloadURL,
      pinned: false
  }
  await setDoc(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgID), data);
}

export async function editMsg(pid, channel,msgID, text){
  updateDoc(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgID),
  {
    text: text
  })
}


