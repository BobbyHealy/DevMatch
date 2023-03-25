import { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Switch, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import UserComponent from "@/components/UserComponent";
import ProjComponent from "@/components/ProjectComponent";
import Router from "next/router";
import ProjectDashBoard from "@/components/projectDashBoard";
import Header from "@/components/header";
import { projectExamplesArray } from "@/mockup_data/project_array";
import { userExampleArray } from "@/mockup_data/user_array";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Explore() {
  const [posts, setPosts] = useState(null);
  const { user } = useAuth();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    project: true,
    limit: 21,
  });

  var raw2 = JSON.stringify({
    project: false,
    limit: 21,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  var requestOptions2 = {
    method: "POST",
    headers: myHeaders,
    body: raw2,
    redirect: "follow",
  };

  useEffect(() => {
    setPosts(null);
    fetch("http://localhost:3000/api/getSearch", requestOptions2)
      .then((response) => response.text())
      .then((result) => {
        setPosts(
          Object.entries(JSON.parse(result)).map((e) => {
            const obj = JSON.parse(JSON.stringify(e[1]));
            obj.pid = e[0];
            return obj;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {}, [posts]);

  return (
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 pt-4 bg-gray-100'>
      <div className='lg:max-w-lg pb-4'>
        <p className='text-base font-semibold leading-7 text-indigo-600'>
          Explore
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Find the right match for your Project
        </h1>
        {/* <p className='mt-6 text-xl leading-8 text-gray-700'>
          Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At
          arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae
          feugiat egestas.
        </p> */}
      </div>
      {posts &&
        posts.map((e, i) => {
          return (
            e.userID !== user.uid && (
              <div key={e.toString() + i} className='pb-6'>
                <UserComponent user={e} />
              </div>
            )
          );
        })}
    </div>
  );
}
