import React from 'react';
import {Boat, Customer, Job, ServiceType} from "@/types/serviceType";
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
						price: 10,
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

const CustomerInfo: React.FC<{ c: Customer }> = ({c}) => {
	const [customer, setCustomer] = React.useState<Customer>(c);

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

const CustomerBoat: React.FC<{ boat: Boat; index: number }> = ({boat, index}) => (
	<Paper className="bg-white p-6 rounded-lg shadow-md" key={`boat-${index}`}>
		<Typography variant="h5" className="mb-4 text-xl font-semibold">
			{boat.model}
		</Typography>
		<Typography>
			<strong>Length:</strong> {boat.length}
		</Typography>
		<Typography>
			<strong>Width:</strong> {boat.width}
		</Typography>
		<Typography>
			<strong>SQM:</strong> {boat.length * boat.width}
		</Typography>
		<Divider className={"mt-4 mb-"}/>
		<CustomerJobs boatDimensions={boat.length * boat.width} jobs={Object.values(boat.jobs)}/>
	</Paper>
);

const CustomerJobs: React.FC<{ jobs: Job[], boatDimensions: number }> = ({jobs, boatDimensions}) => {
	const totalPrice = jobs.reduce((acc, job) => {
		let price = 0;
		if (job.serviceType.priceType === 'SQM' && boatDimensions) {
			price = job.serviceType.price * boatDimensions;
		}
		if (job.serviceType.priceType === 'unit' && job.units) {
			price = job.serviceType.price * job.units;
		}
		return acc + price;
	}, 0);

	return (
		<>
			<Typography variant="h6" className=" mb  font-semibold">
				Jobs
			</Typography>
			<Typography className="mb-2  font-semibold">
				Total Price: {totalPrice}
			</Typography>
			<List>
				{jobs.map((job, jobIndex) => (
					<CustomerJob boatDimensions={boatDimensions} key={`job-${jobIndex}`} job={job}/>
				))}
			</List>
		</>
	)
}

const CustomerJob: React.FC<{ job: Job, boatDimensions: number }> = ({job, boatDimensions}) => {
	const price = job.serviceType.priceType === 'SQM' ? job.serviceType.price * (boatDimensions) : job.units && job.serviceType.price * job.units;
	const explainingText = job.serviceType.priceType === 'SQM'
		? `Price: ${job.serviceType.price} * (${boatDimensions}) = ${price}`
		: `Price: ${job.serviceType.price} * ${job.units} = ${price}`;

	return (
		<div className="bg-blue-100 p-4 rounded-lg shadow-md mb-4">
			<Typography variant="h6" className="mb-2 text-lg font-semibold">
				Job Status: {job.status}
			</Typography>
			{job.units && (
				<Typography variant="h6" className="mb-2 text-lg font-semibold">
					Units: {job.units}
				</Typography>
			)}

			<Typography variant="h6" className="mb-2 text-lg font-semibold">
				{explainingText}
			</Typography>
			<Divider/>
			<ServiceType serviceType={job.serviceType}/>
		</div>
	)
}

const ServiceType: React.FC<{ serviceType: ServiceType }> = ({serviceType}) => {

	return (
		<div className="mt-1"> {/* Reduced margin-top */}
			<strong className="text-blue-800">Service Type</strong>
			<Typography className="mt-1 ml-5"> {/* Reduced margin-top */}
				<strong>Price:</strong> {serviceType.label}
			</Typography>
			<Typography className="mt-1 ml-5"> {/* Reduced margin-top */}
				<strong>Price Type:</strong> {serviceType.priceType}
			</Typography>
			<Typography className="mt-1 ml-5"> {/* Reduced margin-top */}
				<strong>Price:</strong> {serviceType.price}
			</Typography>
		</div>
	)
};


export default CustomerInfo;
