"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import {Input} from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Login() {

    const router = useRouter()
    const [error, setError] = useState("")

    const schema = yup.object().shape({
	name: yup.string()
      		.required("Ingrese su nombre"),
	keyword: yup.string()
	    	.required("Ingrese su palabra clave"),

	password: yup.string()
      		.required("Ingrese una contraseña")
      		.min(4, "Debe tener al menos 4 caracteres")
      		.max(12, "No puede tener más de 12 caracteres"),
   	cpassword: yup.string()
      		.required("Confirme la contraseña")
      		.min(4, "Debe tener al menos 4 caracteres")
      		.max(12, "No puede tener más de 12 caracteres")
      		.oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
	
	const peticion = {
		user: data.name,
		keyword: data.keyword,
		newPassword: data.password
	}

	const res = await fetch("https://7ur6xe2zfh.execute-api.us-east-1.amazonaws.com/default/change_password", {
	    method: "POST",
	    body: JSON.stringify(peticion),
	})

	const resData = await res.json()

	if (resData.res == true) {
	    setError("")
	    router.push("/login")
	}
	else if(res.ok == false) {
	    setError(resData.msg)
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
                        <p className="text-white text-xl font-bold">Cambiar contraseña</p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
			
			{/* Nombre */}    
	    		<Input {...register("name", {required: true})} type="text" label="Nombre" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.name?.message}</p>		

                        {/* Palabra clave */}
                        <Input {...register("keyword", {required: true})} type="text" label="Palabra clave" variant="underlined" required/>
	    		<p className="text-red-500 text-xs">{errors.keyword?.message}</p>

	    		{/* Contraseña */}
	    		<Input {...register("password", {required: true})} type="password" label="Contraseña" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.password?.message}</p>

	    		{/* Confirmar contraseña */}
	    		<Input {...register("cpassword", {required: true})} type="password" label="Confirmar contraseña" variant="underlined" required/>			
	    		<p className="text-red-500 text-xs">{errors.cpassword?.message}</p>

                        {/* Botón de login */}
                        <button type="submit" className="w-full text-black font-semibold bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none rounded-full text-sm px-5 py-2.5 text-center">Entrar</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

