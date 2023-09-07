import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Button } from '@mui/base';
import {ServiceTypeWithKey} from "@/types/serviceType";

interface ServiceTypeTableProps {
	serviceTypes: ServiceTypeWithKey[];
	handleDelete: (key: string) => void;
}

const ServiceTypeTable: React.FC<ServiceTypeTableProps> = ({ serviceTypes, handleDelete }) => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Label</TableCell>
						<TableCell>Price Type</TableCell>
						<TableCell>Price</TableCell>
						<TableCell>Actions</TableCell> {/* Add a new column for Actions */}
					</TableRow>
				</TableHead>
				<TableBody>
					{serviceTypes.map((serviceType) => (
						<TableRow key={serviceType.key}>
							<TableCell>{serviceType.label}</TableCell>
							<TableCell>{serviceType.priceType}</TableCell>
							<TableCell>{serviceType.price}</TableCell>
							<TableCell>
								{/* Add a Delete button for each row */}
								<Button
									color="secondary"
									onClick={() => handleDelete(serviceType.key)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ServiceTypeTable;
