import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getServiceTypesAPI } from '../api';

interface ServiceType {
	label: string;
	priceType: string;
	price?: number;
}

const ServiceTypeTable = () => {
	const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
	useEffect(() => {
		async function fetchData() {
			try {
				const serviceTypesData = await getServiceTypesAPI();
				// Convert the object to an array of ServiceType
				const serviceTypesArray = Object.values(serviceTypesData) as ServiceType[];
				setServiceTypes(serviceTypesArray);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Label</TableCell>
						<TableCell>Price Type</TableCell>
						<TableCell>Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{serviceTypes.map((serviceType, index) => (
						<TableRow key={index}>
							<TableCell>{serviceType.label}</TableCell>
							<TableCell>{serviceType.priceType}</TableCell>
							<TableCell>{serviceType.price}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ServiceTypeTable;
