"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import {Input} from "@nextui-org/react";

export default function Register() {

    const router = useRouter()
	
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
	
    const handleSubmit = async (e) => {
        e.preventDefault();
	
	 const usuario = {
	    user: user,
	    passwordUser: password
   	}	

	const res = await fetch("https://taz8gpsg91.execute-api.us-east-1.amazonaws.com/default/register", {
	    method: "POST",
	    body: JSON.stringify(usuario)
	})

	const data = await res.json()

	console.log(data)

	if (data.res == true) {
	    setError("")
	    router.push("/login")
	}
	else {
	    setError(data.msg)
	}
    }

    return (
        <section>
            <div className="w-full flex flex-col gap-4 border border-white rounded-lg">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

		    {/* Error */} 
	    	    {error && (
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			    <span className="block sm:inline">{error}</span>
			</div>
		    )}

                    {/* Título */}
                    <div>
                        <p className="text-white text-xl font-bold">Registrar cuenta</p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
			
			{/* Nombre */}
                        <Input onChange={(e) => setUser(e.target.value)} type="text" label="Nombre" variant="underlined" required/>

                        {/* Contraseña */}
                        <Input onChange={(e) => setPassword(e.target.value)} type="password" label="Contraseña" variant="underlined" required/>

			{/* Ya tengo una cuenta */}
	    		<div className="flex justify-between">
                        	<Link href="/login" className="align-start text-md text-white hover:underline">Ya tengo una cuenta</Link>
                    	</div>

                        {/* Botón de register */}
                        <button type="submit" className="w-full text-black font-semibold bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none rounded-full text-sm px-5 py-2.5 text-center">Crear cuenta</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
