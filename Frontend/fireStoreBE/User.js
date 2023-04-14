import { 
    updateDoc,
    doc,
    setDoc,
    deleteField,
    deleteDoc,
    collection,
    Timestamp,
    getDoc,
    getDocs,
    query
} from 'firebase/firestore'
import { db } from "../config/firebase";
import { delDoc } from './userDoc';
import { deleteUserDM, deleteDM } from './DmMsg';

export async function switchPage(uid, page){
    updateDoc(doc(db, "users", uid), {
        currentPage:page
    })
}
export async function switchProjPage(uid, page){
    updateDoc(doc(db, "users", uid), {
        currentProjPage: page,
    })
}

export async function switchChat(uid, chat){
    await updateDoc(doc(db, "users", uid), {
      currentChat:chat
    });
}

export async function deleteAccount(uid,email){
    await delDMs(uid)
    await delAllDocs(email)
    deleteDoc(doc(db, "users", uid));
}
async function delDMs(uid)
{
    // DMs from user 2
    const queryData = query(doc(db, "userChats",uid));
    const querySnapshot = await getDoc(queryData);
    Object.entries(querySnapshot.data()).forEach(dm =>(
        delDM(dm[0], uid)
    ))

    // Delete user 1 Dms' record
    deleteDoc(doc(db, "userChats",uid))
}

async function delDM(DMID, uid) {
    // Recursively delte DM
    console.log(1)
    
    await deleteDM(DMID)
    console.log(2)

    const ids = DMID.split("-");
    // Delete the DM from user2's record
    const user2ID = ids[0] === uid? ids[1]:ids[0]
    console.log(user2ID)
    await deleteUserDM(user2ID, DMID)
    
    
}
  
async function delAllDocs(email){
    const queryData = query(collection(db, "userDocs", email,"docs"));
    const querySnapshot = await getDocs(queryData);
    querySnapshot.docs.forEach(doc =>(
        delDoc(email,doc.id)
    ))
    await deleteDoc(doc(db, "userDocs", email))
    console.log("done2")
}