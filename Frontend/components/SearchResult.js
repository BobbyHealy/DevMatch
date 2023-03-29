import {
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
  } from "firebase/firestore";
  import { db } from "@/config/firebase";
  import { useAuth } from "@/context/AuthContext";

export default function SearchResult({user2}) {
    const {user, userInfo} = useAuth()
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        photoURL: userInfo.profilePic, 
    }
    const handleSelect = async()=>{
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
        currentUser.uid > user2.uid
        ? user.uid + "-"+user2.uid
        : user2.uid + "-"+user.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
        
                [combinedId + ".userInfo"]: {
                uid: user2.uid,
                displayName: user2.displayName,
                photoURL: user2.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", user2.uid), {
                [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.name,
                photoURL: currentUser.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
            });
            }
            await updateDoc(doc(db, "users", currentUser.uid), {
                currentChat:{
                    uid: user2.uid,
                    displayName: user2.displayName,
                    photoURL: user2.photoURL,
                }
            });
        } catch (err) {}
        

    }
  return (
    <div className='userChat flex p-2 items-center gap-2 hover:bg-indigo-600'
    onClick={handleSelect}
    >
        <img src ={user2.photoURL} className='bg-white h-6 w-6 rounded-full'></img>
        <div className='info'>
            <span className='text-lg font-medium'>{user2.displayName}</span>
        </div>

    </div>
  )
}
