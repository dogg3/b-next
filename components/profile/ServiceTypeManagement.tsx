import React, { FC, useEffect, useState } from 'react';
import { deleteServiceType, getServiceTypesAPI } from '@/components/api';
import {ServiceType, } from '@/types/serviceType';
import AddServiceTypeForm from './AddServiceTypeForm';
import ServiceTypeTable from './ServiceTypeTable';

interface ServiceTypeManagementProps {
	user: any; // Replace with your user type
}

const ServiceTypeManagement: FC<ServiceTypeManagementProps> = ({ user }) => {
	const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
	useEffect(() => {
		async function fetchData() {
			try {
				const serviceTypesData = await getServiceTypesAPI();
				// Convert the object to an array of ServiceType
				console.log("hej",serviceTypesData)
				setServiceTypes(serviceTypesData);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, []);

	const addServiceType = (newServiceType: ServiceType) => {
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
			<div className={"h-[120px]"}/>
			<ServiceTypeTable handleUpdate={(key, updatedServiceType) => alert(key)} serviceTypes={serviceTypes} handleDelete={handleDelete} />
		</div>
	);
};

export default ServiceTypeManagement;
