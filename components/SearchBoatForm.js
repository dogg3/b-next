// SearchBoatForm.js

import React from 'react';

export default function SearchBoatForm({
										   searchTerm,
										   handleSearch,
										   setSearchTerm,
										   searchResults,
										   handleItemClick,
									   }) {
	return (
		<div className="flex flex-col items-left">
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
				{searchResults.map((result) => (
					<li
						className={"cursor-pointer hover:bg-gray-100"}
						key={result.ItemId}
						onClick={() =>
							handleItemClick({
								itemId: result.ItemId,
								brandName: result.BrandName,
								modelName: result.ModelName,
							})
						}
					>
						{result.BrandName} {result.ModelName}
					</li>
				))}
			</ul>
		</div>
	);
}
