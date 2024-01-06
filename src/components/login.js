"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import {Input} from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form"

export default function Login() {

    const router = useRouter()
    const [error, setError] = useState("")

    const {
        register,
        handleSubmit,
	reset,
        formState: { errors },
      } = useForm();

    const onSubmit = async (data) => {
	const res = await signIn("credentials", {
		username: data.name,
		password: data.password,
		callbackUrl: "/user",
		redirect: false
	})

	if (res.ok == true) {
	    setError("")
	    router.push("/user")
	}
	else if(res.ok == false) {
	    setError(res.error)
	    reset()
	}

    };

    const handleSubmite = async (e) => {
        e.preventDefault();
	
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
                        <p className="text-white text-xl font-bold">Iniciar sesión</p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
			

			{/* Nombre */}    
	    		<Input {...register("name", {required: true})} type="text" label="Nombre" variant="underlined" required/>

                        {/* Contraseña */}
                        <Input {...register("password", {required: true})} type="password" label="Contraseña" variant="underlined" required/>

			{/* Crear cuenta */}
			<div className="flex justify-between">
                        	<Link href="/register" className="align-start text-md text-white hover:underline">Crear una cuenta</Link>
                    	</div>

	    		{/* Recuperar contraseña */}
	    		<div className="flex justify-between">
                        	<Link href="/recuperar-contraseña" className="align-start text-md text-white hover:underline">¿No recuerdas tu contraseña?</Link>
                    	</div>

                        {/* Botón de login */}
                        <button type="submit" className="w-full text-black font-semibold bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none rounded-full text-sm px-5 py-2.5 text-center">Entrar</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
