import Image from 'next/image'
import { Inter } from 'next/font/google'
import {BoatForm} from '../components/Form'

const inter = Inter({ subsets: ['latin'] })

export const ServiceType = {
	WinterStay: {
		label: "Placeringar", priceType: "SQM", variants: {
			outdoor: {price: 500, label: "Utomhus", priceType: "SQM"},
			inside: {price: 1100, label: "Inomhus", priceType: "SQM"},
		},
	}, EngineConservation: {
		label: "Konservering av motorer, exklusive glykol", price: 1700, priceType: "unit",
	}, BatteryConservation: {
		label: "Konservering av elverk", price: 1700, priceType: "unit",
	}, Batteries: {
		label: "Batterivård", price: 450, priceType: "unit",
	}, FreshwaterSystemConservation: {
		label: "Konservering färskvattensystem", price: 1300, priceType: "unit",
	}, SepticTankConservation: {
		label: "Konservering av septitank", price: 1300, priceType: "unit",
	}, HaulOut: {
		label: "Upptagning, sjösättning och avpallning", price: 180, priceType: "SQM",
	}, HullCleaning: {
		label: "Bottentvätt", price: 60, priceType: "SQM",
	}, ShrinkWrap: {
		label: "Täckning med krymplast", price: 350, priceType: "SQM", filter: "outdoor",
	},
};


export default function Ramso() {
  return (
    <main>
		<BoatForm sType={ServiceType} />
	</main>
  )
}
