import { 
    updateDoc,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore'
import { db } from "../config/firebase";
export async function addDoc(email, docID,title){
    const data =
    {
      fileName: title,
      time: serverTimestamp(),
      lastEdit: serverTimestamp()
    }
    
    await setDoc(doc(db, "userDocs", email, "docs", docID ),data)
}

export async function updateState(email, docID, state){
    await updateDoc(doc(db, "userDocs", email,"docs",docID), {
        lastEdit: serverTimestamp(),
        state: state
      });
}
export async function delDoc(email, docID){
    await deleteDoc(doc(db, "userDocs", email,"docs",docID));
}