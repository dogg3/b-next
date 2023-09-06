import { priceTypeToT, sqmFunc, toCurrency } from "../../components/utils";
import { NextApiRequest, NextApiResponse } from "next";
import {doc, setDoc} from "@firebase/firestore";
import {db} from "@/firebase";
import {ServiceTypeData} from "@/types/serviceType";

let serviceType: ServiceTypeData = {
	WinterStay: {
		label: 'Placeringar',
		priceType: 'SQM',
		variants: {
			outdoor: {price: 500, label: 'Utomhus', priceType: 'SQM'},
			inside: {price: 1100, label: 'Inomhus', priceType: 'SQM'},
		},
	},
	EngineConservation: {
		label: 'Konservering av motorer, exklusive glykol',
		price: 1700,
		priceType: 'unit',
	},
	BatteryConservation: {
		label: 'Konservering av elverk',
		price: 1700,
		priceType: 'unit',
	},
	Batteries: {
		label: 'Batterivård',
		price: 450,
		priceType: 'unit',
	},
	FreshwaterSystem: {
		label: 'Konservering färskvattensystem',
		price: 1300,
		priceType: 'unit',
	},
	SepticTankConservation: {
		label: 'Konservering av septitank',
		price: 1300,
		priceType: 'unit',
	},
	HaulOut: {
		label: 'Upptagning, sjösättning och avpallning',
		price: 180,
		priceType: 'SQM',
	},
	HullCleaning: {
		label: 'Bottentvätt',
		price: 60,
		priceType: 'SQM',
	},
	ShrinkWrap: {
		label: 'Täckning med krymplast',
		price: 350,
		priceType: 'SQM',
	},
};


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	Object.entries(serviceType).forEach(([key, value]) => {
		const docRef = doc(db, "serviceTypes", key); // Reference to the document
		setDoc(docRef, value) // Add the document data
			.then(() => {
				console.log(`Document '${key}' successfully written to Firestore.`);
			})
			.catch((error) => {
				console.error(`Error writing document '${key}' to Firestore:`, error);
			});
	});
	
}


