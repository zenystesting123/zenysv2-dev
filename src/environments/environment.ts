// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  stripePublishableKey:
    'pk_test_51KOi86SBDfdu8I5JF3HeNk5kXHpbIuNxrUSfNRFB9z62as9Pj1t3hpTabhtMKmg2iWwajw0lpQJqQdfe2tag7hIj00BIE3Pk1g',
  // stripePublishableKey:"pk_live_51IhrAaSCUjCHJT5XNEg7uLZ9ulxitFkdV9rhoDRdjIkzA9jAIu8iCXzIGgi63cpxNEYuN7T5P5lN4gpO3b8L3jqZ00rprpBxyy",
  production: false,
  clientId:
    '1059747170002-24tpagkhb5e3iqurb3r4uagcdtd4nb71.apps.googleusercontent.com', //for GAPI
  currentUrl: 'http://127.0.0.1:4200/',
  firebaseConfig: {
    //Settings for localTesting environment
    // apiKey: "AIzaSyDkHIhzGjy358lVXGMUo12yRRGtO6OdfMI",
    // authDomain: "zenysdevelopment-f6491.firebaseapp.com",
    // databaseURL: "https://zenysdevelopment-f6491-default-rtdb.firebaseio.com",
    // projectId: "zenysdevelopment-f6491",
    // storageBucket: "zenysdevelopment-f6491.appspot.com",
    // messagingSenderId: "926474914640",
    // appId: "1:926474914640:web:276883d07682610c237a55",
    // measurementId: "G-S18ZSBDGY2"

    //Settings for development environment (OLD - COMMENTED OUT)
    // apiKey: 'AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw',
    // authDomain: 'zenysdevelopment.firebaseapp.com',
    // databaseURL: 'https://zenysdevelopment.firebaseio.com',
    // projectId: 'zenysdevelopment',
    // storageBucket: 'zenysdevelopment.appspot.com',
    // messagingSenderId: '1059747170002',
    // appId: '1:1059747170002:web:ad21cf215001a49c9a8f0b',
    // measurementId: 'G-HWESCK7QW6',

    //Settings for NEW zenysv2dev environment
    apiKey: "AIzaSyDPNitsu_KAt7goZXQ5_y-PYpEhZAWqfsI",
    authDomain: "zenysv2dev.firebaseapp.com",
    projectId: "zenysv2dev",
    storageBucket: "zenysv2dev.firebasestorage.app",
    messagingSenderId: "123233203726",
    appId: "1:123233203726:web:c62b2b8f862b39d001ee5f",
    measurementId: "G-3KGHTG6WCT"
        //Settings for Production environment
       /*apiKey: '  AIzaSyCHXy0lc_CPwPa8mPL0WIRGlvsjsWbUJb4',
         authDomain: 'zenysproduction.firebaseapp.com',
         projectId: 'zenysproduction',
         storageBucket: 'zenysproduction.appspot.com',
        messagingSenderId: '1059747170002',
       appId: '1:461454236300:web:62fca20bfcfd31740bb9a9',
         measurementId: 'G-GMK88N8BFL'*/
  },

  cloudFunctions: {
    // for testing
    // createOrder]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/createOrder).
    // +  functions[asia-east2-capturePayments]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/capturePayments).
    // +  functions[asia-east2-subscriptions]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/subscriptions).
    // +  functions[asia-east2-cancelsubscriptions]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/cancelsubscriptions).
    // +  functions[asia-east2-getpayment]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/getpayment).
    // +  functions[asia-east2-getplansubs]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/getplansubs).
    // +  functions[asia-east2-getsubscription]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/getsubscription).
    // +  functions[asia-east2-getallinvoice]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/getallinvoice).
    // +  functions[asia-east2-getInvoicebyid]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/getInvoicebyid).
    // +  functions[asia-east2-getsubscriptioninv]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/getsubscriptioninv).
    // +  functions[asia-east2-axiostest]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/axiostest).
    // +  functions[asia-east2-webhooktest]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/webhooktest).
    // +  functions[asia-east2-collectionOperation]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/collectionOperation).
    // +  functions[asia-east2-mailer]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/mailer).
    // +  functions[asia-east2-nodemailer]: http function initialized (http://localhost:5000/zenysdevelopment/asia-east2/nodemailer)

    // development

    createOrder:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createOrder',
    // createOrder:"http://localhost:5000/zenysdevelopment/asia-east2/createOrder",
    capturePayment:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/capturePayments',
    subscription:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/subscriptions',
    getpayment:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/getpayment',
    subplans:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/getplansubs',
    invoices:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/getallinvoice',
    makepaylink:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/axiostest',
    collectionOperation:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/collectionOperation',
    mailer: 'https://asia-east2-zenysdevelopment.cloudfunctions.net/mailer',
    mailparser:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/mailparseincoming',
    nodemailer:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/nodemailer',
    cancelsubscription:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/cancelsubscriptions',
    getsubscriptioninvoices:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/getsubscriptioninv',
    getsubscription:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/getsubscription',
    InquiryNotification:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/InquiryNotification',
    ChatNotification:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/ChatNotification',
    sendnotification:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/sendnotification',
    contactAutomation:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/contactautomationTest',
    createSubMerchant:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createSubMerchant',
    // createSubMerchant: "http://localhost:5000/zenysdevelopment/asia-east2/createSubMerchant",
    createSubMerchantPayLink:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createSubMerchantPayLink',
    // createSubMerchantPayLink: "http://localhost:5000/zenysdevelopment/asia-east2/createSubMerchantPayLink",

    createStripe:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createStripeAccount',
    // createStripe: "http://localhost:5000/zenysdevelopment/asia-east2/createStripeAccount",

    retriveStripe:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/retrieveStripeAccount',
    // retriveStripe: "http://localhost:5000/zenysdevelopment/asia-east2/retrieveStripeAccount",

    scheduledFunction:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/scheduledFunction',
    checkoutSession:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createStripeCheckoutSession',
    // checkoutSession: "http://localhost:5000/zenysdevelopment/asia-east2/createStripeCheckoutSession",

    retrieveSession:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/retireveStripeCheckoutSession',
    // retrieveSession: "http://localhost:5000/zenysdevelopment/asia-east2/retireveStripeCheckoutSession",

    createAccountLink:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createAccountLink',
    ivrAutoCall:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/autoCall',
    leadCaptureForm:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/leadCaptureForm',
    voxBayAutoCall: 'https://asia-east2-zenysdevelopment.cloudfunctions.net/voxBayAutoCall'
    // createAccountLink: "http://localhost:5000/zenysdevelopment/asia-east2/createAccountLink",

    // updatePaymentAmountOnEdit:
    //   'https://asia-east2-zenysdevelopment.cloudfunctions.net/PaymentReceiptAmountUpdateOnEdit',
    // updatePaymentAmountOnEdit:"http://localhost:5000/zenysdevelopment/asia-east2/PaymentReceiptAmountUpdateOnEdit"
    //  capturePayment:"http://localhost:5000/zenysdevelopment/asia-east2/capturePayments",
    //  createOrder:"http://localhost:5000/zenysdevelopment/asia-east2/createOrder",
    //  invoices:"http://localhost:5000/zenysdevelopment/asia-east2/getallinvoice",
    //  getpayment:"http://localhost:5000/zenysdevelopment/asia-east2/getpayment",
    //  subplans:"http://localhost:5000/zenysdevelopment/asia-east2/getplansubs",
    //  subscription:"http://localhost:5000/zenysdevelopment/asia-east2/subscriptions",
    //  getsubscription:"http://localhost:5000/zenysdevelopment/asia-east2/getsubscription",
    // cancelsubscription:"http://localhost:5000/zenysdevelopment/asia-east2/cancelsubscriptions",
    // getsubscriptioninvoices:"http://localhost:5000/zenysdevelopment/asia-east2/getsubscriptioninv",
    // makepaylink:"http://localhost:5000/zenysdevelopment/asia-east2/axiostest",
    // collectionOperation:"http://localhost:5000/zenysdevelopment/asia-east2/collectionOperation",
    // mailer:"http://localhost:5000/zenysdevelopment/asia-east2/mailer",
    // mailparser:"http://localhost:5000/zenysdevelopment/asia-east2/mailparseincoming",
    // nodemailer:"http://localhost:5000/zenysdevelopment/asia-east2/nodemailer",
    // contactAutomation:"http://localhost:5000/zenysdevelopment/asia-east2/contactautomationTest",
    // updateSubscription:"http://localhost:5000/zenysdevelopment/asia-east2/subscriptionsUpdate"
    // production
    // createOrder: 'https://europe-west3-zenysproduction.cloudfunctions.net/createOrder',
    // capturePayment: 'https://europe-west3-zenysproduction.cloudfunctions.net/capturePayments',
    // subscription:"https://europe-west3-zenysproduction.cloudfunctions.net/subscriptions",
    // getpayment:"https://europe-west3-zenysproduction.cloudfunctions.net/getpayment",
    // subplans:"https://europe-west3-zenysproduction.cloudfunctions.net/getplansubs",
    // invoices:"https://europe-west3-zenysproduction.cloudfunctions.net/getallinvoice",
    // makepaylink:"https://europe-west3-zenysproduction.cloudfunctions.net/axiostest",
    // collectionOperation:"https://europe-west3-zenysproduction.cloudfunctions.net/collectionOperation",
    // mailer: "https://europe-west3-zenysproduction.cloudfunctions.net/mailer",
    // mailparser: "https://europe-west3-zenysproduction.cloudfunctions.net/mailparseincoming",
    // nodemailer:"https://europe-west3-zenysproduction.cloudfunctions.net/nodemailer",
    // cancelsubscription:"https://europe-west3-zenysproduction.cloudfunctions.net/cancelsubscriptions",
    // getsubscriptioninvoices:"https://europe-west3-zenysproduction.cloudfunctions.net/getsubscriptioninv",
    // getsubscription:"https://europe-west3-zenysproduction.cloudfunctions.net/getsubscription",
    // InquiryNotification : "https://europe-west3-zenysproduction.cloudfunctions.net/InquiryNotification",
    // ChatNotification : "https://europe-west3-zenysproduction.cloudfunctions.net/ChatNotification",
    // sendnotification: "https://europe-west3-zenysproduction.cloudfunctions.net/sendnotification",
    // contactAutomation:"https://europe-west3-zenysproduction.cloudfunctions.net/contactautomationTest"
  },

  // RAZORPAY_KEY_ID: 'rzp_test_HYyIFrxNMpWIBk', //API key for test mode
  // RAZORPAY_KEY_SECRET: '75D5l2ZA6JQDEoWnoMufoaIq', //secret key for test mode
  RAZORPAY_KEY_ID: 'rzp_test_80BuFHmAHC5gaW', //API key for test mode
  RAZORPAY_KEY_SECRET: '7LL8oqtYxzq1Y3dEwOUxwzCP', //secret key for test mode
  RZP_MONTHLY_PLAN_ID: { //gold monthly plan
    India: 'plan_HUM07eOoNPL468',
    Europe: 'plan_monthly_gold_enrope',
    US: 'plan_monthly_gold_Us',
  },
  RZP_YEARY_PLAN_ID: { // gold yearly plan
    India: 'plan_HUM0WNozVCbSHX',
    Europe: 'plan_yearly_gold_europe',
    US: 'plan_yearly_gold_Us',
  },

  RZP_YEARY_PLAN_ID_SLV: {// silver yearly plan
    India: 'plan_LQs0wRwbuhaWUu',
    Europe: 'plan_LQs2hfkODaXzU7',
    US: 'plan_LQs3QlzfSuiSAJ',
  },

  RZP_MONTHLY_PLAN_ID_DMD: {  //diamond monthly plan
    India: 'plan_HzzTGb8mkk5PXs',
    Europe: 'plan_monthly_diamond_europe',
    US: 'plan_monthly_diamond_Us',
  },
  RZP_YEARY_PLAN_ID_DMD: {// diamond yearly plan
    India: 'plan_HzzTs3K4RsVF9s',
    Europe: 'plan_yearly_diamond_europe',
    US: 'plan_yearly_diamond_Us',
  },

  MONTHLY_AMOUNT_GOLD: { India: 59000, Europe: 3600, US: 3000 },
  YEARLY_AMOUNT_GOLD: { India: 590000, Europe: 6000, US: 5000 },
  MONTHLY_AMOUNT_DMD: { India: 94400, Europe: 8000, US: 8000 },
  YEARLY_AMOUNT_DMD: { India: 944000, Europe: 10000, US: 9000 },
  YEARLY_AMOUNT_SLV: { India: 350000, Europe: 5000, US: 6500 },
  //
  CURRENCY: {
    India: 'INR',
    Europe: 'EUR',
    US: 'USD',
  },
  ZenysMainAccount: 'yKQgLQv52WUiTRFTrqt3kFQhogy1', // Will be skipped if doesn't exist
  ZenysAssignedToName: 'SuperUser',
  docViewerDomain: 'zenysdocviewer.web.app',
  englishChannelId:'ak2bWsReIEZVXxcObGsfx9DMQpM2',
  leadCaptureDomain: 'https://leadcapturedev.web.app',
  EmailEncryptKeySize: 16, //Encryption key size used for email encryption
  EmailEncryptIV: 1203199320052021, //IV used for email encryption
  outlookClientId: '80404e05-2cc6-489e-ad21-3084a772ab9a', //Client Id for accessing outlook account
  adminEmail: 'admin@mail.com' // Admin email for special access
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
