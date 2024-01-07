import { BiSearch } from "react-icons/bi";

export default function Search () {


	return (
		<div className="mt-1 mx-5 flex items-center justify-center w-auto h-12 bg-[#161d26] rounded-full">
			<BiSearch className="size-5 ml-3" />
			<input onKeyDown={(e) => { 
                        if (e.key === "Enter") { 
                            alert("Buscando..."); 
                        } 
                    }} type="text" placeholder=" Buscar" className="bg-transparent text-white focus:outline-none w-full"/>
		</div>
	)
}
