import React from 'react';
import { toCurrency, sqmFunc } from './utils';

const PricingSection = ({ boatWidth, boatLength, jobs, ServiceType, unitCounts }) => {
	const calculatedSqm = sqmFunc(boatLength, boatWidth);

	return (
		<div className="mb-4">
			<h1 className="text-2xl font-bold mb-2">PRIS</h1>
			{boatWidth !== 0 && boatLength !== 0 && (
				<div className="italic mb-4 text-sm">
					kvm = ({boatLength} meter) * ({boatWidth} meter bredd + 0.5) = {calculatedSqm}
				</div>
			)}
			{jobs.map((job) => (
				<div key={job.id} className="flex justify-between">
					{ServiceType[job.id].priceType === 'SQM' && (
						<div className="flex flex-row justify-between w-full mb-4">
							<div className="flex flex-col">
								<span>{job.label} </span>
								<span>
                  {toCurrency(job.productPrice)} per {calculatedSqm} kvm
                </span>
							</div>
							<span>{toCurrency(calculatedSqm * job.productPrice)}</span>
						</div>
					)}
					{ServiceType[job.id].priceType === 'unit' && (
						<div className="flex flex-row justify-between w-full mb-4">
							<div className="flex flex-col">
								<span>{job.label} </span>
								<span>
                  {toCurrency(job.productPrice)} per {unitCounts[job.id]} enhet(er)
                </span>
							</div>
							<span>{toCurrency(job.price)}</span>
						</div>
					)}
				</div>
			))}
			<div className="mb-4">
				<h1 className="text-2xl font-bold mb-2">TOTALT PRIS ink moms</h1>
				<span>
          {toCurrency(jobs.map((job) => job.price).reduce((prev, curr) => curr + prev, 0))}
        </span>
			</div>
		</div>
	);
};

export default PricingSection;
