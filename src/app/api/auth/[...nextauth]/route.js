import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'



const authOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials, req) {


				const usuario = {
					user: credentials.username,
					passwordUser: credentials.password
				}

				console.log("usuario: ", usuario)

				const res = await fetch("https://81uccrx4el.execute-api.us-east-1.amazonaws.com/default/login", {
					method: "POST",
					headers: {},
					body: JSON.stringify(usuario)
				})

				const data = await res.json()

				console.log(data)

				if(data.res == true){
					return {
						id: data.userId,
						name: data.name,
						avatar: data.avatar,
					}
				}
				else if(data.userBlocked == true){
					throw new Error('El usuario está bloqueado')
				}
				else{
					throw new Error('Credenciales incorrectas')
				}
			}
		})
	]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}
