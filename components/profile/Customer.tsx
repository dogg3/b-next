import React from 'react';
import {Customer, Job} from "@/types/serviceType";
import {Typography, Paper, List, ListItem, ListItemText, Divider} from '@mui/material';

const initialCustomer: Customer = {
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
						key: "serviceType1",
						label: 'Boat Cleaning',
						price: 50,
						priceType: 'SQM',
					},
					createdAt: new Date(),
				},
				job2: {
					status: 'pending',
					serviceType: {
						key: "serviceType1",
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
};

const CustomerInfo: React.FC = () => {
	const [customer, setCustomer] = React.useState<Customer>(initialCustomer);

	return (
		<div className="bg-gray-100 min-h-screen py-8">
			<CustomerHeader customer={customer}/>
			<div className="max-w-3xl mx-auto mt-4 space-y-4">
				{Object.keys(customer.boats).map((boatKey, index) => (
					<CustomerBoat key={boatKey} boat={customer.boats[boatKey]} index={index}/>
				))}
			</div>
		</div>
	);
};

const CustomerHeader: React.FC<{ customer: Customer }> = ({customer}) => (
	<div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
		<Typography variant="h4" className="mb-4 text-2xl font-semibold">
			Customer Information
		</Typography>
		<div className="mb-4">
			<Typography>
				<strong>Customer Name:</strong> {customer.key}
			</Typography>
			<Typography>
				<strong>Email:</strong> {customer.email}
			</Typography>
		</div>
	</div>
);

const CustomerBoat: React.FC<{ boat: any; index: number }> = ({boat, index}) => (
	<Paper className="bg-white p-6 rounded-lg shadow-md" key={`boat-${index}`}>
		<Typography variant="h5" className="mb-4 text-xl font-semibold">
			Boat {index + 1}
		</Typography>
		<Typography>
			<strong>Boat Model:</strong> {boat.model}
		</Typography>
		<Typography>
			<strong>Length:</strong> {boat.length}
		</Typography>
		<Typography>
			<strong>Width:</strong> {boat.width}
		</Typography>
		<CustomerJobs jobs={Object.values(boat.jobs)}/>
	</Paper>
);

const CustomerJobs: React.FC<{ jobs: Job[] }> = ({jobs}) => (
	<>
		<Typography variant="h6" className="mt-4 mb-2 text-lg font-semibold">
			Jobs
		</Typography>
		<List>
			{jobs.map((job, jobIndex) => (
				<CustomerJob key={`job-${jobIndex}`} job={job}/>
			))}
		</List>
	</>
);

const CustomerJob: React.FC<{ job: Job }> = ({job}, boatDimensions) => (
	<div className="bg-blue-100 p-4 rounded-lg shadow-md mb-4">
		<Typography variant="h6" className="mb-2 text-lg font-semibold">
			Job Status: {job.status}
		</Typography>
		<Typography variant="h6" className="mb-2 text-lg font-semibold">
			Units: {job.units}
		</Typography>
		<Typography variant="h6" className="mb-2 text-lg font-semibold">
			Price: {job.status}
		</Typography>
		<Divider/>
		<div className="mt-2">
			<strong className="text-blue-800">Service Type</strong>
			<ListItem className="mb-2">
				<ListItemText>
					<strong>Price:</strong> {job.serviceType.label}
				</ListItemText>
			</ListItem>
			<ListItem className="mb-2">
				<ListItemText>
					<strong>Price Type:</strong> {job.serviceType.priceType}
				</ListItemText>
			</ListItem>
			<ListItem className="mb-2">
				<ListItemText>
					<strong>Price:</strong> {job.serviceType.price}
				</ListItemText>
			</ListItem>
		</div>
	</div>
);

export default CustomerInfo;
