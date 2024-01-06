"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import {Input} from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

export default function Login() {

    const router = useRouter()
    const [error, setError] = useState("")
   
    const schema = yup.object().shape({
	name: yup.string().required("El nombre es obligatorio"),
	password: yup.string().required("La contraseña es obligatoria")
    })

    const {
        register,
        handleSubmit,
	reset,
        formState: { errors },
      } = useForm({
	      resolver: yupResolver(schema)
      });

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

    return (
        <section>
            <div className="w-full flex flex-col border border-white rounded-lg">
                <div className="p-6 sm:p-8">

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
			<p className="text-red-500 text-xs">{errors.name?.message}</p>		

                        {/* Contraseña */}
                        <Input {...register("password", {required: true})} type="password" label="Contraseña" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.password?.message}</p>

			{/* Crear cuenta */}
			<div className="flex justify-between">
                        	<Link href="/register" className="align-start text-md text-white hover:underline">Crear una cuenta</Link>
                    	</div>

	    		{/* Recuperar contraseña */}
	    		<div className="flex justify-between">
                        	<Link href="/recuperar-cuenta" className="align-start text-md text-white hover:underline">¿No recuerdas tu contraseña?</Link>
                    	</div>

                        {/* Botón de login */}
                        <button type="submit" className="w-full text-black font-semibold bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none rounded-full text-sm px-5 py-2.5 text-center">Entrar</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
