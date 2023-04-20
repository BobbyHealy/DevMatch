import { useEffect, useState, Fragment} from "react";
import Router from "next/router";
import {
  onSnapshot,
  collection,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import GroupMessage from './GroupMessage';
import { Dialog, Transition } from '@headlessui/react'
import GroupPinnedMsg from "./GroupPinnedMsg";

export default function GroupMessages({open, channel}) {
  const [messages, setMessages] = useState([]);
  const [showPinned, setShow] = useState(false);
  const {pid}= Router.query;
  useEffect(() => {
    if(pid){
      const unSub = onSnapshot(collection(db, "Projects", pid, "TextChannels", channel,"messages"), (docs) => {
        setMessages(docs.docs);
      });
      return () => {
        unSub();
      };
    }
  }, [channel]);
  useEffect( () => {
    console.log(open)
    if(open)
    {
      setShow(true)
    }

  }, [open]);
  return (
    <div className='bg-gray-600 text-gray-400 p-2 overflow-scroll h-[calc(100vh-166px)] lg:h-[calc(100vh-110px)] '>
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
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 bg-gray-600">
                        Pinned Msg
                      </Dialog.Title>
                      <div className="mt-2 h-[calc(90vh)] w-[calc(100vw-246px)] overflow-scroll ">
                        {messages.sort((a,b)=>(a.data().date - b.data().date)).map((m) => (
                          m.data().pinned&&<GroupPinnedMsg pid={pid} channel={channel} message={m.data()} id={m.id} key={m.id}/>
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
      {messages.map((m) => 
      (
        <GroupMessage pid={pid} channel={channel} message={m.data()} id={m.id} key={m.id} />
      ))}
    </div> 
  )
}

