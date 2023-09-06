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
				// Use a query to get all documents within the collection
				console.log(serviceTypesCollection)
				const snapshot = await getDocs(serviceTypesCollection); // Use collection reference directly

				console.log(snapshot)
				const serviceTypes: { [key: string]: ServiceType } = {};
				// // Loop through the documents and add them to the serviceTypes object
				snapshot.forEach((doc) => {
					serviceTypes[doc.id] = <ServiceType>doc.data();
				});

				res.status(200).json(serviceTypes);
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

				// Set the document data with the parsed price
				await setDoc(serviceTypeRef, {
					label,
					price: parsedPrice,
					priceType,
					variants,
				});

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
