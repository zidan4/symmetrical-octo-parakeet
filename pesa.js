// MPesa Integration for Ecommerce Store
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Replace with your actual credentials
const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';
const shortCode = 'YOUR_SHORTCODE';
const passkey = 'YOUR_PASSKEY';
const callbackURL = 'https://yourdomain.com/mpesa/callback';

// Get MPesa access token
async function getAccessToken() {
	const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
	const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
	const headers = { Authorization: `Basic ${auth}` };
	const response = await axios.get(url, { headers });
	return response.data.access_token;
}

// Lipa Na Mpesa Online Payment (STK Push)
app.post('/mpesa/pay', async (req, res) => {
	try {
		const { phone, amount } = req.body;
		const accessToken = await getAccessToken();
		const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
		const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

		const payload = {
			BusinessShortCode: shortCode,
			Password: password,
			Timestamp: timestamp,
			TransactionType: 'CustomerPayBillOnline',
			Amount: amount,
			PartyA: phone,
			PartyB: shortCode,
			PhoneNumber: phone,
			CallBackURL: callbackURL,
			AccountReference: 'EcommerceStore',
			TransactionDesc: 'Payment for goods',
		};

		const response = await axios.post(
			'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
			payload,
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);
		res.json(response.data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// MPesa Callback Endpoint
app.post('/mpesa/callback', (req, res) => {
	// Handle payment confirmation here
	console.log('MPesa Callback:', JSON.stringify(req.body));
	res.json({ status: 'Received' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`MPesa integration server running on port ${PORT}`);
});

