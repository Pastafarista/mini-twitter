"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {

    const router = useRouter()

    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")

    const redirigir = (data) => {
        console.log(data)

	if (data.res == true) {
	    router.push("/user")
	}
	else if(data.userBlocked == true) {
	    alert("Usuario bloqueado")
	}
	else {
	    alert("Usuario o contraseña incorrectos")
	}
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const usuario = {
		"user": user,
		"passwordUser": password
        }

        fetch("https://81uccrx4el.execute-api.us-east-1.amazonaws.com/default/login", {
            method: "POST",
            headers: {},
            body: JSON.stringify(usuario)
        })
           .then((res) => res.json())
           .then((data) => redirigir(data))
    }

    return (
        <section>
            <div className="w-full bg-blue rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0  from-gray-900 to-gray-600 bg-gradient-to-r">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                    {/* Título */}
                    <div>
                        <p className="text-white text-xl font-bold">Iniciar sesión</p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
			

			{/* Nombre */}
	    		<div>
                            <input onChange={(e) => setUser(e.target.value)} type="text" name="user" id="user" placeholder="Nombre de usuario" x-model="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
			</div>

                        {/* Contraseña */}
                        <div>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Contraseña" x-model="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>

	    		{/* Recuperar contraseña */}
	    		<div>
	    			<p className="text-white text-md font-bold"><Link href="/recuperar-contrasena">Recuperar contraseña</Link></p>
			</div>

                        {/* Botón de login */}
                        <button type="submit" className="w-full text-black font-semibold bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none rounded-full text-sm px-5 py-2.5 text-center">Entrar</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
