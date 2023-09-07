export interface ServiceTypeWithKey {
	key: string;
	label: string;
	priceType: string;
	price?: number;
}


export interface ServiceType {
	key: string;
	label: string;
	price: number;
	priceType: 'unit' | 'SQM';
	variants?: ServiceType;
}

export interface FormServiceTypeData {
	key: string;
	label: string;
	priceType: string;
	price: number;
	variants?: {
		[key: string]: {
			price: number;
			label: string;
			priceType: string;
		};
	};
}

export interface ServiceTypeData {
	[key: string]: {
		label: string;
		priceType: string;
		variants?: {
			[key: string]: {
				price: number;
				label: string;
				priceType: string;
			};
		};
		price?: number;
	};
}


export interface Customer {
	key: string;
	email: string
	boats: {
		[key: string]: Boat
	}

	createdAt: Date
}

export interface Job {
	status: 'pending' | 'accepted' | 'rejected'
	serviceType: ServiceType
	units?: number
	createdAt: Date
}

export interface Boat {
	model: string
	length: number
	width: number
	jobs: {
		[key: string]: Job
	}
}
