import { 
    updateDoc,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore'
import { db } from "../config/firebase";
export async function addDoc(pid, docID ,fileName, createBy,state){
    const data =
    {
        fileName,
        time: serverTimestamp(),
        lastEdit: serverTimestamp(),
        createBy,
        state
    }
    await setDoc(doc(db, "Projects", pid, "Docs", docID ),data)
}

export async function updateState(pid, docID, state ,lastEditBy){
    await updateDoc(doc(db, "Projects", pid,"Docs",docID), {
        lastEditBy,
        lastEdit: serverTimestamp(),
        state
      });
}
export async function updateTitle(pid, docId, fileName){
    await updateDoc(doc(db, "Projects", pid, "Docs", docId), {
        fileName
    });
}
export async function delDoc(pid, docID){
    await deleteDoc(doc(db, "Projects", pid,"Docs",docID));
}
