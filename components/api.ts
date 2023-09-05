import {Dispatch, SetStateAction} from "react";

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

export interface EmailData {
	name: string;
	email: string;
	boatModel: string;
	boatLength: string;
	boatWidth: string;
	jobs: any[]; // You should define the type of 'jobs' more specifically
}

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
