import React, {useEffect, useState} from 'react';
import BoatFormSection from "./BoatFormSection";
import SearchBoatForm from "./SearchBoatForm";
import PricingSection from "./PricingSection";
import EmailSection from "./EmailSection";
import {sqmFunc} from "./utils";
import {getServiceTypesAPI, handleSearchAPI, submitEmailAPI, updateDimensionsAPI} from "./api";

export const BoatForm = () => {
	const [boatLength, setBoatLength] = useState(0);
	const [boatWidth, setBoatWidth] = useState(0);
	const [ServiceType, setServiceType] = useState();

	useEffect(() => {
		async function fetchData() {
			try {
				const serviceTypes = await getServiceTypesAPI();
				console.log("serviceTypes", serviceTypes)
				setServiceType(serviceTypes);
			} catch (error) {
				console.log(error);
			}
		}
		fetchData();
	}, [])

	//PriceObjects 
	const [priceObject, setPriceObject] = useState([])
	const [unitCounts, setUnitCounts] = useState({});


	// handleUnitCount is for unit pricetypes
	const handleUnitCount = async (event) => {
		const key = event.target.name;
		const count = event.target.value;
		if (count === 0) {
			await setJobs((prev) => prev.filter((v) => v.id !== key));
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
	const handleSQMPriceTypeChange = async (event) => {
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
				let sqm = sqmFunc(boatLength, boatWidth);
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
		setJobs((prevItems) => {
			const index = prevItems.findIndex((item) => item.id === job.id);
			if (index === -1) {
				// If no job with the same id exists, add the new job with the id property
				return [...prevItems, job];
			}
			// If a job with the same id exists, overwrite it with the new job object
			const updatedItems = [...prevItems];
			updatedItems[index] = job;
			return updatedItems;
		});
	};

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(null);

	const handleSubmitEmail = async (event) => {
		event.preventDefault();
		if (!boatModel) {
			alert("Båtmodell är obligatoriskt att fylla i!");
			return;
		}
		if (!boatWidth) {
			alert("Båtbredd obligatoriskt att fylla i!");
			return;
		}
		if (!boatLength) {
			alert("Båtlängd är obligatoriskt att fylla i!");
			return;
		}

		const jobsCopied = jobs.slice();

		jobsCopied.map((job) => {
			if (ServiceType[job.id].priceType === "unit") {
				job.amount = unitCounts[job.id];
				return job;
			}
			return job;
		});

		const emailData = {
			name,
			email,
			boatModel,
			boatLength,
			boatWidth,
			jobs: jobsCopied,
		};
		const isSubmitted = await submitEmailAPI(emailData);
		setIsSubmitted(isSubmitted);
	};

	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const handleSearch = async (event) => {
		event.preventDefault()
		setSearchResults([]);
		await handleSearchAPI(searchTerm, setSearchResults); // Call the handleSearch function from api.js
	};


	const [boatModel, setBoatModel] = useState('');
	const handleItemClick = async (item) => {
		const {itemId, brandName, modelName} = item;
		setBoatModel(`${brandName} ${modelName}`);
		setSearchResults([])
		await updateDimensionsAPI(itemId, setBoatWidth, setBoatLength); // Use the updateDimensionsAPI function
	};
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
				handlePriceObject={handleSQMPriceTypeChange}
				unitCounts={unitCounts}
				handleUnitCount={handleUnitCount}
				priceObject={priceObject}
			/>
			<PricingSection
				boatWidth={boatWidth}
				boatLength={boatLength}
				jobs={jobs}
				ServiceType={ServiceType}
				unitCounts={unitCounts}
			/>
			<EmailSection
				name={name}
				email={email}
				isSubmitted={isSubmitted}
				setName={setName}
				setEmail={setEmail}
				handleSubmitEmail={handleSubmitEmail}
			/>
		</div>
	)
}

