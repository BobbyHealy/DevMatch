import Header from "@/components/header";
import SkillList from "@/components/SkillList";
import { useAuth } from "@/context/AuthContext";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import Router from "next/router";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { InputText } from "primereact/inputtext";
import { storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProjType from "@/components/ProjTypeComboBox";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Create() {
  const types = [
    { id: 1, name: "Personal" },
    { id: 2, name: "Research" },
    { id: 3, name: "Class" },
    { id: 4, name: "Professional" },
  ];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const { user, login, logout, userInfo } = useAuth();
  const [projectName, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState(null);
  const [iconURL, setIconUrl] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerURL, setBannerURL] = useState(null);
  const [query, setQuery] = useState("");
  const defaultType = { name: "Personal" };
  const [selectedType, setSelectedType] = useState(defaultType);

  const filteredType =
    query === ""
      ? types
      : types.filter((type) => {
          return type.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    if (!icon) {
      setIconUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(icon);
    setIconUrl(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [icon]);
  useEffect(() => {
    if (!banner) {
      setBannerURL(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(banner);
    setBannerURL(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [banner]);

  const handleSumbit = async (e) => {
    e.preventDefault();
    const projectID = uuidv4();
    const data = {
      name: "main",
      messages: [],
      dateCreated: serverTimestamp(),
    };
    await setDoc(doc(db, "GCs", projectID, "channels", "main"), data);
    if (!icon && !banner) {
      const skillsArr = skills.split(",").map((e) => e.trim());
      var raw = JSON.stringify({
        a: "a",
        pid: projectID,
        owners: [user.uid],
        name: projectName,
        tmembers: [user.uid],
        skills: skillsArr,
        type: selectedType.name,
      });

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const getName = userInfo.name !== undefined ? userInfo.name : "Foo Bar";
      var raw2 = JSON.stringify({
        userID: user.uid,
        name: getName,
        rating: 100,
        profilePic: userInfo.profilePic,
        pOwned:
          userInfo.pOwned !== null
            ? userInfo.pOwned !== undefined
              ? userInfo.pOwned.length > 0
                ? [...userInfo.pOwned, projectID]
                : [projectID]
              : [projectID]
            : [projectID],
        pJoined: userInfo.pJoined !== null ? userInfo.pJoined : undefined,
        skills: userInfo.skills !== null ? userInfo.skills : undefined,
      });

      var requestOptions2 = {
        method: "POST",
        headers: myHeaders,
        body: raw2,
      };

      fetch("http://localhost:3000/api/addProject", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          fetch("http://localhost:3000/api/addUser", requestOptions2)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);

              Router.push("../feed");
            })
            .catch((error) => console.log("error", error));
        })
        .catch((error) => console.log("error", error));
    } else if (!banner) {
      var imageRef = ref(storage, projectName + "Icon");
      uploadBytes(imageRef, icon).then(() => {
        getDownloadURL(imageRef).then((url) => {
          const skillsArr = skills.split(",").map((e) => e.trim());
          var raw = JSON.stringify({
            a: "a",
            pid: projectID,
            owners: [user.uid],
            name: projectName,
            tmembers: [user.uid],
            skills: skillsArr,
            projectProfile: url,
            type: selectedType.name,
          });

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
          };

          const getName =
            userInfo.name !== undefined ? userInfo.name : "Foo Bar";
          var raw2 = JSON.stringify({
            userID: user.uid,
            name: getName,
            rating: 100,
            profilePic: userInfo.profilePic,
            pOwned:
              userInfo.pOwned !== null
                ? userInfo.pOwned !== undefined
                  ? userInfo.pOwned.length > 0
                    ? [...userInfo.pOwned, projectID]
                    : [projectID]
                  : [projectID]
                : [projectID],
            pJoined: userInfo.pJoined !== null ? userInfo.pJoined : undefined,
            skills: userInfo.skills !== null ? userInfo.skills : undefined,
          });

          var requestOptions2 = {
            method: "POST",
            headers: myHeaders,
            body: raw2,
          };

          fetch("http://localhost:3000/api/addProject", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              fetch("http://localhost:3000/api/addUser", requestOptions2)
                .then((response) => response.text())
                .then((result) => {
                  console.log(result);

                  Router.push("../feed");
                })
                .catch((error) => console.log("error", error));
            })
            .catch((error) => console.log("error", error));
        });
      });
    } else if (!icon) {
      var imageRef = ref(storage, projectName + "Banner");
      uploadBytes(imageRef, banner).then(() => {
        getDownloadURL(imageRef).then((url) => {
          const skillsArr = skills.split(",").map((e) => e.trim());
          var raw = JSON.stringify({
            a: "a",
            pid: projectID,
            owners: [user.uid],
            name: projectName,
            tmembers: [user.uid],
            skills: skillsArr,
            projectBannerPic: url,
            type: selectedType.name,
          });

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
          };

          const getName =
            userInfo.name !== undefined ? userInfo.name : "Foo Bar";
          var raw2 = JSON.stringify({
            userID: user.uid,
            name: getName,
            rating: 100,
            profilePic: userInfo.profilePic,
            pOwned:
              userInfo.pOwned !== null
                ? userInfo.pOwned !== undefined
                  ? userInfo.pOwned.length > 0
                    ? [...userInfo.pOwned, projectID]
                    : [projectID]
                  : [projectID]
                : [projectID],
            pJoined: userInfo.pJoined !== null ? userInfo.pJoined : undefined,
            skills: userInfo.skills !== null ? userInfo.skills : undefined,
          });
          var requestOptions2 = {
            method: "POST",
            headers: myHeaders,
            body: raw2,
          };

          fetch("http://localhost:3000/api/addProject", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              fetch("http://localhost:3000/api/addUser", requestOptions2)
                .then((response) => response.text())
                .then((result) => {
                  console.log(result);

                  Router.push("../feed");
                })
                .catch((error) => console.log("error", error));
            })
            .catch((error) => console.log("error", error));
        });
      });
    } else {
      var imageRef = ref(storage, projectName + "Icon");
      var imageRef2 = ref(storage, projectName + "Banner");
      uploadBytes(imageRef, icon).then(() => {
        uploadBytes(imageRef2, banner).then(() => {
          getDownloadURL(imageRef).then((url1) => {
            getDownloadURL(imageRef2).then((url2) => {
              const skillsArr = skills.split(",").map((e) => e.trim());
              var raw = JSON.stringify({
                a: "a",
                pid: projectID,
                owners: [user.uid],
                name: projectName,
                tmembers: [user.uid],
                skills: skillsArr,
                projectProfile: url1,
                projectBannerPic: url2,
                type: selectedType.name,
              });

              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");

              var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
              };

              const getName =
                userInfo.name !== undefined ? userInfo.name : "Foo Bar";
              var raw2 = JSON.stringify({
                userID: user.uid,
                name: getName,
                rating: 100,
                profilePic: userInfo.profilePic,
                pOwned:
                  userInfo.pOwned !== null
                    ? userInfo.pOwned !== undefined
                      ? userInfo.pOwned.length > 0
                        ? [...userInfo.pOwned, projectID]
                        : [projectID]
                      : [projectID]
                    : [projectID],
                pJoined:
                  userInfo.pJoined !== null ? userInfo.pJoined : undefined,
                skills: userInfo.skills !== null ? userInfo.skills : undefined,
              });

              var requestOptions2 = {
                method: "POST",
                headers: myHeaders,
                body: raw2,
              };

              fetch("http://localhost:3000/api/addProject", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                  console.log(result);
                  fetch("http://localhost:3000/api/addUser", requestOptions2)
                    .then((response) => response.text())
                    .then((result) => {
                      console.log(result);

                      Router.push("../feed");
                    })
                    .catch((error) => console.log("error", error));
                })
                .catch((error) => console.log("error", error));
            });
          });
        });
      });
    }
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
                Project Information
              </h3>
              <p className='mt-1 text-sm text-gray-600'>
                Tell us about the project
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
                        Project Name
                      </label>
                      <input
                        type='text'
                        name='first-name'
                        id='first-name'
                        value={projectName}
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

                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {"Project Icon"}
                      </label>
                      <div className='flex h-12 p-2 gap-2  items-center gap-2'>
                        {icon && (
                          <img
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid grey",
                            }}
                            src={iconURL}
                            alt=''
                          />
                        )}
                        <InputText
                          type='file'
                          accept='*.jpg'
                          onChange={(event) => {
                            const file = event.target.files[0];
                            setIcon(file);
                          }}
                        />
                      </div>
                    </div>

                    <div className='col-span-6 sm:col-span-3'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {"Banner"}
                      </label>
                      {banner && (
                        <img
                          style={{
                            width: "100px",
                            height: "40px",

                            objectFit: "cover",
                            border: "1px solid grey",
                          }}
                          src={bannerURL}
                          alt=''
                        />
                      )}
                      <InputText
                        type='file'
                        onChange={(event) => {
                          const file = event.target.files[0];
                          setBanner(file);
                        }}
                      />
                    </div>

                    <div className='col-span-6 sm:col-span-3 pb-20'>
                      <Combobox
                        as='div'
                        value={selectedType}
                        onChange={setSelectedType}
                      >
                        <Combobox.Label className='block text-sm font-medium leading-6 text-gray-900'>
                          Project Type
                        </Combobox.Label>
                        <div className='relative mt-2'>
                          <Combobox.Input
                            className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(type) => type.name}
                          />
                          <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                            <ChevronUpDownIcon
                              className='h-5 w-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </Combobox.Button>

                          {filteredType.length > 0 && (
                            <Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                              {filteredType.map((type) => (
                                <Combobox.Option
                                  key={type.id}
                                  value={type}
                                  className={({ active }) =>
                                    classNames(
                                      "relative cursor-default select-none py-2 pl-3 pr-9",
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          "block truncate",
                                          selected && "font-semibold"
                                        )}
                                      >
                                        {type.name}
                                      </span>

                                      {selected && (
                                        <span
                                          className={classNames(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          )}
                                        >
                                          <CheckIcon
                                            className='h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>
                      {/* <ProjType></ProjType> */}
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
