
export interface ServiceType {
	label: string;
	priceType: string;
	price?: number;
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
