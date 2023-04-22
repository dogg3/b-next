import Image from 'next/image'
import { Inter } from 'next/font/google'
import {BoatForm} from '../components/Form'

const inter = Inter({ subsets: ['latin'] })

export default function RamsoModal() {
  return (
    <main>
		<BoatForm />
	</main>
  )
}
