const functions = require('firebase-functions');
const crypto = require('crypto');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!");
});

exports.test = functions.https.onRequest((request, response) => {
	response.send("Hello, this is a test response from the test function.");
});

/**
 * see documentation for paystack webhook here - https://developers.paystack.co/docs/events
 */
exports.payStackHook = functions.https.onRequest((request, response) => {

	/**
	 * Restric this function to POST request Only
	 * Respond with status code 500 for all GET request
	 */
	if (request.method !== 'POST') response.status(500).end();

	/**
	 * Make sure request is comming from paystack
	 * This can be done by
	 * - Make sure IP making the request is a valid paystack API
	 * - Validate HMAC SHA512 signature header sent with the request X-Paystack-Signature
	 * @see https://developers.paystack.co/docs/events#section-confirming-events - How to validate request from paystack
	 * @var { String } secret is the secret key from your paystack dashboard - This should be in your .env file
	 */
	let secret = ''; // The value for this should be in .env file ( let secret = process.env.secret )

	// using the second validation method
	let hash = crypto.createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex');
	/**
	 * Return status 500 if signature does not match
	 */
	if (hash !== request.headers['X-Paystack-Signature']) response.status(500).send('Invalid Signature');

	/**
	 * Responde to event here
	 * @see https://developers.paystack.co/docs/events#section-responding-to-an-event for structure of response from paystack
	 *
	 * @see https://developers.paystack.co/docs/events#section-types-of-events for events types
	 */
	const { body } = request;
	if (body.event === 'subscription.create') {
		// handle subscription event
	} else if (body.event === 'charge.success') {
		// handle charge
	} else if (body.event === 'transfer.success') {
		// handle transfer
	} else if (body.event === 'invoice.update') {
		// handle invoice successfully charged
	} else {
		// handle accordingly
	}

	/**
	 * Respond with status 200, to notify paystack that event has been recieved
	 * @see  https://developers.paystack.co/docs/events#section-responding-to-an-event to see how paystack handle response
	 */
	response.status(200);

});