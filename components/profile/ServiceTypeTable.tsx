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
					<UpdateModalContent
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

const UpdateModalContent: React.FC<ModalContentProps> = ({
															 serviceType,
															 handleUpdateSubmit,
															 closeModal,
														 }) => {
	const [label, setLabel] = useState(serviceType.label);
	const [priceType, setPriceType] = useState(serviceType.priceType);

	let initPrice = serviceType.price ? serviceType.price : undefined
	const [price, setPrice] = useState<number | undefined>(initPrice);

	const [updatedVariants, setUpdatedVariants] = useState<{ [key: string]: ServiceType }>(
		serviceType.variants || {}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("updatedvariatn", updatedVariants)
		let updatedServiceType: ServiceType = {
			...serviceType,
			label,
			priceType,
		}
		if (price !== undefined && serviceType.price ) {
			updatedServiceType = {
				...updatedServiceType,
				price: price, // Convert the price to a number
			};
		}
		// Include variants only if they exist
		if (serviceType.variants) {
			updatedServiceType.variants = updatedVariants;
		}
		// Call the update function with the updated service type
		handleUpdateSubmit(updatedServiceType);
		// Close the modal
		closeModal();
	};

	// Handle changes to variant prices
	const handleVariantChange = (variantKey: string, newValue: string) => {
		setUpdatedVariants((prevVariants) => ({
			...prevVariants,
			[variantKey]: {
				...prevVariants[variantKey],
				price: parseFloat(newValue || '0'),
			},
		}));
	};

	// @ts-ignore
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
				{/*this is when it is not a variant*/}
				{serviceType.variants == undefined || price != undefined ?
					(
						<div className="my-5">
							<label htmlFor="price" className="block text-sm font-medium text-gray-700">
								Pris
							</label>
							<input
								type="number"
								id="price"
								name="price"
								value={price}
								onChange={(e) => setPrice(parseFloat(e.target.value))}
								className="mt-1 p-2 w-full border rounded-md"
							/>
						</div>
					) : (
						// Handle variants
						Object.entries(updatedVariants).map(([variantKey, variant], index) => (
							<div key={index} className="my-5">
								<label
									htmlFor={`variant_label_${index}`}
									className="block text-sm font-medium text-gray-700"
								>
									{variant.label} pris:
								</label>
								<input
									type="number"
									id={`variant_label_${index}`}
									name={`variant_label_${index}`}
									value={variant.price}
									onChange={(e) => handleVariantChange(variantKey, e.target.value)}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
						))
					)}
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
