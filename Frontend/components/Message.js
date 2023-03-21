import React, { useContext, useEffect, useRef } from "react";

import { useAuth } from "@/context/AuthContext";

export default function Message({ message }) {
    const ref = useRef();
    
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);
    const { user, userInfo} = useAuth();
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        photoURL: userInfo.profilePic, 
    }
    const [receiver, setReceiver] = useState(null);

    useEffect( () => {
      const getChat = () => {
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
          setReceiver(doc.data().currentChat);
        });
        return () => {
          unsub();
        };
      };
      user.uid && getChat()
    }, [user.uid]);
  return (
    <div>
        {/* if it is receiver */}
        { message.senderId !== currentUser.uid&&<div className='flex mb-5 gap-5 '> 
            <div className='info flex flex-col text-gray-300 font-light'>
                <img className='bg-white w-10 h-10 object-cover rounded-full' src={receiver.photoURL}/>
                <span>just now</span>
            </div>
            <div className='content flex flex-col gap-2 max-w-[calc(80%)]'>
                <p className='bg-orange-100 text-black rounded-tl-none rounded-lg px-4 py-2 max-w-max'>this is a very very long message that will exceed the window length so it should go to another line</p>
                <img className='w-1/2' src="https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg"/>
            </div>
        </div> }
        {/* if it is sender */}
        {message.senderId === currentUser.uid&&<div className='flex mb-5 gap-5 flex-row-reverse'> 
            <div className='info flex flex-col text-gray-300 font-light'>
                <img className='bg-white w-10 h-10 object-cover rounded-full' src={currentUser.photoURL}/>
                <span>just now</span>
            </div>
            <div className='content flex flex-col items-end gap-2 max-w-[calc(80%)]'>
                <p className='bg-blue-300 text-black rounded-tr-none rounded-lg px-4 py-2 max-w-max'>this is drom the user so should be on left</p>
                <img className='w-1/2' src="https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg"/>
            </div>
        </div>}
    </div>
    
  )
}

