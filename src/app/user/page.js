'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Component() {	
	
	const { data: session, status } = useSession()
	const router = useRouter()

	if (status === 'loading') {
		return <p>Loading...</p>
	}

	if (status === 'unauthenticated') {
		router.push('/login')
		return <p>Redirecting...</p>	
	}

	return (
		<div className="text-center">
			<h1 className="text-xl"> Bienvenido {session.user.name}! </h1>
		</div>

	)
}
