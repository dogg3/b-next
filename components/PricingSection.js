// PricingSection.js
import React from 'react';

const PricingSection = ({ boatWidth, boatLength, jobs, ServiceType, unitCounts }) => {
  const sqmFunc = () => {
    return Math.round(parseFloat(boatLength) * (0.5 + parseFloat(boatWidth)));
  };

  const toCurrency = (price) => {
    const formattedAmount = price.toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    });
    return formattedAmount;
  };

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-2">PRIS</h1>
      {boatWidth !== 0 && boatLength !== 0 && (
        <div className="italic mb-4 text-sm">
          kvm = ({boatLength} meter) * ({boatWidth} meter bredd + 0.5) = {sqmFunc()}
        </div>
      )}
      {jobs.map((job) => (
        <div key={job.id} className="flex justify-between">
          {ServiceType[job.id].priceType === 'SQM' && (
            <div className="flex flex-row justify-between w-full mb-4">
              <div className="flex flex-col">
                <span>{job.label} </span>
                <span>
                  {toCurrency(job.productPrice)} per {sqmFunc()} kvm
                </span>
              </div>
              <span>{toCurrency(sqmFunc() * job.productPrice)}</span>
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
    </div>
  );
};

export default PricingSection;
