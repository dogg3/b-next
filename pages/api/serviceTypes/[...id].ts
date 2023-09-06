import {NextApiRequest, NextApiResponse} from 'next';

export interface ServiceTypeData {
	[key: string]: {
		label: string;
		priceType: string;
		variants?: {
			[variant: string]: {
				price: number;
				label: string;
				priceType: string;
			};
		};
		price?: number;
		filter?: string;
	};
}

const serviceType: ServiceTypeData = {
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

export default (req: NextApiRequest, res: NextApiResponse) => {
	const {method} = req;
	// @ts-ignore
	const [, id] = req.query.id;

	switch (method) {
		case 'GET':
			if (id) {
				// Retrieve a specific service type by ID
				const type = serviceType[id];
				if (type) {
					res.status(200).json(type);
				} else {
					res.status(404).json({error: 'Service type not found'});
				}
			}
			// Retrieve all service types
			res.status(200).json(serviceType);
			break;
		case 'PUT':
			if (id) {
				// Update a service type by ID
				if (serviceType[id]) {
					const {label, price, priceType, variants} = req.body;
					serviceType[id] = {label, price, priceType, variants};
					res.status(200).json(serviceType[id]);
				} else {
					res.status(404).json({error: 'Service type not found'});
				}
			}
			break;
		case 'DELETE':
			if (id) {
				// Delete a service type by ID
				if (serviceType[id]) {
					delete serviceType[id];
					res.status(204).end();
				} else {
					res.status(404).json({error: 'Service type not found'});
				}
			}
			break;
		default:
			res.status(405).json({error: 'Method not allowed'});
	}
};
