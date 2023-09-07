import React, { useState } from 'react';
import CustomerComponent from './Customer';
import {Customer} from "@/types/serviceType"; // Replace with the actual path to your CustomerComponent

const CustomerList = () => {
	const [customers, setCustomers] = useState<Customer[]>([
		// Your list of customers here
	]);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer>();

	// Function to handle customer selection
	const handleCustomerSelect = (customer: Customer) => {
		setSelectedCustomer(customer);
	};

	return (
		<div>
			<h1>Customer List</h1>
			<ul>
				{customers.map((customer) => (
					<li key={customer.key} onClick={() => handleCustomerSelect(customer)}>
						{customer.email}
					</li>
				))}
			</ul>

			{selectedCustomer && (
				<div>
					<h2>Selected Customer</h2>
					{/*<CustomerComponent customer={selectedCustomer} />*/}
				</div>
			)}
		</div>
	);
};

export default CustomerList;
