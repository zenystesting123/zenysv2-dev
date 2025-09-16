export const environment = {
  production: true,
  stripePublishableKey:
    'pk_live_51IhrAaSCUjCHJT5XNEg7uLZ9ulxitFkdV9rhoDRdjIkzA9jAIu8iCXzIGgi63cpxNEYuN7T5P5lN4gpO3b8L3jqZ00rprpBxyy',
  clientId:
    '1059747170002-mb13fen3gnln217t3sfjuvsa80u7ildr.apps.googleusercontent.com', //for GAPI
  ZenysMainAccount: 'yKQgLQv52WUiTRFTrqt3kFQhogy1', //For automatically creating contact under Zenys account
  ZenysAssignedToName: 'SuperUser',
  docViewerDomain: 'zenysdocviewer.web.app',
  currentUrl: 'https://zenysdevelopment.web.app/',

  //Configuration for testing

  firebaseConfig: {
    //Settings for testing environment
    apiKey: 'AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw',
    authDomain: 'zenysdevelopment.firebaseapp.com',
    databaseURL: 'https://zenysdevelopment.firebaseio.com',
    projectId: 'zenysdevelopment',
    storageBucket: 'zenysdevelopment.appspot.com',
    messagingSenderId: '1059747170002',
    appId: '1:1059747170002:web:ad21cf215001a49c9a8f0b',
    measurementId: 'G-HWESCK7QW6',
  },

  cloudFunctions: {
    createOrder:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createOrder',
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
    updateSubscription:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/subscriptionsUpdate',
    createSubMerchant:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createSubMerchant',
    createSubMerchantPayLink:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createSubMerchantPayLink',
    createStripe:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createStripeAccount',
    retriveStripe:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/retrieveStripeAccount',
    scheduledFunction:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/scheduledFunction',
    checkoutSession:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createStripeCheckoutSession',
    retrieveSession:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/retireveStripeCheckoutSession',
    createAccountLink:
      'https://asia-east2-zenysdevelopment.cloudfunctions.net/createAccountLink',
    // updatePaymentAmountOnEdit:
    //   'https://asia-east2-zenysdevelopment.cloudfunctions.net/PaymentReceiptAmountUpdateOnEdit',
    ivrAutoCall:
    'https://asia-east2-zenysdevelopment.cloudfunctions.net/autoCall',
    leadCaptureForm:
    'https://asia-east2-zenysdevelopment.cloudfunctions.net/leadCaptureForm',
    voxBayAutoCall: 'https://asia-east2-zenysdevelopment.cloudfunctions.net/voxBayAutoCall'
  },
  RAZORPAY_KEY_ID: 'rzp_test_80BuFHmAHC5gaW', //API key for test mode
  RAZORPAY_KEY_SECRET: '7LL8oqtYxzq1Y3dEwOUxwzCP', //secret key for test mode
  RZP_MONTHLY_PLAN_ID: {
    India: 'plan_HUM07eOoNPL468',
    Europe: 'plan_monthly_gold_enrope',
    US: 'plan_monthly_gold_Us',
  },
  RZP_YEARY_PLAN_ID: {
    India: 'plan_HUM0WNozVCbSHX',
    Europe: 'plan_yearly_gold_europe',
    US: 'plan_yearly_gold_Us',
  },
  RZP_YEARY_PLAN_ID_SLV: {// silver yearly plan
    India: 'plan_LQs0wRwbuhaWUu',
    Europe: 'plan_LQs2hfkODaXzU7',
    US: 'plan_LQs3QlzfSuiSAJ',
  },
  RZP_MONTHLY_PLAN_ID_DMD: {
    India: 'plan_HzzTGb8mkk5PXs',
    Europe: 'plan_monthly_diamond_europe',
    US: 'plan_monthly_diamond_Us',
  },
  RZP_YEARY_PLAN_ID_DMD: {
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
  LogoutTime: 900000,
  englishChannelId:'ak2bWsReIEZVXxcObGsfx9DMQpM2',
  leadCaptureDomain: 'https://leadcapturedev.web.app',
  EmailEncryptKeySize: 16, //Encryption key size used for email encryption
  EmailEncryptIV: 1203199320052021, //IV used for email encryption
  outlookClientId: '80404e05-2cc6-489e-ad21-3084a772ab9a' //Client Id for accessing outlook account
};
