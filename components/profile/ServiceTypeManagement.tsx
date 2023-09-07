import React, { FC, useEffect, useState } from 'react';
import { deleteServiceType, getServiceTypesAPI } from '@/components/api';
import { ServiceTypeWithKey } from '@/types/serviceType';
import AddServiceTypeForm from './AddServiceTypeForm';
import ServiceTypeTable from './ServiceTypeTable';

interface ServiceTypeManagementProps {
	user: any; // Replace with your user type
}

const ServiceTypeManagement: FC<ServiceTypeManagementProps> = ({ user }) => {
	const [serviceTypes, setServiceTypes] = useState<ServiceTypeWithKey[]>([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const serviceTypesData = await getServiceTypesAPI();
				// Convert the object to an array of ServiceType
				setServiceTypes(serviceTypesData);
			} catch (error) {
				console.log(error);
			}
		}

		fetchData();
	}, []);

	const addServiceType = (newServiceType: ServiceTypeWithKey) => {
		// Add the new service type to the state
		setServiceTypes((prevServiceTypes) => [...prevServiceTypes, newServiceType]);
	};

	const handleDelete = async (key: string) => {
		try {
			const success = await deleteServiceType(key);

			if (success) {
				console.log('Service type deleted successfully.');
				setServiceTypes((prevServiceTypes) =>
					prevServiceTypes.filter((serviceType) => serviceType.key !== key)
				);
			} else {
				console.error('Failed to delete service type.');
			}
		} catch (error) {
			// @ts-ignore
			console.error(error.message);
		}
	};

	return (
		<div className="mt-4">
			<AddServiceTypeForm onAddServiceType={addServiceType} />
			<ServiceTypeTable serviceTypes={serviceTypes} handleDelete={handleDelete} />
		</div>
	);
};

export default ServiceTypeManagement;
