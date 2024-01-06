import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
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

				if(data.res){
					const user = {
						_id: data.userId,
          					name: data.user,
						avatar: data.avatar,
					}

					return user
				}
				else if(data.userBlocked == true){
					throw new Error('El usuario está bloqueado')
				}
				else{
					throw new Error('Credenciales incorrectas')
				}
			}
		})
	],
	session: {
	    strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}
