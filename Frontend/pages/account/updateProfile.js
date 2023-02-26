import React, { useState, useEffect } from "react";
import Input from "../../components/Input";



const INITIAL_STATE = {
  name: "Auden",
  skills: ['skill1', 'skill2']
};


function updateProfile() {
    const [user, setUser] = useState(INITIAL_STATE);
    {/*ToDO: fetch user */};
  
    const handleInput = (e) => {
      console.log(e.target.name, " : ", e.target.value);
      setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();  
      {/*update database */}
    };

  return (
    <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-full bg-white">
        <h1 className="text-center">{user.name}</h1>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md scroll-smooth">
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit}>
                    <Input
                        name="name"
                        type="text"
                        value={user.name}
                        placeholder={"Your names"}
                        handleInput={handleInput}
                    />
                    <br />
                    <Input
                        name="skills"
                        type="text"
                        value={user.skills}
                        placeholder={"Your skills"}
                        handleInput={handleInput}
                    />
                    <br />
                    <input type="submit" value="Update" />
                    </form>
                </div>
            </div>
        </div>
  </div>
  );
}
export default updateProfile
