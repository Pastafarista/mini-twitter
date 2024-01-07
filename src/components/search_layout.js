'use client'

import Sidebar from "./sidebar";
import Search from "./search";

export default function Layout() {

  return (
	  <div className="w-full h-full flex justify-center items-center relative bg-black text-white">
          	<div className="xl:max-w-[70vw] w-full h-full flex relative">
	  		<Sidebar/>
	  		<main className=" mx-2 flex w-[600px] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
	  			<Search/>
	  			<div className="p-6">
	  				Hola
	  			</div>
	  		</main>
	  	</div>
	  </div>
  );
}

