import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Search () {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
    const [onlyFollowers, setOnlyFollowers] = useState(0);

    const { data: session, status } = useSession();

    if (status === "loading")
    {
	    return <div>Loading...</div>
    }
    else if (status === "error")
    {
	    return <div>Error</div>
    }

    const username = session?.user?.name;

    const searchObject = {
        search: search,
        user: username,
        onlyFollowers: onlyFollowers,
    }

	useEffect( () => {
		fetch("https://txwfwq05n9.execute-api.us-east-1.amazonaws.com/default/search", {
			method: "POST",
			body: JSON.stringify(searchObject)
		})
		.then((res) => res.json())
		.then((data) => {
            if(data != null){
                setUsers(data.usuarios)
            }
        })
	}, [search])
		
    function getAvatar(avatar){
        if(avatar == null){
			return "https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png"
		}
		else{
			return "https://imagenes-antonio-landin.s3.amazonaws.com/" + avatar
		}
    }

    function followUser(followUser){ 
        alert("Siguiendo a " + followUser)

        const follow = {
            user: username,
            followUser: followUser
        }
        
        console.log(follow)

        fetch("https://xysyv0eo23.execute-api.us-east-1.amazonaws.com/default/follow", {
            method: "POST",
            body: JSON.stringify(follow)
        })
        .then(res => res.json())
        .then(data => {console.log(data)})

    }

	return (
		<div>
			<div className="mt-1 mx-5 flex items-center justify-center w-auto h-12 bg-[#161d26] rounded-full">
				<BiSearch className="size-5 ml-3" />
				<input onKeyDown={(e) => { 
				if (e.key === "Enter") { 
					setSearch(e.target.value);
				} 
			    }} type="text" placeholder="Buscar" className="ml-2 bg-transparent text-white focus:outline-none w-full"/>
			</div>
			
            <div className="mt-5 mx-5 flex items-center justify-center w-auto h-12 bg-[#161d26] rounded-full">
                <input type="checkbox" className="ml-3" onChange={(e) => {
                    if(e.target.checked){
                        setOnlyFollowers(1)
                        setSearch("")
                    }
                    else{
                        setOnlyFollowers(0)
                        setSearch(" ")
                    }
                }}/>
            </div>
            

            <div className="flex justify-start w-full h-full">
                <div className="flex flex-col ml-10">   
                    {users.map((user) => (
                        <div className="mt-5 flex flex-row">
                            <div className="mr-2">
                                <img src={getAvatar(user.avatar)} alt="" className="w-10 h-10 rounded-full"/>
                            </div>

                            <div className="mt-1">
                                <p className="text-white">{user.name}</p>
                                <p className="text-slate-700">@{user.username}</p>
                            </div>

                            <div className="ml-5">                  
                                <button onClick={ () => followUser(user.username)} className="bg-blue-400 hover:bg-blue-500 text-white rounded-full py-1 px-4 ml-auto mr-1">
                                    Seguir
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
		</div>
	)
}
