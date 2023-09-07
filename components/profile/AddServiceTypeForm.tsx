import React, {FC, useState, SyntheticEvent} from 'react';
import {PRICE_TYPE_SQM, PRICE_TYPE_UNIT} from '../utils';
import {FormServiceTypeData, ServiceTypeWithKey} from '@/types/serviceType';
import {createServiceType} from '@/components/api';

interface AddServiceTypeFormProps {
	onAddServiceType: (serviceType: ServiceTypeWithKey) => void;
}

const AddServiceTypeForm: FC<AddServiceTypeFormProps> = ({onAddServiceType}) => {
	const [formData, setFormData] = useState<FormServiceTypeData>({
		key: '',
		price: 0,
		label: '',
		priceType: PRICE_TYPE_SQM,
		variants: {},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		setFormData({
			...formData,
			priceType: value === PRICE_TYPE_SQM ? PRICE_TYPE_SQM : PRICE_TYPE_UNIT,
		});
	};

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			const success = await createServiceType(formData);
			if (success) {
				console.log('Service type created successfully.');
				// Pass the new service type data to the parent component
				onAddServiceType(formData as ServiceTypeWithKey);
				// Reset the form or perform any other actions upon successful creation
				setFormData({
					key: '',
					price: 0,
					label: '',
					priceType: PRICE_TYPE_SQM,
					variants: {},
				});
				return
			}
			console.error('Failed to create service type.');
		} catch (error) {
			// @ts-ignore
			console.error(error.message);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto p-4 bg-white rounded shadow-lg">
			<h2 className="text-2xl font-semibold mb-4">Skapa en Service</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="label" className="block font-medium">Namn:</label>
					<input
						type="text"
						id="label"
						name="label"
						value={formData.label}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
					/>
				</div>
				<div className="mb-4">
					<label className="block font-medium">Pristyp:</label>
					<div className="flex items-center">
						<label className="inline-flex items-center mr-4">
							<input
								type="checkbox"
								name="priceType"
								value="SQM"
								checked={formData.priceType === 'SQM'}
								onChange={handleCheckboxChange}
								className="mr-2 text-blue-500"
							/>
							KVM 
						</label>
						<label className="inline-flex items-center">
							<input
								type="checkbox"
								name="priceType"
								value="unit"
								checked={formData.priceType === 'unit'}
								onChange={handleCheckboxChange}
								className="mr-2 text-blue-500"
							/>
							Enhet
						</label>
					</div>
				</div>
				<div className="mb-4">
					<label htmlFor="price" className="block font-medium">Price:</label>
					<input
						type="number"
						id="price"
						name="price"
						value={formData.price || ''}
						onChange={handleChange}
						className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
					/>
				</div>
				<div>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:ring focus:ring-blue-300"
					>
						Skapa service
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddServiceTypeForm;
