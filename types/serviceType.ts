
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
	priceType:  'unit' | 'SQM';
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
