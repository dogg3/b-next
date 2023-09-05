import React from "react";
import {
	BOAT_LENGTH_LABEL,
	BOAT_TYPE_LABEL, BOAT_WIDTH_LABEL,
	PRICE_TYPE_SQM,
	PRICE_TYPE_UNIT
} from "./utils";

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
	const renderInputField = (label, name, value, onChange, type = "text") => (
		<label className="flex flex-col">
			<span className="mb-1">{label}</span>
			<input
				type={type}
				name={name}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				className="border border-gray-300 rounded-md p-2"
				min="0"
				step="0.1"
				required
			/>
		</label>
	);

	const renderServiceVariants = (key, value) => {
		if (value.priceType === PRICE_TYPE_SQM && value.variants) {
			return (
				<div key={key} className="flex flex-col">
					{value.label}
					{Object.entries(value.variants).map(([variantKey, variant]) => (
						<label className="flex flex-row" key={variantKey}>
							<div className="flex space-x-4">
								<label className="flex items-center">
									<input
										type="checkbox"
										name={`${key}.${variantKey}`}
										value={`${key}.${variantKey}`}
										checked={jobs.some(
											(job) => job.id === key && job.variantId === variantKey
										)}
										onChange={handleVariant}
										className="mr-2"
									/>
									{variant.label}
								</label>
							</div>
						</label>
					))}
				</div>
			);
		}

		if (value.priceType === PRICE_TYPE_SQM) {
			return (
				<label key={key}>
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
			);
		}

		if (value.priceType === PRICE_TYPE_UNIT) {
			return (
				<label className="flex flex-row" key={key}>
					<select
						className={"mx-2 border-2 border-solid border-black"}
						name={key}
						value={unitCounts[key]}
						onChange={handleUnitCount}
					>
						{[0, 1, 2, 3, 4, 5].map((count) => (
							<option key={count} value={count}>
								{count}
							</option>
						))}
					</select>
					{value.label}
				</label>
			);
		}

		return null;
	};

	return (
		<form className="flex flex-col space-y-4 mb-4">
			{renderInputField(BOAT_TYPE_LABEL, "boat-length", boatModel, setBoatModel)}
			{renderInputField(
				BOAT_LENGTH_LABEL,
				"boat-length",
				boatLength,
				setBoatLength,
				"number"
			)}
			{renderInputField(
				BOAT_WIDTH_LABEL,
				"boat-width",
				boatWidth,
				setBoatWidth,
				"number"
			)}
			{Object.entries(ServiceType).map(([key, value]) => (
				<div key={key} className="flex items-center space-x-2">
					<label className="flex items-center">
						{renderServiceVariants(key, value)}
					</label>
				</div>
			))}
		</form>
	);
}

export default BoatFormSection;
