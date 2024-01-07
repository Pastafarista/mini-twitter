import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";

export default function Search () {

	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");

	useEffect( () => {
		fetch("https://txwfwq05n9.execute-api.us-east-1.amazonaws.com/default/search", {
			method: "POST",
			body: JSON.stringify({
				search: search
			})
		})
		.then((res) => res.json())
		.then((data) => {setUsers(data.users)})
	}, [search])

		
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
				
			<div className="flex flex-col items-center justify-center w-full h-full">
				{users.map((user) => (
					<div className="mt-5">
						<p className="text-white">{user.name}</p>
					</div>
				))}
			</div>
		</div>
	)
}
