## Illustrates how to use firebase functions to recieve paystack webhook

I expose three (3) functions (route):
#
- ## Default hello world function (route)
  Default helloworld route
- https://us-central1-function-example.cloudfunctions.net/helloWorld
  ## Paystack Route
  This is the one you submit to paystack
  It only handles POST method see the functions/index.js file
- https://us-central1-function-example.cloudfunctions.net/payStackHook
  ## Test route
  This is just to demostrate that you can create multiple functions (routes)
- https://us-central1-function-example.cloudfunctions.net/test


Check the `functions/index.js` folder for implementation

To initialize function in an existing code use:

`firebase init functions`