export const environment = {
  production: true,



  //Configuration for testing
  
  firebaseConfig : {
    //Settings for testing environment
    apiKey: "AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw",
    authDomain: "zenyscustomer.firebaseapp.com",
    databaseURL: "https://zenysdevelopment.firebaseio.com",
    projectId: "zenysdevelopment",
    storageBucket: "zenysdevelopment.appspot.com",
    messagingSenderId: "1059747170002",
    appId: "1:1059747170002:web:ad21cf215001a49c9a8f0b",
    measurementId: "G-HWESCK7QW6 "
  },

  cloudFunctions : {
    createOrder: 'https://asia-east2-zenysdevelopment.cloudfunctions.net/createOrder',
    capturePayment: 'https://asia-east2-zenysdevelopment.cloudfunctions.net/capturePayments',
    subscription:"https://asia-east2-zenysdevelopment.cloudfunctions.net/subscriptions",
    getpayment:"https://asia-east2-zenysdevelopment.cloudfunctions.net/getpayment",
    subplans:"https://asia-east2-zenysdevelopment.cloudfunctions.net/getplansubs",
    invoices:"https://asia-east2-zenysdevelopment.cloudfunctions.net/getallinvoice",
    makepaylink:"https://asia-east2-zenysdevelopment.cloudfunctions.net/axiostest",
    collectionOperation:"https://asia-east2-zenysdevelopment.cloudfunctions.net/collectionOperation",

  },
  RAZORPAY_KEY_ID: 'rzp_test_80BuFHmAHC5gaW', //API key for test mode
  RAZORPAY_KEY_SECRET: '7LL8oqtYxzq1Y3dEwOUxwzCP', //secret key for test mode
  RZP_MONTHLY_PLAN_ID : 'plan_HUM07eOoNPL468',
  RZP_YEARY_PLAN_ID : 'plan_HUM0WNozVCbSHX',
};
