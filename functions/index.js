const crypto = require('crypto');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * see documentation for paystack webhook here - https://developers.paystack.co/docs/events
 */
exports.payStackHook = functions.https.onRequest((request, response) => {

	const { method, headers, body } = request;

	/**
	 * Restric this function to POST request Only
	 * Respond with status code 500 for all GET request
	 */
	if (method !== 'POST') response.status(500).end();

	/**
	 * Make sure request is comming from paystack
	 * This can be done by
	 * - Make sure IP making the request is a valid paystack API
	 * - Validate HMAC SHA512 signature header sent with the request X-Paystack-Signature
	 * @see https://developers.paystack.co/docs/events#section-confirming-events -
	 * How to validate request from paystack
	 * @var { String } secret is the secret key from your paystack dashboard - This should be in your .env file
	 */
	let secret = ''; // The value for this should be in .env file ( let secret = process.env.secret )

	// using the second validation method
	let hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex');

	//  Return status 500 if signature does not match
	if (hash !== headers['X-Paystack-Signature']) response.status(500).send('Invalid Signature');

	/**
	 * Responde to event here
	 * @see https://developers.paystack.co/docs/events#section-responding-to-an-event
	 * for structure of response from paystack
	 *
	 * @see https://developers.paystack.co/docs/events#section-types-of-events
	 * for events types
	 */
	const { event, txRef, email, amount } = body;
	if (event === 'subscription.create') {
		// new subcription
		const write_doc = await admin.firestore().collection("subscriptions").add({
			txRef, email, amount,
			status: "",
		});
	} else if (event === 'charge.success') {
		// charge was successful - recurring
		const write_doc = await admin.firestore().collection("subscriptions").add({
			txRef, email, amount
		});
	} else if (event === 'transfer.success') {
		// handle transfer
	} else if (event === 'invoice.update') {
		// handle invoice successfully charged - one time payment
	} else {
		// transaction failed - error
		const write_doc = await admin.firestore().collection("subscriptions").add({
			txRef, email, amount,
			status: "error",
		});
	}

	/**
	 * Respond with status 200, to notify paystack that event has been recieved
	 * @see  https://developers.paystack.co/docs/events#section-responding-to-an-event
	 * to see how paystack handle response
	 */
	response.status(200);

});
