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

export async function pinMsg(DMID, id, message,pinner ) 
{
  await updateDoc(doc(db, "chats", DMID, "messages", id),
  {
    pinned: true,
    pinnedBy: pinner
  })
}

export async function unpinMsg(DMID, id) 
{
  updateDoc(doc(db, "chats", DMID, "messages", id),
  {
    pinned: false,
    pinnedBy: deleteField()
  })
}

export async function deleteMsg(DMID, id) 
{
  await deleteDoc(doc(db, "chats", DMID, "messages", id));
}

export async function sendMsg(DMID, msgID,senderID, receiverID, text){
  const data = {
    text: text,
    senderId: senderID,
    date: Timestamp.now(),
    pinned: false
  }
  await setDoc(doc(db, "chats", DMID, "messages", msgID ), data);
  await updateDoc(doc(db, "userChats", senderID), {
    [DMID + ".lastMessage"]: {
      text: text.trim(),
      id: msgID
    },
    [DMID + ".date"]: serverTimestamp(),
  });

  await updateDoc(doc(db, "userChats", receiverID), {
    [DMID + ".lastMessage"]: {
      text: text.trim(),
      id: msgID
    },
    [DMID + ".date"]: serverTimestamp(),
  });
}

export async function sendMsgWithImage(DMID, msgID,senderID, receiverID, text, downloadURL){
  const data ={
    text: text.trim(),
    senderId: senderID,
    date: Timestamp.now(),
    img: downloadURL,
    pinned: false
  }
  await setDoc(doc(db, "chats", DMID, "messages", msgID ), data);
  await updateDoc(doc(db, "userChats", senderID), {
    [DMID + ".lastMessage"]: {
      text: text.trim(),
      id: msgID,
      img: true,
    },
    [DMID + ".date"]: serverTimestamp(),
  });

  await updateDoc(doc(db, "userChats", receiverID), {
    [DMID + ".lastMessage"]: {
      text: text.trim(),
      id:  msgID,
      img: true,
    },
    [DMID + ".date"]: serverTimestamp(),
  });
}
