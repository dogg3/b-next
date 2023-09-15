import React, {FC, useState, SyntheticEvent} from 'react';
import {PRICE_TYPE_SQM, PRICE_TYPE_UNIT} from '../utils';
import {FormServiceTypeData, ServiceType, ServiceTypeWithKey} from '@/types/serviceType';
import {createServiceType} from '@/components/api';

interface AddServiceTypeFormProps {
	onAddServiceType: (serviceType: ServiceType) => void;
}

const AddServiceTypeForm: FC<AddServiceTypeFormProps> = ({onAddServiceType}) => {
	const [formData, setFormData] = useState<FormServiceTypeData>({
		key: '',
		price: 0,
		label: '',
		priceType: PRICE_TYPE_SQM,
		variants: {},
	});

	const [isVariant, setIsVariant] = useState<boolean>(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		if (name.startsWith('variant')) {
			// If the input field name starts with 'variant', it's a variant input
			// Update the variants object within formData
			const variantKey = name.split('_')[2]; // Extract the variant key from the input name
			const variantField = name.split('_')[1]; // Extract the variant field name
			setFormData((prevFormData) => ({
				...prevFormData,
				variants: {
					...prevFormData.variants,
					[variantKey]: {
						...(prevFormData.variants[variantKey] || {}), // Keep existing variant data
						[variantField]: value,
					},
				},
			}));
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};
	console.log(formData)
	;

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		setFormData({
			...formData,
			priceType: value,
			variants: {}, // Reset variants when changing the priceType
		});
	};

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			if (isVariant) {
				// Check if isVariant is true
				const variantsValid = Object.keys(formData.variants).every((key) => {
					const variant = formData.variants[key];
					return variant.label && variant.price;
				});

				if (!variantsValid || !formData.variants) {
					alert('Please fill in all variant fields.');
					return;
				}
				formData.price 
			}

			const success = await createServiceType(formData);
			if (success) {
				console.log('Service type created successfully.');
				// Pass the new service type data to the parent component
				onAddServiceType(formData as ServiceType);
				// Reset the form or perform any other actions upon successful creation
				setFormData({
					key: '',
					price: 0,
					label: '',
					priceType: PRICE_TYPE_SQM,
					variants: {},
				});
				return;
			}
			console.error('Failed to create service type.');
		} catch (error) {
			// @ts-ignore
			alert(error.message);
		}
	};
	;

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
						<label className="inline-flex items-centern mr-4 ">
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
						<label className="inline-flex items-center mr-4">
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
				{
					formData.priceType === 'SQM' ? (
						<div>
							<label className="inline-flex items-center mr-4">
								<input
									type="checkbox"
									checked={isVariant}
									onChange={(e) => {
										setIsVariant(!isVariant);
										setFormData({
											...formData,
											variants: {}, // Reset variants when changing the priceType
										});
									}}
									className="mr-2 text-blue-500"
								/>
								Variant
							</label>
							{isVariant ?
								<div className="variants">
									<div>
										<label className="block font-medium">Variant 1 Label:</label>
										<input
											type="text"
											id="variantLabel1"
											name="variant_label_1" // Unique name for the first variant label
											value={formData.variants['1']?.label || ''}
											onChange={handleChange}
											className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
										/>
										<label className="block font-medium">Variant 1 Price:</label>
										<input
											type="number"
											id="variantPrice1"
											name="variant_price_1" // Unique name for the first variant price
											value={formData.variants['1']?.price || ''}
											onChange={handleChange}
											className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
										/>
									</div>
									<div>
										<label className="block font-medium">Variant 2 Label:</label>
										<input
											type="text"
											id="variantLabel2"
											name="variant_label_2" // Unique name for the second variant label
											value={formData.variants['2']?.label || ''}
											onChange={handleChange}
											className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
										/>
										<label className="block font-medium">Variant 2 Price:</label>
										<input
											type="number"
											id="variantPrice2"
											name="variant_price_2" // Unique name for the second variant price
											value={formData.variants['2']?.price || ''}
											onChange={handleChange}
											className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
										/>
									</div>
								</div> :
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
							}
						</div>
					) : (
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
					)
				}
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
	)
		;
};

export default AddServiceTypeForm;
