import React from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

export default function DMs() {
  return (
    <div className=''>
      <div className='flex justify-center h-full content-center '>
        <div className='flex border border-white rounded-lg w-11/12 h-5/6 overflow-hidden'>
          
          <Sidebar />

          <Chat />
        </div>
      </div>
    </div>
  );
}
