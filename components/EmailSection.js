// EmailSection.js
import React from 'react';

const EmailSection = ({ name, email, isSubmitted, setName, setEmail, handleSubmitEmail }) => {
	return (
		<form className="flex flex-col space-y-4" onSubmit={handleSubmitEmail}>
			<div className="flex flex-col">
				<label className="font-bold mb-2" htmlFor="name">
					Name:
				</label>
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
				<label className="font-bold mb-2" htmlFor="email">
					Email:
				</label>
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
			<button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
				Submit
			</button>
			{isSubmitted && <div className="text-green-500">Formuläret skickades framgångsrikt!</div>}
			{isSubmitted === false && (
				<div className="text-red-500">Formulärsändningen misslyckades. Försök igen.</div>
			)}
		</form>
	);
};

export default EmailSection;
