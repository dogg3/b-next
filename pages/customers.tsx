import React from "react";
import CustomersTable from "@/components/profile/CustomersTable";
import {Customer} from "@/types/serviceType";

export default function Customers() {
	return (
		<main>
			<CustomersTable />
		</main>
	)
}

const initialCustomers: Customer[] = [
	{
		key: 'customer1',
		email: 'customer1@example.com',
		boats: {
			boat1: {
				model: 'Speedboat',
				length: 10,
				width: 5,
				jobs: {
					job1: {
						status: 'pending',
						serviceType: {
							key: 'serviceType1',
							label: 'Boat Cleaning',
							price: 10,
							priceType: 'SQM',
						},
						createdAt: new Date(),
					},
					job2: {
						status: 'pending',
						serviceType: {
							key: 'serviceType1',
							label: 'Boat Cleaning',
							price: 50,
							priceType: 'unit',
						},
						units: 2,
						createdAt: new Date(),
					},
				},
			},
		},
		createdAt: new Date(),
	},
	{
		key: 'customer2',
		email: 'customer2@example.com',
		boats: {
			boat2: {
				model: 'Sailboat',
				length: 12,
				width: 6,
				jobs: {
					job4: {
						status: 'pending',
						serviceType: {
							key: 'serviceType2',
							label: 'Engine Inspection',
							price: 40,
							priceType: 'unit',
						},
						units: 1,
						createdAt: new Date(),
					},
					job5: {
						status: 'pending',
						serviceType: {
							key: 'serviceType3',
							label: 'Hull Painting',
							price: 100,
							priceType: 'unit',
						},
						units: 3,
						createdAt: new Date(),
					},
				},
			},
		},
		createdAt: new Date(),
	},
];

