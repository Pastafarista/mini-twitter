"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {Input} from "@nextui-org/react";
import {useForm, SubmitHandler} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import crypto from "crypto"

export default function Register() {

    const router = useRouter()
    const [error, setError] = useState("")

    const bucketName = "imagenes-antonio-landin"
	const s3 = new S3Client({
		region: 'us-east-1',
		credentials: {
			accessKeyId: "ASIA4KPW5WOLH32BDNGP",
			secretAccessKey: "mVXSnbsSjY5I00HGZ92c+PB7CgGNxS0AmEp0jyF/",
			sessionToken: "FwoGZXIvYXdzEBEaDC/o1pLdJQX4STEo+CLAATMFhim3Z3IcNqbciGP+2AOnunw61J96OG14Sbhnusnp5C0n1F+lYfkUDfOVjIp2unDFtIymiTeVFT2on+a5UajiAQljKSLzr0UgSAFjix+b9XSTKfrA/Y3aja9vqljMoRrADQ9ekMFwGaHr9wGdkA+xxgW646RlB7MujOdN/PmYJAwcciEHnGWvwIuOqR35enLhyefuKlsVgzlTQ/VS/lB6Y9W6afHUfjERodwkvzJxbE4lm0wNKU7N+zeiafMIhSiDwpqtBjIt9aI3beTXRyq+A5mOaTsalj7H9sXbzKRAmcvo4ISnEooWc1noyEPvAh0hB6KT"
		},
	})

    const schema = yup.object().shape({
	name: yup.string().required("Ingrese su nombre"),
	username: yup.string().required("Ingrese su nombre de usuario"),
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

        console.log(data)

	    let fileName = 'null'
        
	    // Subir imagen a S3
	    if(data.avatar[0] != undefined){
            // Generar nombre de archivo
            const ext = data.avatar[0].name.split(".").pop()
            fileName = crypto.randomBytes(16).toString("hex") + "." + ext
            
            // Subir imagen a S3
            const file = data.avatar[0]
            const buffer = Buffer.from(await file.arrayBuffer())

            try {
                const writeCommand = new PutObjectCommand({	
                    Bucket: bucketName,
                    Key: fileName,
                    Body: buffer,
                })
                        
                const res = await s3.send(writeCommand)
            } catch (err) {
                console.log(err)
            }
	    }

	    const usuario = {
	    	username: data.username,
		user: data.name,
		keyword: data.keyword,
	    	passwordUser: data.password,
		avatar: fileName
   	    }

	    console.log(usuario)

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
	    		
			{/* Nombre de usuario */}
	    		<Input {...register("username", {required:true})} type="text" label="Nombre de usuario" variant="underlined" required/>
	    		<p className="text-red-500 text-xs">{errors.username?.message}</p>

                        {/* Contraseña */}
                        <Input {...register("password", {required:true})} type="password" label="Contraseña" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.password?.message}</p>		

			{/* Confirmar contraseña */}
	    		<Input {...register("confirmPassword", {required:true})} type="password" label="Confirmar contraseña" variant="underlined" required/>			
			<p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>		

	    		{/* Palabra clave */}	
	    		<Input {...register("keyword", {required:true})} type="password" label="Palabra clave" variant="underlined" required/>
			<p className="text-red-500 text-xs">{errors.keyword?.message}</p>
			
			{/* Subir foto de perfil */}
	    		<p className="text-white text-sm">Subir foto de perfil</p>
	    		<Input {...register("avatar")} type="file" required/>

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
