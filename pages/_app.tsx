// _app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { app } from '../firebase'; // Import the Firebase module

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}
