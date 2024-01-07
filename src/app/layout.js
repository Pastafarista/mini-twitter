import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers";
import Provider from "@/context/Provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Comercios',
  description: 'Buscar y registrar comercios',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en" className='dark'>
      <body>
	<Provider>
	<Providers>
        	{children}
	</Providers>
	</Provider>
      </body>
    </html>
  )
}
