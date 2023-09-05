export const BOAT_LENGTH_LABEL = "Båtlängd (meter):";
export const BOAT_WIDTH_LABEL = "Båtbredd (meter):";
export const BOAT_TYPE_LABEL = "Båttyp:";
export const PRICE_TYPE_SQM = "SQM";
export const PRICE_TYPE_UNIT = "unit";

export const priceTypeToT = (priceType) => {
	if (priceType === "SQM") {
		return "KVM";
	}
	if (priceType === "unit") {
		return "enhet";
	}
};

export const toCurrency = (price) => {
	const formattedAmount = price.toLocaleString('sv-SE', {
		style: 'currency',
		currency: 'SEK',
		maximumFractionDigits: 0
	});
	return formattedAmount;
};


export const sqmFunc = (boatLength, boatWidth) => {
	return Math.round(parseFloat(boatLength) * (0.5 + parseFloat(boatWidth)));
};

