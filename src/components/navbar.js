import React from "react"
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react"
import { FaTwitter} from "react-icons/fa"

export default async function App() {

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

