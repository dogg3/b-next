import {NextApiRequest, NextApiResponse} from 'next';
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
	FreshwaterSystemConservation: {
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

function generateKey() {
	// Generate a unique key (you can use any method you prefer)
	return Math.random().toString(36).substring(2, 15);
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;

	switch (method) {
		case 'GET':
			res.status(200).json(serviceType);
			break;
		case 'POST':
			// Handle the POST request to add a new service type
			try {
				const newServiceTypeData = req.body;
				const { label, price, priceType, variants } = newServiceTypeData;

				// Validate the new data and perform any necessary checks here
				if (!label || !price || !priceType) {
					res.status(400).json({ error: 'Invalid data format' });
					return;
				}

				// Generate a new key for the service type
				const key = generateKey();

				// Update the serviceType object with the new data and generated key
				serviceType = {
					...serviceType,
					[key]: { label, price, priceType, variants },
				};

				res.status(200).json(serviceType); // Respond with the updated serviceType data
			} catch (error) {
				res.status(400).json({ error: 'Invalid data format' });
			}
			break;
		default:
			res.status(405).json({ error: 'Method not allowed' });
	}
};
