import { 
  updateDoc,
  doc,
  setDoc,
  deleteField,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  query,
  getDocs,
  collection
} from 'firebase/firestore'
import { db } from "../config/firebase";

export async function pinMsg(DMID, id,pinner ) 
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

export async function sendMsg(DMID, msgID,senderID, receiverID, text)
{
  const data = {
    text: text,
    senderId: senderID,
    date: Timestamp.now(),
    pinned: false
  }
  await setDoc(doc(db, "chats", DMID, "messages", msgID ), data);
  await updateDoc(doc(db, "userChats", senderID), 
  {
    [DMID + ".lastMessage"]: 
    {
      text: text.trim(),
      id: msgID
    },
    [DMID + ".date"]: serverTimestamp(),
  });

  await updateDoc(doc(db, "userChats", receiverID), 
  {
    [DMID + ".lastMessage"]: 
    {
      text: text.trim(),
      id: msgID
    },
    [DMID + ".date"]: serverTimestamp(),
  });
}

export async function sendMsgWithImage(DMID, msgID,senderID, receiverID, text, downloadURL)
{
  const data =
  {
    text: text.trim(),
    senderId: senderID,
    date: Timestamp.now(),
    img: downloadURL,
    pinned: false
  }
  await setDoc(doc(db, "chats", DMID, "messages", msgID ), data);
  await updateDoc(doc(db, "userChats", senderID), 
  {
    [DMID + ".lastMessage"]: 
    {
      text: text.trim(),
      id: msgID,
      img: true,
    },
    [DMID + ".date"]: serverTimestamp(),
  });

  await updateDoc(doc(db, "userChats", receiverID), 
  {
    [DMID + ".lastMessage"]: 
    {
      text: text.trim(),
      id:  msgID,
      img: true,
    },
    [DMID + ".date"]: serverTimestamp(),
  });
}

export async function editMsg(DMID, msgID, text)
{
  updateDoc(doc(db, "chats", DMID, "messages", msgID),
  {
    text: text,
  })
}

export async function deleteUserDM(uid, DMID)
{
  console.log(uid, DMID)
  
  await updateDoc(doc(db, "userChats",uid),{
    [DMID]: deleteField(),
  })
}

export async function deleteDM(DMID)
{
  const queryData = query(collection(db, "chats", DMID, "messages"));
  const querySnapshot = await getDocs(queryData);
  querySnapshot.docs.forEach(msg =>(
      deleteMsg(DMID, msg.id)
  ))
  await deleteDoc(doc(db, "chats", DMID));

}