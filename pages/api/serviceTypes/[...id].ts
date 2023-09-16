import {NextApiRequest, NextApiResponse} from 'next';
import {db} from '@/firebase';
import {getDocs, getDoc, doc, setDoc, collection, deleteDoc, Timestamp} from 'firebase/firestore';
import {ServiceType} from "@/types/serviceType";

// Function to sanitize the label
function sanitizeLabel(label: string) {
	return label.replace(/[^a-zA-Z]/g, '').trim();
}

// Function to sort ServiceType objects based on priceType
function sortByPriceType(serviceTypes: ServiceType[]): ServiceType[] {
	return serviceTypes.sort((a, b) => {
		if (a.priceType === 'SQM' && b.priceType === 'unit') {
			return -1;
		} else if (a.priceType === 'unit' && b.priceType === 'SQM') {
			return 1;
		} else {
			return 0;
		}
	});
}

// Function to validate new service type data
function validateServiceTypeData(data: any): boolean {
	const {label, price, priceType, variants} = data;
	if ((!label || !price || !priceType) && (!label || !priceType || !variants)) {
		return false;
	}
	return true;
}

// Function to parse and validate the price
function parseAndValidatePrice(price: string): number | null {
	const parsedPrice = parseFloat(price);
	if (isNaN(parsedPrice)) {
		return null;
	}
	return parsedPrice;
}

// Function to create and set the document data
async function createAndSetDocument(
	serviceTypesCollection: any,
	sanitizedLabel: string,
	sanitizedData: any
): Promise<string> {
	const serviceTypeRef = doc(serviceTypesCollection, sanitizedLabel);
	sanitizedData.createdAt = Timestamp.now();
	await setDoc(serviceTypeRef, sanitizedData);
	return serviceTypeRef.id;
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
					serviceType.key = doc.id;
					if (serviceType.variants) {
						serviceTypesWithVariants.push(serviceType);
						return;
					}
					serviceTypesWithoutVariants.push(serviceType);
				});

				const sortedServiceTypesWithoutVariants = sortByPriceType(serviceTypesWithoutVariants);

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

				if (!validateServiceTypeData(newServiceTypeData)) {
					res.status(400).json({error: 'Invalid data format'});
					return;
				}

				let sanitizedData: any = {
					label: sanitizeLabel(label),
					priceType: priceType,
				};

				if (variants && Object.keys(variants).length > 0) {
					// Check if 'variants' is not an empty object
					sanitizedData.variants = variants;
				} else {
					// Parse and validate the 'price' field
					const parsedPrice = parseAndValidatePrice(price);

					if (parsedPrice === null) {
						res.status(400).json({error: 'Invalid price format'});
						return;
					}

					sanitizedData.price = parsedPrice;
				}
				await createAndSetDocument(serviceTypesCollection, sanitizedData.label, sanitizedData);
				res.status(200).json({key: sanitizedData.label});
			} catch (error) {
				console.error('Error creating service type:', error);
				res.status(500).json({error: 'Internal Server Error'});
			}
			break;
		case 'PUT':
			try {
				const {id} = req.query; // Retrieve the key from the URL parameter
				if (!id) {
					res.status(400).json({error: 'Invalid data format'});
					return;
				}
				const serviceTypeRefToUpdate = doc(serviceTypesCollection, id[0]);
				const existingServiceTypeDoc = await getDoc(serviceTypeRefToUpdate);

				if (!existingServiceTypeDoc.exists()) {
					res.status(404).json({error: 'Service type not found'});
					return;
				}

				const updatedServiceTypeData = req.body;
				const {label, price, priceType, variants} = updatedServiceTypeData;

				if (!validateServiceTypeData(updatedServiceTypeData)) {
					res.status(400).json({error: 'Invalid data format'});
					return;
				}

				let sanitizedData: any = {
					label: label,
					priceType: priceType,
				};

				if (variants && Object.keys(variants).length > 0) {
					// Check if 'variants' is not an empty object
					sanitizedData.variants = variants;
					sanitizedData.price = null; // Remove 'price' when 'variants' are provided
				} else {
					// Parse and validate the 'price' field
					const parsedPrice = parseAndValidatePrice(price);

					if (parsedPrice === null) {
						res.status(400).json({error: 'Invalid price format'});
						return;
					}
					sanitizedData.price = parsedPrice;
				}

				sanitizedData.updatedAt = Timestamp.now(); // Add an updatedAt timestamp

				await setDoc(serviceTypeRefToUpdate, sanitizedData);
				res.status(200).json({message: 'Service type updated successfully'});
			} catch (error) {
				console.error('Error updating service type:', error);
				res.status(500).json({error: 'Internal Server Error'});
			}
			break;
		case 'DELETE':
			try {
				const {id} = req.query; // Retrieve the key from the URL parameter
				if (!id) {
					res.status(400).json({error: 'Missing key for deletion'});
					return;
				}
				const key = id[0]
				console.log(key)
				const serviceTypeRefToDelete = doc(serviceTypesCollection, key);
				console.log(serviceTypeRefToDelete)
				await deleteDoc(serviceTypeRefToDelete);
				res.status(200).json({message: 'Service type deleted successfully'});
			} catch (error) {
				console.error('Error deleting service type:', error);
				res.status(500).json({error: 'Internal Server Error'});
			}
			break;
		default:
			res.status(405).json({error: 'Method not allowed'});
	}
};
