import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { db, auth} from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import Router from "next/router";


export default function SignUp() {
  const { user, signup } = useAuth();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // await signup(email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: email
      });
      await setDoc(doc(db, "userChats", res.user.uid), {});
      await setDoc(doc(db, "userDocs", res.user.email), {docs: [] });
      Router.push("./followup");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className='flex min-h-full flex-col bg-white justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          {/* Replace with logo of DevMatch */}
          <h2 className='mt-6 text-center text-5xl font-bold tracking-tight text-orange-400'>
            {" "}
            {/* Replace with DevMatch Colors*/}
            DevMatch
          </h2>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Create a new account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Already have an account?{" "}
            <a
              href='/account/login'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Login
            </a>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <form className='space-y-6' onSubmit={handleSignup}>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>

              {/* <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div> */}

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div>

              {/* <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  />
                </div>
              </div> */}

              <div>
                <button
                  type='submit'
                  className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Create account {/* TODO: Add functionality from backend*/}
                </button>
              </div>
            </form>
            {/* TODO: Decide if we will allow login with other applications */}
          </div>
        </div>
      </div>
    </div>
  );
}
