// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					{/* Include the Smartlook script here */}
					<script
						type="text/javascript"
						dangerouslySetInnerHTML={{
							__html: `
                window.smartlook||(function(d) {
                  var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
                  var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
                  c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
                })(document);
                smartlook('init', '23aa9c3d9a73dccae613a91858ea088208d7d5fc', { region: 'eu' });
                smartlook('record', {
                  forms: true,
                  numbers: true,
                  emails: false,
                  ips: true,
                });
              `,
						}}
					/>
				</Head>
				<body>
				<Main />
				<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
