const chai = require("chai");
const assert = chai.assert;
const admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: "AIzaSyBEsyttWXcqNuOYHwMeEF487o__K2h5hsg",
  authDomain: "paystack-webhook-project.firebaseapp.com",
  databaseURL: "https://paystack-webhook-project.firebaseio.com",
  projectId: "paystack-webhook-project",
  storageBucket: "paystack-webhook-project.appspot.com",
  messagingSenderId: "529675048514",
  appId: "1:529675048514:web:da81595dbe047fcba3ffdb"
};
const test = require('firebase-functions-test')(firebaseConfig, '../test-cloud-258123-8b535e4067bd.json');

// const wrapped = test.wrap(paystack_function.payStackHook);

describe("Paystack Webhook", () => {
  let paystack_function;

  before(() => {
    paystack_function = require("../index.js");
  });

  after(() => {
    test.cleanup();
    admin.database().ref("transactions").remove();
  });

  describe("send hook", () => {
    it("should return 200", (done) => {
      const req = {
        query: {
          event: "charge.success", email: "test@gmail.com", amount: "100000", txRef: "123456789Hello"
        }
      };

      const res = {
        redirect: (code, url) => {
          assert.equal(code, 303);
          done();
        }
      };
      paystack_function.payStackHook(req, res);
    });
  });
});
