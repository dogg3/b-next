export default async function handler(req, res) {
	if (req.method === 'POST') {
		console.log(req.body)
		const {name, email, boatModel, boatLength, boatWidth, jobsCopied} = req.body;
		console.log("Ramsövarvet", name, email, boatModel, boatLength, boatWidth, jobsCopied)
		try {
			const htmlContent = formatEmail(
				"Ramsövarvet",
				name,
				email,
				boatModel,
				boatLength,
				boatWidth,
				jobsCopied
			);
			const encodedContent = encodeURIComponent(htmlContent);

			const response = await fetch(`https://formspree.io/f/moqzyldy`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `kund=${name}&modell=${boatModel}&meddelande=${encodedContent}`,
			});
			const data = await response.text();
			console.log(data);
			if (data?.error) {
				res.status(500).json({message: 'internal', data: data});
			}
			res.status(200).json({message: 'Success', data});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Internal server error'});
		}
	} else {
		res.status(405).json({message: 'Method not allowed'});
	}
}


function formatEmail(company, customerName, customerEmail, boatModel, boatLength, boatWidth, jobs) {
	let emailContent = `Hej ${company}, Vi har genererat följande kund från er hemsida.\n\n`
	emailContent  += `Namn: ${customerName}\n`;
	emailContent  += `Email: ${customerEmail}\n`;
	emailContent  += `Båtmodell: ${boatModel}\n`;
	emailContent  += `Längd: ${boatLength}\n`;
	emailContent  += `Bredd: ${boatWidth}\n`;
	emailContent  += `Kvadratmeter (Bredd + 0.5) x (Längd + 0.5): ${sqmFunc(boatLength,boatWidth)}	\n\n`;
	let totalprice = 0;
	jobs.forEach((job, index) => {
		let line = `- ${job.label}: Pris: ${job.price} SEK`;
		if (job.amount) {
			line += ` | ${job.amount} Stycken`;
		}
		emailContent += `${line}\n`;
		totalprice += job.price;
	});

	emailContent  += `\nTotalt pris: ${totalprice}\n SEK`;
	emailContent += `\nVänligen följ upp med denna kund så snart som möjligt.

	Tack för ert samarbete.

	Med vänliga hälsningar,
	boat-admin.io`;
	return emailContent;
}

const sqmFunc = (length, width) => {
	return Math.round((clean(length) + 0.5) * (clean(width) + 0.5))
}

function clean(str) {
	return parseFloat(str.replace(",", "."));
}
