import { getServerSession } from "next-auth/next"

export default async function Page() {
	return (
		<>
			<h1>Server side rendering</h1>
			<p>
				This page uses the universal <strong>getServerSideProps()</strong>{" "}
				method, which gets session from the server.
			</p>
		</>
	
	)
}
