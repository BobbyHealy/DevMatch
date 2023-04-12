import { 
    updateDoc,
    doc,
    setDoc,
    deleteField,
    deleteDoc,
    Timestamp,
  } from 'firebase/firestore'
  import { db } from "../config/firebase";
  
  export async function pinMsg(pid, channel, id,pinnerID , pinner) 
  {
    await updateDoc(doc(db, "GCs", pid,"channels", channel, "messages", id),
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
    updateDoc(doc(db, "GCs", pid,"channels", channel, "messages", id),
    {
      pinned: false,
      pinnedBy: deleteField()
    })
  }
  
  export async function deleteMsg(pid, channel, id) 
  {
    await deleteDoc(doc(db, "GCs", pid,"channels", channel, "messages", id));
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
    await setDoc(doc(db, "GCs", pid,"channels", channel, "messages", msgID), data);
  }
  
  export async function sendMsgWithImage(pid, channel,msgID,sender, text, downloadURL){
    const data =
    {
        text: text.trim(),
        senderID: sender.userID,
        sender: sender.name,
        photoURL: sender.profilePic,
        date: Timestamp.now(),
        img: downloadURL,
        pinned: false
    }
    await setDoc(doc(db, "GCs", pid,"channels", channel, "messages", msgID), data);
  }

  export async function editMsg(pid, channel,msgID, text){
    updateDoc(doc(db, "GCs", pid,"channels", channel, "messages", msgID),
    {
      text: text
    })
  }

  
  