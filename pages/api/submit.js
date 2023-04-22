export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, email, priceObject } = req.body;
		console.log(name, email, priceObject)
		try {
			// Handle the request asynchronously
			const response = await fetch(`https://formspree.io/f/moqzyldy`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, priceObject }),
			});
			const data = await response.json();
			res.status(200).json({ message: 'Success', data });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}
