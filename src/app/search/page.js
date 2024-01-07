'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/search_layout'

export default function Page () {		
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
		<div>
			<Layout/>
		</div>

	)
}


