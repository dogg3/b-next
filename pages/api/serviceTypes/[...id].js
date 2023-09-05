// pages/api/serviceTypes/[...id].js

const serviceType = {
	// ... Your data here ...
};

export default (req, res) => {
	const { method } = req;
	const [, id] = req.query.id;
	switch (method) {
		case 'GET':
			if (id) {
				// Retrieve a specific service type by ID
				const type = serviceType[id];
				if (type) {
					res.status(200).json(type);
				} else {
					res.status(404).json({ error: 'Service type not found' });
				}
			} else {
				// Retrieve all service types
				res.status(200).json(serviceType);
			}
			break;
		case 'PUT':
			if (id) {
				// Update a service type by ID
				if (serviceType[id]) {
					const { label, price, priceType, variants } = req.body;
					serviceType[id] = { label, price, priceType, variants };
					res.status(200).json(serviceType[id]);
				} else {
					res.status(404).json({ error: 'Service type not found' });
				}
			}
			break;
		case 'DELETE':
			if (id) {
				// Delete a service type by ID
				if (serviceType[id]) {
					delete serviceType[id];
					res.status(204).end();
				} else {
					res.status(404).json({ error: 'Service type not found' });
				}
			}
			break;
		default:
			res.status(405).json({ error: 'Method not allowed' });
	}
};
