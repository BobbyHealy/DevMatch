import React from "react";
import { FlagIcon } from "@heroicons/react/20/solid";

export default function ReportDetail(props) {
    const {
        name = null
    } = props;

    return (
        <div className="bg-white mt-3 mb-3 px-4 py-5 sm:px-6 rounded-lg">
          <div className='mx-auto flex py-5 h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
            <FlagIcon
              className='h-6 w-6 text-red-600'
              aria-hidden='true'
            />
          </div>
          <div className='mt-5 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-base font-semibold leading-6 text-gray-900'>
              Reported User: {name}
            </h3>
            <div className='mt-2'>
              Reason given:
            </div>

            <div className='mt-2'>
              <div className='mt-2'>
                <h2>Insert text here</h2>
              </div>
            </div>
          </div>
        </div>
    )
}