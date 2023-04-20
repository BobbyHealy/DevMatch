import { PhotoIcon, UserCircleIcon, StarIcon } from '@heroicons/react/24/solid'
import Header from '@/components/header'
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";


export default function Example(props) {
    const [techSkill, settechValue] = useState(0);
    const [commSkill, setcommValue] = useState(0);
    const [leadSkill, setleadValue] = useState(0);
	const [isSubmit, setIsSubmit] = useState(false);
    const { userInfo } = useAuth();


    /*
     *  I tried some of the below things to get the uid2, but they dont work
     *
     */
    
    //const urlParams = new URLSearchParams(window.location.search);
    //const greetingValue = urlParams.get('greeting');
    //const uid2 = localStorage.getItem('uid2');

	const handleSubmit = () => {
        console.log(techSkill);
        console.log(commSkill);
        console.log(leadSkill);
        console.log(userInfo)
        console.log(props)
		//if (techSkill) {
		//	setIsSubmit(true);
		//}

        
    
        /*var myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            uid1: userInfo.userID,
            uid2: greetingValue,
            rating: rating
        });
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        fetch("http://localhost:3000/api/rateUser", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((err) => {
                console.log(err);
            });

        //Router.push("./");

        //refreshPage()*/
	};

  return (
    <form>
      <div className="space-x-6 space-y-12 bg-gray-100">
        <Header></Header>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div className='px-6'>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Rating for User</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Rate this user based on your prior experience working with them.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            

            <div className="col-span-full">
                <div className="w-150 h-72 p-5 rounded-3xl text-white flex flex-col gap-8 bg-gray-500">
                    <div>
                        <StarIcon className="w-10 h-10 text-orange-500"/>
                    </div>
                    <h1 className="text-2xl font-bold">Technical Skill</h1>
                    <p className="text-sm">
                        Provide a rating based on the user's proficiency in their skills
                    </p>
                    <div className="grid grid-cols-5 gap-5">
                        {[1, 2, 3, 4, 5].map((value) => {
                            return (
                                <div
                                    key={value}
                                    className={`grid place-content-center  h-12 w-12 rounded-full cursor-pointer  transition-all ${
                                        value === techSkill
                                            ? "bg-orange-500  text-white"
                                            : "text-gray-400 hover:bg-white hover:text-orange-500  bg-zinc-900"
                                    }`}
                                    onClick={() => settechValue(value)}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="col-span-full">
                <div className="w-150 h-72 p-5 rounded-3xl text-white flex flex-col gap-8 bg-gray-500">
                    <div>
                        <StarIcon className="w-10 h-10 text-orange-500"/>
                    </div>
                    <h1 className="text-2xl font-bold">Communication</h1>
                    <p className="text-sm">
                        Provide a rating based on the user's communication skills
                    </p>
                    <div className="grid grid-cols-5 gap-5">
                        {[1, 2, 3, 4, 5].map((value) => {
                            return (
                                <div
                                    key={value}
                                    className={`grid place-content-center  h-12 w-12 rounded-full cursor-pointer  transition-all ${
                                        value === commSkill
                                            ? "bg-orange-500  text-white"
                                            : "text-gray-400 hover:bg-white hover:text-orange-500  bg-zinc-900"
                                    }`}
                                    onClick={() => setcommValue(value)}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="col-span-full">
                <div className="w-150 h-72 p-5 rounded-3xl text-white flex flex-col gap-8 bg-gray-500">
                    <div>
                        <StarIcon className="w-10 h-10 text-orange-500"/>
                    </div>
                    <h1 className="text-2xl font-bold">Leadership</h1>
                    <p className="text-sm">
                        Provide a rating based on the user's leadership qualities
                    </p>
                    <div className="grid grid-cols-5 gap-5">
                        {[1, 2, 3, 4, 5].map((value) => {
                            return (
                                <div
                                    key={value}
                                    className={`grid place-content-center  h-12 w-12 rounded-full cursor-pointer  transition-all ${
                                        value === leadSkill
                                            ? "bg-orange-500  text-white"
                                            : "text-gray-400 hover:bg-white hover:text-orange-500  bg-zinc-900"
                                    }`}
                                    onClick={() => setleadValue(value)}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>


          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6 px-10">
            <a href='/account' className="text-sm font-semibold leading-6 text-gray-900">
                Cancel
            </a>
            <button
				className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				onClick={handleSubmit}
			>
				Submit
			</button>
      </div>  
    </form> 
  )
}