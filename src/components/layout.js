'use client'

import Sidebar from "./sidebar";
import Timeline from "./timeline";
import Post from "./post";
import { useState, createContext } from "react";

export const tweetContext = createContext()

export default function Layout() {

  const [ update, setUpdate ] = useState([])

  const providerValue = { update, setUpdate }

  return (
	  <div className="w-full h-full flex justify-center items-center relative bg-black text-white">
          	<div className="xl:max-w-[70vw] w-full h-full flex relative">
	  		<Sidebar/>
	  		<main className=" mx-2 flex w-[600px] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
	  			<tweetContext.Provider value={providerValue}>
	  				<Post/>
	  			</tweetContext.Provider>
	  			<div className="p-6">
	  				<tweetContext.Provider value={providerValue}>
	  					<Timeline/>
	  				</tweetContext.Provider>
	  			</div>
	  		</main>
	  	</div>
	  </div>
  );
}
