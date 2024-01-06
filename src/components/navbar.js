import React from "react"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react"
import { FaTwitter} from "react-icons/fa"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function App() {

  const session = await getServerSession(authOptions)

  console.log(session)

  return (
    <Navbar>

      <NavbarBrand>
	<Link href="/">
	        <FaTwitter />
		<p className="font-bold text-inherit">Mini Twitter</p>
	</Link>
      </NavbarBrand>

     <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/register" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

