import React, {useState} from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Typography,
	Modal,
	Box,
} from '@mui/material';
import {ServiceType} from '@/types/serviceType';

interface ServiceTypeTableProps {
	serviceTypes: ServiceType[];
	handleDelete: (key: string) => void;
	handleUpdate: (key: string, updatedServiceType: ServiceType) => void;
}

const ServiceTypeTable: React.FC<ServiceTypeTableProps> = ({
															   serviceTypes,
															   handleDelete,
															   handleUpdate,
														   }) => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

	const openUpdateModal = (serviceType: ServiceType) => {
		setSelectedServiceType(serviceType);
		setModalOpen(true);
	};

	const closeModal = () => {
		setSelectedServiceType(null);
		setModalOpen(false);
	};

	const handleUpdateSubmit = (updatedServiceType: ServiceType) => {
		if (selectedServiceType) {
			handleUpdate(selectedServiceType.key, updatedServiceType);
			closeModal();
		}
	};

	return (
		<div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Namn</TableCell>
							<TableCell>Pristyp</TableCell>
							<TableCell>Pris</TableCell>
							<TableCell>Åtgärder</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{serviceTypes.map((serviceType) => (
							<TableRow key={serviceType.key}>
								<TableCell>{serviceType.label}</TableCell>
								<TableCell>{serviceType.priceType}</TableCell>
								<TableCell>{serviceType.price}</TableCell>
								<TableCell>
									<Button
										color="secondary"
										onClick={() => handleDelete(serviceType.key)}
									>
										Radera
									</Button>
									<Button
										color="primary"
										onClick={() => openUpdateModal(serviceType)}
									>
										Uppdatera
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{selectedServiceType && (
				<Modal open={isModalOpen} onClose={closeModal}>
					<ModalContent
						serviceType={selectedServiceType}
						handleUpdateSubmit={handleUpdateSubmit}
						closeModal={closeModal}
					/>
				</Modal>
			)}
		</div>
	);
};

interface ModalContentProps {
	serviceType: ServiceType;
	handleUpdateSubmit: (updatedServiceType: ServiceType) => void;
	closeModal: () => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
													   serviceType,
													   handleUpdateSubmit,
													   closeModal,
												   }) => {
	console.log(serviceType)
	const [label, setLabel] = useState(serviceType.label);
	const [priceType, setPriceType] = useState(serviceType.priceType);
	const [price, setPrice] = useState(serviceType.price.toString());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Create an updated service type object
		const updatedServiceType: ServiceType = {
			...serviceType,
			label,
			priceType,
			price: parseFloat(price), // Convert the price to a number
		};

		// Call the update function with the updated service type
		handleUpdateSubmit(updatedServiceType);

		// Close the modal
		closeModal();
	};

	return (
		<Box
			sx={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				bgcolor: 'background.paper',
				boxShadow: 24,
				p: 4,
				minWidth: 400,
			}}
		>
			<Typography variant="h6">Uppdatera Service-typ</Typography>
			<form onSubmit={handleSubmit}>
				<div className="my-5">
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						Namn
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>
				<div className="my-5">
					<label htmlFor="priceType" className="block text-sm font-medium text-gray-700">
						Pristyp
					</label>
					<select
						id="priceType"
						name="priceType"
						value={priceType}
						onChange={(e) => setPriceType(e.target.value)}
						className="mt-1 p-2 w-full border rounded-md"
					>
						{/* Add your options for price types here */}
						<option value="SQM">SQM</option>
						<option value="Unit">Unit</option>
					</select>
				</div>
				<div className="my-5">
					<label htmlFor="price" className="block text-sm font-medium text-gray-700">
						Pris
					</label>
					<input
						type="number"
						id="price"
						name="price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className="mt-1 p-2 w-full border rounded-md"
					/>
				</div>
				<button
					type="submit"
					className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Uppdatera
				</button>
			</form>
		</Box>
	);
};

export default ServiceTypeTable;
