
import {  useState, useEffect, Fragment} from "react";
import { Dialog, Transition } from '@headlessui/react'

import {
  onSnapshot,
  doc,
  collection
} from "firebase/firestore";
import { db } from "@/config/firebase";
import Message from './Message'
import PinnedMsg from "./PinnedMsg";
export default function Messages({DMID, open, receiver}) {
    const [messages, setMessages] = useState([]);
    const [pinnedMsg, setPinned] = useState([]);
    const [showPinned, setShow] = useState(false);

    useEffect(() => {
      if(DMID){
        const unSub = onSnapshot(collection(db, "chats", DMID, "messages"), (docs) => {
          setMessages(docs.docs);
        });
        const unSub2 = onSnapshot(collection(db, "chats", DMID, "pinnedMsg"), (docs) => {
          setPinned(docs.docs);
        });
        console.log(messages)
        return () => {
          unSub();
          unSub2();
        };
      }
    }, [DMID]);
    useEffect( () => {
      if(open)
      {
        setShow(true)
      }

    }, [open]);
  return (
    
    <div className='bg-zinc-700 text-gray-400 p-2 overflow-scroll h-[calc(100vh-166px)] lg:h-[calc(100vh-110px)] '>
      <Transition.Root show={showPinned} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShow}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black h-[calc(90vh)]  w-[calc(100vw-246px)] px-4 pb-4 pt-5 text-left shadow-xl transition-all ">
                <div>
                  <div className="mt-3 text-center sm:mt-5 ">
                    <Dialog.Title as="h3" className="text-base font-semibold pl-6 leading-6 text-gray-900 bg-gray-600">
                      Pinned Msg
                    </Dialog.Title>
                    <div className="mt-2 h-[calc(90vh)] w-[calc(100vw-246px)] overflow-scroll ">
                    {pinnedMsg.sort((a,b)=>(a.data().date - b.data().date)).map((m) => (
                    <PinnedMsg DMID={DMID} message={m.data()} key={m.id} id={m.id} receiver={receiver}/>
                    ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
        {messages.sort((a,b)=>(a.data().date - b.data().date)).map((m) => (
        <Message DMID={DMID} message={m.data()} key={m.id} id={m.id} receiver ={receiver}/>
        ))}
    </div>
  )
}
