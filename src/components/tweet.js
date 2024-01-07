"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {useForm, SubmitHandler} from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { Textarea } from "@nextui-org/react";
import { IoMdClose } from "react-icons/io";
import { useSession } from "next-auth/react"

export default function Register() {

    const router = useRouter()
    const [error, setError] = useState("")
    const {data: session, status} = useSession()

    if (status === "loading") {
	return <p>Cargando...</p>
    }
    else if (status === "unauthenticated") {
	router.push("/login")
	return <p>Redirigiendo...</p>
    }

    {/* Control de errores */}
    const schema = yup.object().shape({
	tweet: yup.string()
	    .required("Ingrese su tweet")
	    .max(200, "El tweet no puede tener más de 200 caracteres"),
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
	    const tweet = {
		user: session.user.name,
	    	tweet: data.tweet,
		attachment: "",
   	    }
		
	const res = await fetch("https://t0i0qd9f93.execute-api.us-east-1.amazonaws.com/default/tweet", {
	    method: "POST",
	    body: JSON.stringify(tweet)
	})

	const resData = await res.json()

	console.log(resData)

	if (resData.res == true) {
	    setError("")
	    router.push("/login")
	}
	else {
	    reset()
	    setError(resData.msg)
	}
   }

    return (
        <section>
	    
            <div className="border border-white rounded-lg">

			{/* Botón de cerrar */}
	    		<div className="mt-5 ml-5">
				<Link href="/user" className="text-xl text-gray-500 hover:text-gray-700">
					<IoMdClose />
				</Link>
	    		</div>

                <div className="p-6 sm:p-8">

                    {/* Formulario */}
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
			
 			{/* Tweet */}
                        <Textarea {...register("tweet", {required: true})} type="text" placeholder="¡¿Qué está pasando?!" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.tweet?.message}</p>
					

                        {/* Botón de enviar */}
	    		<div>
	                        <button type="submit" className="w-full text-black font-semibold bg-white hover:bg-blue-100 focus:ring-4 focus:outline-none rounded-full text-sm px-5 py-2.5 text-center">Enviar</button>
	    		</div>
                    </form>

		    {/* Errores */}
	    	    {error && (
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			    <span className="block sm:inline">{error}</span>
			</div>
		    )} 

                </div>
            </div>
        </section>
    )
}
