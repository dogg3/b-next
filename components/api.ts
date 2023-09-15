import {Dispatch, SetStateAction} from "react";
import {FormServiceTypeData} from "@/types/serviceType";

export async function handleSearchAPI(searchTerm: string, setSearchResults: Dispatch<any>) {
	try {
		const response = await fetch(`https://www.sokbat.se/api/search?keyword=${searchTerm}`);
		const data = await response.json();
		setSearchResults(data);
	} catch (error) {
		console.error(error);
	}
}

export const updateDimensionsAPI = async (
	boatId: string,
	setBoatWidth: Dispatch<SetStateAction<string>>,
	setBoatLength: Dispatch<SetStateAction<string>>
) => {
	try {
		const response = await fetch(`https://items.sokbat.se/api/item/v1/${boatId}`, {
			headers: {'Authorization': 'TestToken', 'Origin': 'http://localhost:3000'},
		});
		const data = await response.json();
		if (data) {
			setBoatWidth(String(data.Width / 100));
			setBoatLength(String(data.Length / 100));
		}
	} catch (error) {
		console.log(error);
	}
};

export async function submitEmailAPI(data: {
	boatLength: number,
	jobs: [],
	name: string,
	boatWidth: number,
	boatModel: string,
	email: string
}): Promise<boolean> {
	try {
		const response = await fetch('/api/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		return response.ok;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function getServiceTypesAPI(): Promise<any> {
	try {
		const response = await fetch('/api/serviceTypes/all');
		return await response.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

// delete a variant
// key/key
export async function deleteServiceType(key: string): Promise<boolean> {
	try {
		const response = await fetch(`/api/serviceTypes/${key}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json', // Set the content type
			},
		});
		if (response.status === 200) {
			// Service type deleted successfully
			return true;
		} else {
			// Failed to delete service type
			console.error('Failed to delete service type.');
			return false;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
}


export async function createServiceType(serviceTypeData: FormServiceTypeData) {
	try {
		const response = await fetch('/api/serviceTypes/1', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(serviceTypeData),
		});

		if (response.ok) {
			return true; // Success
		} else {
			throw new Error('Failed to create service type.');
		}
	} catch (error) {
		// @ts-ignore
		throw new Error(`Error creating service type: ${error.message}`);
	}
}

