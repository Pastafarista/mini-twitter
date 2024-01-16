'use client'

import Link from "next/link";
import { BiHomeCircle, BiUser } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BsBell,
  BsBookmark,
  BsTwitter,
  BsEnvelope,
  BsThreeDots,
} from "react-icons/bs";

import { BiSearch } from "react-icons/bi";

const NAVIGATION_ITEMS = [
  {
    title: "Twitter",
    href: "/",
    icon: BsTwitter,
  },
  {
    title: "Home",
    icon: BiHomeCircle,
  },
  {
    title: "Buscar",
    href: "/search",
    icon: BiSearch,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: BsBell,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: BsEnvelope,
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: BsBookmark,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: BiUser,
  },
];

const Sidebar = () => { 

  const router = useRouter();

  function handleClick()
  {
	 router.push("/tweet");
  }

  const { data: session, status } = useSession();

  if (status === "loading")
  {
	  return <div>Loading...</div>
  }
  else if (status === "error")
  {
	  return <div>Error</div>
  }

  const name = session?.user?.name;
	
  const [user, setUser] = useState([])
  const [avatar, setAvatar] = useState(null)
	
  useEffect(() => {
		fetch(' https://sk83s1lepc.execute-api.us-east-1.amazonaws.com/default/get_user',
		{
			method: 'POST',
			body: JSON.stringify({
				"username": name
			})
		})
		.then(response => response.json())
		.then(data => {
			setUser(data)
			console.log(data)

			if(data.avatar == null){
				setAvatar("https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png")
			}
			else{
				setAvatar("https://imagenes-antonio-landin.s3.amazonaws.com/" + data.avatar)
			}
		})
		.catch((error) => {
			console.error('Error:', error)
		})
	}, [])

 

  return (
    <section className="w-[23%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden">
      <div className="flex flex-col items-stretch h-full space-y-4 mt-4">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            className="hover:bg-white/10 text-2xl transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6"
            href={item.href || "/"}
            key={item.title}
          >
            <div>
              <item.icon />
            </div>
            {item.title !== "Twitter" && <div>{item.title}</div>}
          </Link>
        ))}
	
        <button onClick={handleClick} className="rounded-full m-4 bg-[#1DA1F2] p-4 text-2xl text-center hover:bg-opacity-70 transition duration-200">
          Tweet
        </button>

      </div>

      <button className="rounded-full flex items-center space-x-2 bg-transparent p-4 text-center hover:bg-white/10 transition duration-200 w-full justify-between">
        <div className="flex items-center space-x-2">
          <img src={avatar} className="rounded-full w-10 h-10"/>
          <div className="text-left text-sm">
            <div className="font-bold">
	  	{user.name}
            </div>
            <div className="">@{user.username}</div>
          </div>
        </div>
        <div>
          <BsThreeDots />
        </div>
      </button>
    </section>
  );
};

export default Sidebar;
