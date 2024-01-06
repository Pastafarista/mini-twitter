"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import {Input} from "@nextui-org/react";
import {useForm, SubmitHandler} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

export default function Register() {

    const router = useRouter()
    const [error, setError] = useState("")

    const schema = yup.object().shape({
	name: yup.string().required("Ingrese su nombre"),
	password: yup.string()
	    .required("Ingrese su contraseña")
	    .min(4, "La contraseña debe tener al menos 4 caracteres")
	    .max(12, "La contraseña debe tener como máximo 12 caracteres"),
	confirmPassword: yup.string()
	    .required("Confirme su contraseña")
	    .min(4, "La contraseña debe tener al menos 4 caracteres")	
	    .max(12, "La contraseña debe tener como máximo 12 caracteres")
	    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
	keyword: yup.string().required("Ingrese su palabra clave")
    })

    const {
	register,
	handleSubmit,
	reset,
	formState: { errors },
    } = useForm({
	resolver: yupResolver(schema),
    });
   
    const onSubmit = async (data) => {
	    const usuario = {
	    	user: data.name,
	    	passwordUser: data.password
   	    }	

	const res = await fetch("https://taz8gpsg91.execute-api.us-east-1.amazonaws.com/default/register", {
	    method: "POST",
	    body: JSON.stringify(usuario)
	})

	const resData = await res.json()

	console.log(resData)

	if (resData.res == true) {
	    setError("")
	    router.push("/login")
	}
	else {
	    setError(resData.msg)
	    reset()
	}
   }

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
                        <p className="text-white text-xl font-bold">Registrar cuenta</p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
			
			{/* Nombre */}
                        <Input {...register("name", {required: true})} type="text" label="Nombre" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.name?.message}</p>
	    
                        {/* Contraseña */}
                        <Input {...register("password", {required:true})} type="password" label="Contraseña" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.password?.message}</p>		

			{/* Confirmar contraseña */}
	    		<Input {...register("confirmPassword", {required:true})} type="password" label="Confirmar contraseña" variant="underlined" required/>			
			<p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>		

	    		{/* Palabra clave */}	
	    		<Input {...register("keyword", {required:true})} type="password" label="Palabra clave" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.keyword?.message}</p>

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
