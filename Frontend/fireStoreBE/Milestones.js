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
} from 'firebase/firestore'
import { db } from "../config/firebase";
export async function addMS(pid, MSID, title, assignee, dueDate, label) 
{
    const data ={
        title: title,
        assignee: assignee,
        dueDate: dueDate,
        label: label,
        pending: false,
        complete: false,
    }
    await setDoc(doc(db, "Projects", pid, "MileStones", MSID),data)
}

export async function sendToApprove(pid, MSID){
    await updateDoc(doc(db, "Projects", pid, "MileStones", MSID), {
        pending: true,
    });
}

export async function approveRequest(pid, MSID){
    await updateDoc(doc(db, "Projects", pid, "MileStones", MSID), {
        pending: false,
        complete: true,
    });
}

export async function denyRequest(pid, MSID){
    await updateDoc(doc(db, "Projects", pid, "MileStones", MSID), {
        pending: false,
    });
}

export async function deleteMS(pid, MSID){
    await deleteDoc(doc(db, "Projects", pid, "MileStones", MSID));
}

