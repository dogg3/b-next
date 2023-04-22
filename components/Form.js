import React, {useState} from 'react';


export const ServiceType = {
	WinterStay: {
		label: "vinterplats",
		prices: {
			outdoor: 500,
			inside: 1100,
		}

	},
	EngineConservation: {
		label: "Konservering av motorer",
		price: 1700,
		priceType: "unit",
	}, Batteries: {
		label: "Batterier", price: 450, priceType: "unit",
	}, FreshwaterSystemConservation: {
		label: "Konservering färskvattensystem", price: 1300, priceType: "unit",
	}, SepticTankConservation: {
		label: "Konservering av septitank", price: 1300, priceType: "unit",
	}, HaulOut: {
		label: "Upptagning och sjösättning", price: 180, priceType: "SQM",
	}, HullCleaning: {
		label: "Bottentvätt", price: 60, priceType: "SQM",
	}, ShrinkWrap: {
		label: "Täckning med krymplast", price: 350, priceType: "SQM", filter: "outdoor",
	},
};

const sqmPriceFun = (sqm, price) => {
	return sqm * price
}

export const BoatForm = () => {
	const [boatLength, setBoatLength] = useState(0);
	const [boatWidth, setBoatWidth] = useState(0);

	//PriceObjects 
	const [isIndoors, setIsIndoors] = useState(true);
	const [isOutdoors, setIsOutdoors] = useState(false);
	const [priceObject, setPriceObject] = useState([])
	const [totPrice, setTotPrice] = useState(0)

	const [unitCounts, setUnitCounts] = useState({});

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


	function clean(str) {
		return parseFloat(str.replace(",", "."));
	}

	//Handlers
	const handleIndoorsChange = (event) => {
		setIsIndoors(event.target.checked);
		setIsOutdoors(!event.target.checked);
	};
	const handleOutdoorsChange = (event) => {
		setIsOutdoors(event.target.checked);
		setIsIndoors(!event.target.checked);
	};

	const handlePriceObject = async (event) => {
		const value = event.target.value;
		const isChecked = event.target.checked;
		if (isChecked) {
			let updated = updateTotPrice(value);
			if (!updated) {
				return false;
			}
		}
		if (!isChecked) {
			//	pop
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
					alert("Please set boat length and width in order to calculate price.");
					return false;
				}
				let sqm = sqmFunc(boatLength * boatWidth);
				let price = sqmPriceFun(sqm, serviceType.price);
				job = {id: serviceTypeKey, price: price};
				break;
			case "unit":
				let unitprince = 0
				if (unitcounts[serviceTypeKey] > 0) {
					unitprince = unitcounts[serviceTypeKey] * serviceType.price;
				}
				if (unitprince === 0) {
					return false;
				}
				console.log("unitpridce", unitprince)
				job = {id: serviceTypeKey, price: unitprince};
				break;
		}

		setJobs(prevItems => {
			const index = prevItems.findIndex(item => item.id === job.id);
			if (index === -1) {
				// If no job with the same id exists, add the new job with the id property
				return [...prevItems, job];
			} else {
				// If a job with the same id exists, update it with the new price
				const updatedItems = [...prevItems];
				updatedItems[index].price = job.price;
				return updatedItems;
			}
		});

		setTotPrice(job.price + totPrice);
		return true;
	}

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(null);
	const handleSubmitEmail = async (event) => {
		event.preventDefault();
		const response = await fetch('/api/submit', {
			method: 'POST', headers: {
				'Content-Type': 'application/json',
			}, body: JSON.stringify({name, email, priceObject, totPrice}),
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

	const [boatModel, setboatModel] = useState('');
	const [boatId, setBoatId] = useState('');
	const handleItemClick = (item) => {
		const {itemId, brandName, modelName} = item;
		setboatModel(`${brandName} ${modelName}`);
		setBoatId(itemId);
		setSearchResults([])
		updateDimensions(itemId)
	};

	const updateDimensions = async (boatId) => {
		try {
			const response = await fetch(`https://items.sokbat.se/api/item/v1/${boatId}`);
			const data = await response.json();
			setBoatLength(data.Length);
			setBoatWidth(data.Width);
		} catch (error) {
			console.log(error);
		}
	}


	const sqmFunc = (length, width) => {
		return Math.round((clean(boatLength) + 0.5) * (clean(boatWidth) + 0.5))
	}
	return (<div className="p-4 bg-amber-50">
		{/*Search boat form*/}
		<div className="flex flex-col items-left">
			<form onSubmit={handleSearch} className="flex items-center space-x-2">
				<label>
					Sök efter båt:
				</label>
				<input
					type="text"
					id="searchTerm"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					required
					className="border border-gray-300  rounded-md py-2 px-4 w-80 sm:w-auto"
				/>
				<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
					Sök
				</button>
			</form>
			<ul className="mt-4 max-h-60 overflow-y-auto">
				{searchResults.map((result) => (
					<li className={"cursor-pointer hover:bg-gray-100"} key={result.ItemId}
						onClick={() => handleItemClick({
							itemId: result.ItemId, brandName: result.BrandName, modelName: result.ModelName
						})}>
						{result.BrandName} {result.ModelName}
					</li>))}
			</ul>
		</div>
		<div className={"h-[20px]"}/>

		{/*service jobs*/}
		<form className="flex flex-col space-y-4 mb-4">
			<label className="flex flex-col">
				<div className="mt-4 flex flex-col">
					<span className="text-sm italic mb-1">Sök på båt ovanför och välj. Båttyp, längd och bredd populeras då.</span>
					<span className="text-sm italic mb-1">Om du inte hittar skriv in manuellt.</span>
				</div>
				<span className="mb-1">Båttyp:</span>
				<input
					type="text"
					name="boat-length"
					value={boatModel}
					onChange={(event) => setboatModel(event.target.value)}
					className="border border-gray-300 rounded-md p-2"
					min="0"
					step="0.1"
					required
				/>
			</label>
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
			<label className="flex flex-col">
				<span className="mb-1">Placering:</span>
				<div className="flex space-x-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							name="location"
							value="outdoors"
							checked={isOutdoors}
							onChange={handleOutdoorsChange}
							className="mr-2"
						/>
						Utomhus
					</label>
					<label className="flex items-center">
						<input
							type="checkbox"
							name="location"
							value="indoors"
							checked={isIndoors}
							onChange={handleIndoorsChange}
							className="mr-2"
						/>
						Inomhus
					</label>
				</div>
			</label>
			{Object.entries(ServiceType).map(([key, value]) => (
				<div key={key} className="flex items-center space-x-2">
					<label className="flex items-center">
						{value.priceType === "SQM" && (<input
							type="checkbox"
							name={key}
							value={key}
							checked={priceObject.includes(key)}
							onChange={handlePriceObject}
							className="mr-2"
						/>)}

						{
							value.label != "vinterplats" ?
								value.label
								: ""
						}
						{value.priceType === "unit" && (<div>
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
						</div>)}
					</label>
					{
						value.label === "vinterforvaring" ?
							<div>
								<span> | {value.price} SEK</span>
								<span>{value.priceType.value.priceType == "SQM" ? "per kvadratmeter" : "per enhet"}</span>
							</div>
							: ""
					}
				</div>))}
		</form>

		{/*OUTPUT PRICE AREA*/}
		<div className="mb-4">
			<h1 className="text-2xl font-bold mb-2">PRIS</h1>
			{/*TYPE OF WINTERSTAY*/}

			{boatWidth != 0 && boatLength != 0 &&
				<span className="italic mb-[20px]">kvm = ({boatLength} meter längd + 0.5) * ({boatWidth} meter bredd + 0.5) =
					{sqmFunc(boatLength, boatWidth)} 
				</span>
			}
			<div className={"flex flex-row justify-between"}>
				Vinterförvaring {
				isIndoors ? "inomus" : "utomhus"
			}
				<div>{isIndoors ? ServiceType.WinterStay.prices.inside : ServiceType.WinterStay.prices.outdoor} SEK</div>
			</div>

			{jobs.map((field) => (<div key={field.id} className="flex justify-between">
				{ServiceType[field.id].priceType == "SQM" && (
					<div className={"flex flex-row justify-between w-full"}>
						<span>{ServiceType[field.id].price} SEK per {sqmFunc(boatLength, boatWidth)} kvm</span>
						<span>{field.price} SEK</span>
					</div>)
				}
				{ServiceType[field.id].priceType == "unit" && (
					<div className={"flex flex-row justify-between w-full"}>
						<span>{ServiceType[field.id].price} SEK à {unitCounts[field.id]} enhet(er)</span>
						<span>{field.price} SEK</span>
					</div>)
				}
			</div>))}
		</div>

		{/*TOTAL PRICE*/
		}
		<div className="mb-4">
			<h1 className="text-2xl font-bold mb-2">TOTALT PRIS</h1>
			<span>{(jobs.map(job => job.price).reduce((prev, curr) => curr + prev, 0)) +
				(isIndoors ? ServiceType.WinterStay.prices.inside : ServiceType.WinterStay.prices.outdoor)
			}
				kr</span>
		</div>


		{/*Email section	*/
		}
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
		{
			isSubmitted && (<div className="text-green-500">Formuläret skickades framgångsrikt!</div>)
		}
		{
			isSubmitted === false && (
				<div className="text-red-500">Formulärsändningen misslyckades. Försök igen.</div>)
		}
	</div>)
}
