import { priceTypeToT, sqmFunc, toCurrency } from "../../components/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface Job {
	label: string;
	variantId?: string;
	price: number;
	productPrice: number;
	priceType: string;
	amount?: number;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	if (req.method === 'POST') {
		try {
			const {
				name,
				email,
				boatModel,
				boatLength,
				boatWidth,
				jobs,
			}: {
				name: string;
				email: string;
				boatModel: string;
				boatLength: number;
				boatWidth: number;
				jobs: Job[];
			} = req.body;
			
			
			const emailContent = generateEmailContent(
				name,
				email,
				boatModel,
				boatLength,
				boatWidth,
				jobs
			);
			const response = await sendEmail(emailContent, name, boatModel);
			if (response.error) {
				res.status(500).json({ message: 'Internal', data: response.error });
			} else {
				res.status(200).json({ message: 'Success', data: response.data });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}

function generateEmailContent(
	customerName: string,
	customerEmail: string,
	boatModel: string,
	boatLength: number,
	boatWidth: number,
	jobs: Job[]
): string {
	const company = 'Ramsövarvet';
	const emailHeader = `Hej ${company}, Vi har genererat följande kund från er hemsida.\n\n`;
	const customerInfo = `Namn: ${customerName}\nEmail: ${customerEmail}\nBåtmodell: ${boatModel}\nLängd: ${boatLength}\nBredd: ${boatWidth}\nKvadratmeter (Bredd + 1) x (Längd) = ${sqmFunc(
		boatLength,
		boatWidth
	)}\n\n`;
	
	const jobLines = jobs.map((job) => {
		let label = job.label;
		if (job.variantId) {
			label = job.label;
		}
		
		let line = `${toCurrency(job.price)} - ${label} (${toCurrency(
			job.productPrice
		)} per ${toCurrency(priceTypeToT(job.priceType.toString()))})`;
		if (job.amount) {
			line += ` - ${job.amount} Stycken`;
		}
		return line;
	});

	const totalPrice = jobs.reduce((total, job) => total + job.price, 0);
	const emailFooter = `\n\n${toCurrency(totalPrice)} TOTALT\nVänligen följ upp med denna kund så snart som möjligt.\n\nTack för ert samarbete.\nMed vänliga hälsningar,boat-admin.io`;

	return `${emailHeader}${customerInfo}${jobLines.join('\n')}${emailFooter}`;
}

async function sendEmail(
	emailContent: string,
	name: string,
	boatModel: string
): Promise<{ data?: string; error?: Error }> {
	try {
		const encodedContent = encodeURIComponent(emailContent);
		const response = await fetch(`https://formspree.io/f/moqzyldy`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `kund=${name}&modell=${boatModel}&meddelande=${encodedContent}`,
		});
		const data = await response.text();
		return { data };
	} catch (error) {
		console.error(error);
		// @ts-ignore
		return { error };
	}
}
