"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Component() {	

 	const { data, status } = useSession()
	const router = useRouter()

	if (status === "loading") {
		return <div>Loading...</div>
	}

	if (status === "unauthenticated") {
		router.push("/login")
		return <div>Redirecting...</div>
	}

	return (
		<section>
			<h1>Page</h1>
		</section>
	)

}
