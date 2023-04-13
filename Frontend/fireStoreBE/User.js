import { 
    updateDoc,
    doc,
    setDoc,
    deleteField,
    deleteDoc,
    Timestamp,
} from 'firebase/firestore'
import { db } from "../config/firebase";

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