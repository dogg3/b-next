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

export const updateTotPrice = (serviceTypeKey, boatLength, boatWidth, ServiceType, jobs, unitCounts) => {
	let serviceType = ServiceType[serviceTypeKey];
	let job = undefined;
	switch (serviceType.priceType) {
		case "SQM":
			if (boatLength === 0 || boatWidth === 0) {
				alert("Du måste skriva in båtlängd och båtbredd om den inte populeras.");
				return false;
			}
			let sqm = sqmFunc(boatLength * boatWidth);
			let pr = sqmFunc(sqm, serviceType.price);
			job = {
				id: serviceTypeKey,
				price: serviceType.price * sqm,
				label: serviceType.label,
				productPrice: serviceType.price,
				priceType: serviceType.priceType,
			};
			break;
		case "unit":
			let unitprice = 0;
			if (unitCounts[serviceTypeKey] > 0) {
				unitprice = unitCounts[serviceTypeKey] * serviceType.price;
			}
			if (unitprice === 0) {
				return false;
			}
			job = {
				id: serviceTypeKey,
				price: unitprice,
				label: serviceType.label,
				productPrice: serviceType.price,
				priceType: serviceType.priceType,
			};
			break;
	}

	return job;
};

export const updateOrCreateJob = (job, jobs) => {
	const index = jobs.findIndex((item) => item.id === job.id);
	if (index === -1) {
		// If no job with the same id exists, add the new job with the id property
		return [...jobs, job];
	} else {
		// If a job with the same id exists, overwrite it with the new job object
		const updatedJobs = [...jobs];
		updatedJobs[index] = job;
		return updatedJobs;
	}
};

export const sqmFunc = (boatLength, boatWidth) => {
	return Math.round(parseFloat(boatLength) * (0.5 + parseFloat(boatWidth)));
};
