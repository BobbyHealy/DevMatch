import { 
    updateDoc,
    doc,
    setDoc,
    deleteField,
    deleteDoc,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore'
import { db } from "../config/firebase";
export async function addDoc(pid, docID ,title, creatorName, emptyState){
    const data =
    {
    fileName: title,
    time: serverTimestamp(),
    lastEdit: serverTimestamp(),
    createBy: creatorName,
    state: emptyState
    }
    await setDoc(doc(db, "projDocs", pid, "docs", docID ),data)
}

export async function updateState(pid, docID, state ,EditBy){
    await updateDoc(doc(db, "projDocs", pid,"docs",docID), {
        lastEditBy: EditBy,
        lastEdit: serverTimestamp(),
        state: state
      });
}
export async function delDoc(pid, docID){
    await deleteDoc(doc(db, "projDocs", pid,"docs",docID));
}