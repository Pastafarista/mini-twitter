'use client'

import Sidebar from "./sidebar";
import Timeline from "./timeline";

export default function Layout() {
  return (
	  <div className="w-full h-full flex justify-center items-center relative bg-black text-white">
          	<div className="xl:max-w-[70vw] w-full h-full flex relative">
	  		<Sidebar/>
	  		<main className=" mx-2 p-6 flex w-[600px] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
	  			<Timeline/>
	  		</main>
	  	</div>
	  </div>
  );
}
