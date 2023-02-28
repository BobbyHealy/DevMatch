import React, {useState} from 'react'

export default function Searchbar() {
    const [username, setUsername] = useState("")

    const [user, setUser] = useState("")
    const [err, setErr] = useState(false)
    const handleSearch =() =>{
        // const q = query(
        //     collection(db,"users"),
        //     where("name", "==", username)

        // );
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doec)=>{
        //     setUser(doc.data)
        // })
        try{
            if (username === )
        }
    };
    const handleKey = e=>{
        e.code ==="Enter" &&handleSearch(); 
    }
    
    const userTest= {
        name: "Henry",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
    }
    const Auden= {
        name: "Auden",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
    }
    

  return (
    <div className='search border-b-2 border-gray-400'>
        <div className='searchForm p-2'>
            <input type="text" 
            className='bg-transparent border-none outline-none text-white placeholder-gray-300' 
            placeholder='search for a user'
            onChange={e=>setUsername(e.target.value)}
            />
        </div>
        <div className='userChat flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ={user.imageUrl} className='bg-white h-6 w-6 rounded-full'></img>
            <div className='info'>
                <span className='text-lg font-medium'>user.name</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div>
    </div>
  )
}
