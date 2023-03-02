import Header from "@/components/header";
import SkillList from "@/components/SkillList";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function FollowUp() {
  const { user, login, logout, userInfo } = useAuth();
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     console.log(skills.split(","));
  //     var raw = JSON.stringify({
  //       userID: user.uid,
  //       name: name,
  //       rating: 100,
  //     });
  //     console.log(raw);
  //   }, [skills]);

  const handleSumbit = async (e) => {
    e.preventDefault();
    const skillsArr = skills.split(",");
    var raw = JSON.stringify({
      userID: user.uid,
      name: name,
      rating: 100,
      skills: skillsArr,
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/addUser", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        Router.push("../feed");
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <Header />

      <div className='hidden sm:block' aria-hidden='true'>
        <div className='py-5'>
          <div className='border-t border-gray-200' />
        </div>
      </div>

      <div className='mt-10 sm:mt-0'>
        <div className='md:grid md:grid-cols-3 md:gap-6'>
          <div className='md:col-span-1'>
            <div className='px-6 py-10'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>
                Personal Information
              </h3>
              <p className='mt-1 text-sm text-gray-600'>
                Tell us about yourself
              </p>
            </div>
          </div>
          <div className='mt-5 md:col-span-2 md:mt-0'>
            <form onSubmit={handleSumbit}>
              <div className='overflow-hidden shadow sm:rounded-md'>
                <div className='bg-white px-4 py-5 sm:p-6'>
                  <div className='grid grid-cols-6 gap-6'>
                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        name='first-name'
                        id='first-name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete='given-name'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {"Skills (Separated by comma)"}
                      </label>
                      <input
                        type='text'
                        name='first-name'
                        id='first-name'
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        autoComplete='given-name'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3 lg:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700'>
                        Profile photo
                      </label>
                      <div className='mt-1 flex items-center'>
                        <span className='inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100'>
                          <svg
                            className='h-full w-full text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                          </svg>
                        </span>
                        <button
                          type='button'
                          className='ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {/* <div className='col-span-6 sm:col-span-3 lg:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700'>
                        Profile banner
                      </label>
                      <div className='mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'>
                        <div className='space-y-1 text-center'>
                          <svg
                            className='mx-auto h-12 w-12 text-gray-400'
                            stroke='currentColor'
                            fill='none'
                            viewBox='0 0 48 48'
                            aria-hidden='true'
                          >
                            <path
                              d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <div className='flex text-sm text-gray-600'>
                            <label
                              htmlFor='file-upload'
                              className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'
                            >
                              <span>Upload a file</span>
                              <input
                                id='file-upload'
                                name='file-upload'
                                type='file'
                                className='sr-only'
                              />
                            </label>
                            <p className='pl-1'>or drag and drop</p>
                          </div>
                          <p className='text-xs text-gray-500'>
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
                  <button
                    type='submit'
                    onSubmit={(e) => {
                      handleSumbit();
                    }}
                    className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='hidden sm:block' aria-hidden='true'>
        <div className='py-5'>
          <div className='border-t border-gray-200' />
        </div>
      </div>
    </div>
  );
}
