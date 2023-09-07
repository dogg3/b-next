import {NextApiRequest, NextApiResponse} from 'next';
import {db} from '@/firebase';
import {getDocs, doc, setDoc, collection} from 'firebase/firestore';
import {ServiceType} from "@/types/serviceType";

function sanitizeLabel(label: string) {
	// Remove any non-English letters and trim the label
	return label.replace(/[^a-zA-Z]/g, '').trim();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {method} = req;
	const serviceTypesCollection = collection(db, 'serviceTypes');

	switch (method) {
		case 'GET':
			try {
				const snapshot = await getDocs(serviceTypesCollection);
				const serviceTypesWithVariants: ServiceType[] = [];
				const serviceTypesWithoutVariants: ServiceType[] = [];

				// Sort the serviceTypesWithoutVariants based on priceType
				snapshot.forEach((doc) => {
					const serviceType = <ServiceType>doc.data();
					if (serviceType.variants) {
						serviceTypesWithVariants.push(serviceType);
						return;
					}
					serviceTypesWithoutVariants.push(serviceType);
				});

				// Sort the serviceTypesWithoutVariants based on priceType
				const sortedServiceTypesWithoutVariants = serviceTypesWithoutVariants.sort((a, b) => {
					if (a.priceType === 'SQM' && b.priceType === 'unit') {
						return -1; // 'a' is 'SQM' and 'b' is 'unit', so 'a' comes first
					} else if (a.priceType === 'unit' && b.priceType === 'SQM') {
						return 1; // 'a' is 'unit' and 'b' is 'SQM', so 'b' comes first
					} else {
						return 0; // Either both are 'SQM' or both are 'unit', no preference
					}
				});

				// Concatenate the two arrays, with serviceTypesWithVariants first
				const sortedServiceTypes = [...serviceTypesWithVariants, ...serviceTypesWithoutVariants];

				res.status(200).json(sortedServiceTypes);
			} catch (error) {
				console.error('Error fetching service types:', error);
				res.status(500).json({error: 'Internal Server Error'});
			}
			break;
		case 'POST':
			try {
				const newServiceTypeData = req.body;
				const {label, price, priceType, variants} = newServiceTypeData;

				// Validate the new data and perform any necessary checks here
				if (!label || !price || !priceType) {
					res.status(400).json({error: 'Invalid data format'});
					return;
				}

				// Parse the 'price' value to a number
				const parsedPrice = parseFloat(price);

				// Check if the parsed price is a valid number
				if (isNaN(parsedPrice)) {
					res.status(400).json({error: 'Invalid price format'});
					return;
				}

				// Sanitize the label to only contain English letters and trim it
				const sanitizedLabel = sanitizeLabel(label);

				// Reference the document with the sanitized label as the key
				const serviceTypeRef = doc(serviceTypesCollection, sanitizedLabel);

				// Remove 'variants' if it's empty or set it to an empty array if it doesn't exist
				let sanitizedData: {
					label: string,
					price: number,
					priceType: string,
					variants?: object
				} = {
					label,
					price: parsedPrice,
					priceType,

				};

				if (variants && variants.length > 0) {
					sanitizedData.variants = variants;
				}

				// Set the document data with the sanitized data
				await setDoc(serviceTypeRef, sanitizedData);

				res.status(200).json({key: sanitizedLabel}); // Respond with the sanitized label as the key
			} catch (error) {
				console.error('Error creating service type:', error);
				res.status(500).json({error: 'Internal Server Error'});
			}
			break;
		default:
			res.status(405).json({error: 'Method not allowed'});
	}
};
