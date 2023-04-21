import React, { useEffect, useState } from "react";
import PastUserComponent from "./PastUserComponent";
import { useAuth } from "@/context/AuthContext";

export default function PastUsers() {
  const { user } = useAuth();
  const [pastUsers, setPastUsers] = useState([]);
  const [userList, setUserList] = useState([]);

  const getPastUsers = async (uid) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      uid: uid,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/getPastUsers", requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getUser = async (uid) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      userID: uid,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/getUser", requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    getPastUsers(user.uid).then((result) => {
      if (result[0] !== null) {
        setPastUsers(result[0]);
      }
    });
  }, [user]);

  useEffect(() => {
    async function updateState() {
      const data = await Promise.all(pastUsers.map((user) => getUser(user)));
      setUserList((oldArray) => [...oldArray, ...data]);
    }

    updateState();
  }, [pastUsers]);

  //   useEffect(() => {
  //     console.log(pastUsers);
  //     pastUsers.forEach(async (element) => {
  //       getUser(element).then((res) => {
  //         const cpy = [...userList];
  //         cpy.push(res);
  //         setUserList([...cpy]);
  //       });
  //     });
  //   }, [pastUsers]);

  //   useEffect(() => {
  //     console.log(userList);
  //   }, [userList]);

  return (
    <div className='bg-gray-100 px-5 py-5'>
      <p className='text-lg px-5 py-5 font-bold'>
        You've previously worked with:
      </p>
      {userList.map((e) => {
        return (
          <div key={e.userID}>
            <PastUserComponent user={e} />
          </div>
        );
      })}
    </div>
  );
}
