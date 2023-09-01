import React, {useEffect, useState} from 'react';


export const ServiceType = {
	WinterStay: {
		label: "Placeringar", priceType: "SQM", variants: {
			outdoor: {price: 500, label: "Utomhus", priceType: "SQM"},
			inside: {price: 1100, label: "Inomhus", priceType: "SQM"},
		},
	}, EngineConservation: {
		label: "Konservering av motorer, exklusive glykol", price: 1700, priceType: "unit",
	}, BatteryConservation: {
		label: "Konservering av elverk", price: 1700, priceType: "unit",
	}, Batteries: {
		label: "Batterivård", price: 450, priceType: "unit",
	}, FreshwaterSystemConservation: {
		label: "Konservering färskvattensystem", price: 1300, priceType: "unit",
	}, SepticTankConservation: {
		label: "Konservering av septitank", price: 1300, priceType: "unit",
	}, HaulOut: {
		label: "Upptagning, sjösättning och avpallning", price: 180, priceType: "SQM",
	}, HullCleaning: {
		label: "Bottentvätt", price: 60, priceType: "SQM",
	}, ShrinkWrap: {
		label: "Täckning med krymplast", price: 350, priceType: "SQM", filter: "outdoor",
	},
};


export const BoatForm = () => {
	const [boatLength, setBoatLength] = useState(0);
	const [boatWidth, setBoatWidth] = useState(0);
	const [companyJobs, setCompanyJobs] = useState();

	//PriceObjects 
	const [priceObject, setPriceObject] = useState([])
	const [unitCounts, setUnitCounts] = useState({});


	// handleUnitCount is for unit pricetypes
	const handleUnitCount = async (event) => {
		const key = event.target.name;
		const count = event.target.value;
		if (count == 0) {
			await setJobs((prev) => prev.filter((v) => v.id != key));
		}
		setUnitCounts(prevUnitCounts => {
			const newUnitCounts = {
				...prevUnitCounts, [key]: count
			};
			updateTotPrice(key, newUnitCounts);
			return newUnitCounts;
		});
	}

	// jobs 
	const [variants, setVariants] = useState([])
	const handleVariant = async (event) => {
		if (boatLength === 0 || boatWidth === 0) {
			alert("Du måste skriva in båtlängd och båtbredd om den inte populeras.");
			return false;
		}
		const variantKeyId = event.target.value;
		const parts = variantKeyId.split(".");
		let serviceTypeKey = parts[0]
		let variantId = parts[1]
		let sqm = sqmFunc(boatLength, boatWidth)
		let jobPrice = Math.round(ServiceType[serviceTypeKey].variants[variantId].price * sqm);
		let productPrice = ServiceType[serviceTypeKey].variants[variantId].price;
		let label = ServiceType[serviceTypeKey].variants[variantId].label;
		let priceType = ServiceType[serviceTypeKey].priceType;
		let job = {
			id: serviceTypeKey,
			variantId: variantId,
			label: label,
			price: jobPrice,
			productPrice: productPrice,
			priceType: priceType,

		}
		updateOrCreateJob(job);
	}

	// This is for sqm pricetypes aka checkboxes
	const handlePriceObject = async (event) => {
		const value = event.target.value;
		console.log("event target", ServiceType[event.target.value])
		const isChecked = event.target.checked;
		if (isChecked) {
			let updated = updateTotPrice(value);
			if (!updated) {
				return false;
			}
		}
		if (!isChecked) {
			setJobs(prevState => prevState.filter(v => v.id !== value))
		}
		setPriceObject((prev) => isChecked ? [...prev, value] : prev.filter((v) => v !== value));
	}

	// {id:'serrvicetypeid', price: int}
	const [jobs, setJobs] = useState([]);

	const updateTotPrice = (serviceTypeKey, unitcounts) => {
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
				let unitprince = 0
				if (unitcounts[serviceTypeKey] > 0) {
					unitprince = unitcounts[serviceTypeKey] * serviceType.price;
				}
				if (unitprince === 0) {
					return false;
				}
				job = {
					id: serviceTypeKey,
					price: unitprince,
					label: serviceType.label,
					productPrice: serviceType.price,
					priceType: serviceType.priceType,
				};
				break;
		}

		updateOrCreateJob(job)
		return true;
	}

	const updateOrCreateJob = (job) => {
		setJobs(prevItems => {
			const index = prevItems.findIndex(item => item.id === job.id);
			if (index === -1) {
				// If no job with the same id exists, add the new job with the id property
				return [...prevItems, job];
			} else {
				// If a job with the same id exists, overwrite it with the new job object
				const updatedItems = [...prevItems];
				updatedItems[index] = job;
				return updatedItems;
			}
		})
	}

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(null);
	const handleSubmitEmail = async (event) => {
		event.preventDefault();
		if (!boatModel) {
			alert("Båtmodell är obligatoriskt att fylla i!")
			return
		}
		if (!boatWidth) {
			alert("Båtbredd obligatoriskt att fylla i!")
			return
		}
		if (!boatLength) {
			alert("Båtlängd är obligatoriskt att fylla i!")
			return
		}

		const jobsCopied = jobs.slice();

		jobsCopied.map(job => {
			if (ServiceType[job.id].priceType == "unit") {
				job.amount = unitCounts[job.id]
				return job;
			}
			return job;
		})

		const response = await fetch('/api/submit', {
			method: 'POST', headers: {
				'Content-Type': 'application/json',
			}, body: JSON.stringify({name, email, boatModel, boatLength, boatWidth, jobsCopied}),
		});
		const data = await response.json();
		setIsSubmitted(response.ok);
	};

	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const handleSearch = async (event) => {
		setSearchResults([]);
		event.preventDefault();
		try {
			const response = await fetch(`https://www.sokbat.se/api/search?keyword=${searchTerm}`);
			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.error(error);
		}
	};

	const [boatModel, setBoatModel] = useState('');
	const [boatId, setBoatId] = useState('');
	const handleItemClick = async (item) => {
		const {itemId, brandName, modelName} = item;
		setBoatModel(`${brandName} ${modelName}`);
		setBoatId(itemId);
		setSearchResults([])
		await updateDimensions(itemId)
	};
	const updateDimensions = async (boatId) => {
		try {
			const response = await fetch(`https://items.sokbat.se/api/item/v1/${boatId}`, {
				headers: {'Authorization': 'TestToken', 'Origin': 'http://localhost:3000'}
			});
			const data = await response.json();
			if (data) {
				if (data.Width) {
					setBoatWidth(String(data.Width / 100));
				}
				if (data.Length) {
					setBoatLength(String(data.Length / 100));
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	function clean(str) {
		return parseFloat(str.replace(",", "."));
	}

	const sqmFunc = () => {
		return Math.round((clean(boatLength)) * (0.5 + clean(boatWidth)))
	}
	return (
		<div className="p-4 bg-gray-100">
			<SearchBoatForm
				searchTerm={searchTerm}
				handleSearch={handleSearch}
				setSearchTerm={setSearchTerm}
				searchResults={searchResults}
				handleItemClick={handleItemClick}
			/>
			<div className={"h-[20px]"}/>
			{/*service jobs*/}
			<BoatFormSection
				boatModel={boatModel}
				setBoatModel={setBoatModel}
				boatLength={boatLength}
				setBoatLength={setBoatLength}
				boatWidth={boatWidth}
				setBoatWidth={setBoatWidth}
				ServiceType={ServiceType}
				jobs={jobs}
				handleVariant={handleVariant}
				handlePriceObject={handlePriceObject}
				unitCounts={unitCounts}
				handleUnitCount={handleUnitCount}
				priceObject={priceObject}
			/>	

			<div className="mb-4">
				<h1 className="text-2xl font-bold mb-2">PRIS</h1>
				{boatWidth != 0 && boatLength != 0 && <div
					className="italic mb-4 text-sm">kvm = ({boatLength} meter) * ({boatWidth} meter bredd + 0.5)
					= {sqmFunc(boatLength, boatWidth)}
				</div>}
				{jobs.map((job) => (<div key={job.id} className="flex justify-between">
					{ServiceType[job.id].priceType == "SQM" && (
						<div className={"flex flex-row justify-between w-full mb-4"}>
							<div className={"flex flex-col"}>
								<span>{job.label} </span>
								<span>{toCurrency(job.productPrice)} per {sqmFunc(boatLength, boatWidth)} kvm</span>
							</div>
							<span>{toCurrency(sqmFunc(boatLength, boatWidth) * job.productPrice)}</span>
						</div>)}
					{ServiceType[job.id].priceType == "unit" && (
						<div className={"flex flex-row justify-between w-full mb-4"}>
							<div className={"flex flex-col"}>
								<span>{job.label} </span>
								<span>{toCurrency(job.productPrice)} per {unitCounts[job.id]} enhet(er)</span>
							</div>
							<span>{toCurrency(job.price)}</span>
						</div>)}
				</div>))}
			</div>

			{/*TOTAL PRICE*/}
			<div className="mb-4">
				<h1 className="text-2xl font-bold mb-2">TOTALT PRIS ink moms</h1>
				<span>{toCurrency((jobs.map(job => job.price).reduce((prev, curr) => curr + prev, 0)))}
				</span>
			</div>

			{/*Email section	*/}
			<form className={"flex flex-col space-y-4"} onSubmit={handleSubmitEmail}>
				<div className="flex flex-col">
					<label className="font-bold mb-2" htmlFor="name">Name:</label>
					<input
						className="border border-gray-300 rounded-lg py-2 px-3"
						type="text"
						name="name"
						id="name"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col">
					<label className="font-bold mb-2" htmlFor="email">Email:</label>
					<input
						className="border border-gray-300 rounded-lg py-2 px-3"
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>
				</div>
				<button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						type="submit">Submit
				</button>
			</form>
			{isSubmitted && (<div className="text-green-500">Formuläret skickades framgångsrikt!</div>)}
			{isSubmitted === false && (
				<div className="text-red-500">Formulärsändningen misslyckades. Försök igen.</div>)}
		</div>)
}

function SearchBoatForm({searchTerm, handleSearch, setSearchTerm, searchResults, handleItemClick}) {
	return (<div className="flex flex-col items-left">
		<form onSubmit={handleSearch} className="flex items-center space-x-2">
			<input
				type="text"
				id="searchTerm"
				value={searchTerm}
				onChange={(event) => setSearchTerm(event.target.value)}
				required
				className="border border-gray-300 rounded-md py-2 px-4 w-80 sm:w-auto"
			/>
			<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
				Sök
			</button>
		</form>
		<ul className="mt-4 max-h-60 overflow-y-auto">
			{searchResults.map((result) => (<li
				className={"cursor-pointer hover:bg-gray-100"}
				key={result.ItemId}
				onClick={() => handleItemClick({
					itemId: result.ItemId, brandName: result.BrandName, modelName: result.ModelName,
				})}
			>
				{result.BrandName} {result.ModelName}
			</li>))}
		</ul>
	</div>);
}

function BoatFormSection({
							 boatModel,
							 setBoatModel,
							 boatLength,
							 setBoatLength,
							 boatWidth,
							 setBoatWidth,
							 ServiceType,
							 jobs,
							 handleVariant,
							 handlePriceObject,
							 unitCounts,
							 handleUnitCount,
							 priceObject,
						 }) {
	
	const renderBoatTypeInput = () => (
		<label className="flex flex-col">
			<div className="mt-4 flex flex-col">
        <span className="text-sm italic mb-1">
          Sök på båt ovanför och välj. Båttyp, längd och bredd populeras då.
        </span>
				<span className="text-sm italic mb-1">Om du inte hittar skriv in manuellt.</span>
			</div>
			<span className="mb-1">Båttyp:</span>
			<input
				type="text"
				name="boat-length"
				value={boatModel}
				onChange={(event) => setBoatModel(event.target.value)}
				className="border border-gray-300 rounded-md p-2"
				min="0"
				step="0.1"
				required
			/>
		</label>
	);

	const renderBoatLengthInput = () => (
		<label className="flex flex-col">
			<span className="mb-1">Båtlängd (meter):</span>
			<input
				type="number"
				name="boat-length"
				value={boatLength}
				onChange={(event) => setBoatLength(event.target.value)}
				className="border border-gray-300 rounded-md p-2"
				min="0"
				step="0.1"
				required
			/>
		</label>
	);

	const renderBoatWidthInput = () => (
		<label className="flex flex-col">
			<span className="mb-1">Båtbredd (meter):</span>
			<input
				type="number"
				name="boat-width"
				value={boatWidth}
				onChange={(event) => setBoatWidth(event.target.value)}
				className="border border-gray-300 rounded-md p-2"
				min="0"
				step="0.1"
				required
			/>
		</label>
	);

	const renderServiceTypes = () =>
		Object.entries(ServiceType).map(([key, value]) => (
			<div key={key} className="flex items-center space-x-2">
				<label className="flex items-center">
					{value.priceType === "SQM" && value.variants ? (
						<div className="flex flex-col">
							{/* IF HAS VARIANTS */}
							{value.label}
							{Object.entries(value.variants).map(([variantKey, variant]) => (
								<label className="flex flex-row" key={variantKey}>
									<div className="flex space-x-4">
										<label className="flex items-center">
											<input
												type="checkbox"
												name={`${key}.${variantKey}`}
												value={`${key}.${variantKey}`}
												checked={jobs.some(job => job.id === key && job.variantId === variantKey)}
												onChange={handleVariant}
												className="mr-2"
											/>
											{variant.label}
										</label>
									</div>
								</label>
							))}
						</div>
					) : value.priceType === "SQM" && (
						<label>
							<input
								type="checkbox"
								name={key}
								value={key}
								checked={priceObject.includes(key)}
								onChange={handlePriceObject}
								className="mr-2"
							/>
							{value.label}
						</label>
					)}
					{value.priceType === "unit" && (
						<label className="flex flex-row">
							<select
								className={"mx-2 border-2 border-solid border-black"}
								name={key}
								value={unitCounts[key]}
								onChange={handleUnitCount}
							>
								<option value={0}>0</option>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
							</select>
							{value.label}
						</label>
					)}
				</label>
			</div>
		));
	return (
		<form className="flex flex-col space-y-4 mb-4">
			{renderBoatTypeInput()}
			{renderBoatLengthInput()}
			{renderBoatWidthInput()}
			{renderServiceTypes()}
		</form>
	);
}

export const priceTypeToT = (priceType) => {
	if (priceType === "SQM") {
		return "KVM";
	}
	if (priceType === "unit") {
		return "enhet";
	}
}

export const toCurrency = (price) => {
	const formattedAmount = price.toLocaleString('sv-SE', {
		style: 'currency', currency: 'SEK', maximumFractionDigits: 0
	});
	return formattedAmount
}
