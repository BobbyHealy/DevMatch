import React from 'react'
export default function Documents() {
  return (
    <div>
        <section className='bg-[#F8F9FA] pb-10 px-10'>
            <div className='max-w-3xl mx-auto'>
                <div className='flex item-center justify-between py-6'>
                    <h2 className='text-lg'>
                        Start a New Document
                    </h2>
                </div>
                <div>
                    <div className='relative h-52 w-40 object-cover cursor-pointer hover:border-blue-700 border-transparent border-2'>
                        <img src='https://firebasestorage.googleapis.com/v0/b/devmatch-8f074.appspot.com/o/newDoc.png?alt=media&token=e9e8d8d1-4b4b-45c5-bfac-5da48be277cd'/>
                    </div>
                </div>
            </div>
        </section>
        <section className=' bg-white px-10 md:px-0'>
            <div className='max-w-3xl mx-auto py-8 text-sm text-gray-700'>
                <div className='flex items-center justify-between pb-5'>
                    <h2 className='font-medium flex-grow'>
                        My Documents
                    </h2>
                    <p className='mr-12'>
                        Date Created
                    </p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                    </svg>
                </div>
            </div>
        </section>

    </div>
  )
}
