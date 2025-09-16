export const environment = { 
  production: true,

  clientId: '461454236300-oq7a7ui7vnqavdns0d2gfr231uujjnor.apps.googleusercontent.com', //for GAPI
  ZenysMainAccount: 'WlWjGoPwE5enWHWGDZMK6EVk5CA2',
  ZenysAssignedToName:  'Mohana Krishnan',
  firebaseConfig : {
    //Settings for Production environment
    apiKey: "  AIzaSyCHXy0lc_CPwPa8mPL0WIRGlvsjsWbUJb4",
        authDomain: "zenysproduction.firebaseapp.com",
        projectId: "zenysproduction",
        storageBucket: "zenysproduction.appspot.com",
        messagingSenderId: "1059747170002",
        appId: "1:461454236300:web:62fca20bfcfd31740bb9a9",
        measurementId: "G-GMK88N8BFL"
  },

  //MONTHLY_AMOUNT_GOLD:59000,
  //YEARLY_AMOUNT_GOLD:590000,
  //MONTHLY_AMOUNT_DMD:94400,
  //YEARLY_AMOUNT_DMD:944000,

  cloudFunctions : {
    createOrder: 'https://europe-west3-zenysproduction.cloudfunctions.net/createOrder',
    capturePayment: 'https://europe-west3-zenysproduction.cloudfunctions.net/capturePayments',
    subscription:"https://europe-west3-zenysproduction.cloudfunctions.net/subscriptions",
    getpayment:"https://europe-west3-zenysproduction.cloudfunctions.net/getpayment",
    subplans:"https://europe-west3-zenysproduction.cloudfunctions.net/getplansubs",
    invoices:"https://europe-west3-zenysproduction.cloudfunctions.net/getallinvoice",
    makepaylink:"https://europe-west3-zenysproduction.cloudfunctions.net/axiostest",
    collectionOperation:"https://europe-west3-zenysproduction.cloudfunctions.net/collectionOperation",
    mailer: "https://europe-west3-zenysproduction.cloudfunctions.net/mailer",
    mailparser: "https://europe-west3-zenysproduction.cloudfunctions.net/mailparseincoming",
    nodemailer:"https://europe-west3-zenysproduction.cloudfunctions.net/nodemailer",
    cancelsubscription:"https://europe-west3-zenysproduction.cloudfunctions.net/cancelsubscriptions",
    getsubscriptioninvoices:"https://europe-west3-zenysproduction.cloudfunctions.net/getsubscriptioninv",
    getsubscription:"https://europe-west3-zenysproduction.cloudfunctions.net/getsubscription",
    InquiryNotification : "https://europe-west3-zenysproduction.cloudfunctions.net/InquiryNotification",
    ChatNotification : "https://europe-west3-zenysproduction.cloudfunctions.net/ChatNotification",
    sendnotification: "https://europe-west3-zenysproduction.cloudfunctions.net/sendnotification",
    contactAutomation:"https://europe-west3-zenysproduction.cloudfunctions.net/contactautomationTest",
    updateSubscription:"https://europe-west3-zenysproduction.cloudfunctions.net/subscriptionsUpdate"


  },
  RAZORPAY_KEY_ID: 'rzp_live_YFN1lkZJp9Ym5G', //API key for prod mode
  RAZORPAY_KEY_SECRET: 'pwRc0xJCsqrpUOGtEqa5oDlm', //secret key for prod mode
  // RZP_MONTHLY_PLAN_ID : 'plan_HVBCln3uDF2vLt', //monthly plan id
  // RZP_YEARY_PLAN_ID : 'plan_HVBDTMaya9Srgt', //annual plan id
  // RZP_MONTHLY_PLAN_ID_DMD : 'plan_HzzPQrX4rqywem',//monthly plan for diamond
  // RZP_YEARY_PLAN_ID_DMD : 'plan_HzzRegMymqLWsl',// annual plan for diamond

//Plan ID for monthly gold pack
  RZP_MONTHLY_PLAN_ID : {
    India:'plan_HVBCln3uDF2vLt',
    Europe:"plan_IUsoA0nn1ZYWa1",
  US:"plan_IUsols7kl2YwUk"
},
//Plan ID for yearly gold pack
  RZP_YEARY_PLAN_ID :{ India :'plan_HVBDTMaya9Srgt',
  Europe:"plan_IUt62SkihFKCIH",
  US:"plan_IUt7InXJdfWfmy"
},
//Plan ID for monthly diamond pack
  RZP_MONTHLY_PLAN_ID_DMD : {India:'plan_HzzPQrX4rqywem',
  Europe:"plan_IUt9GKWMkr9bAi",
  US:"plan_IUtAcHlxSM5hWY"
},
//Plan ID for yearly diamond pack
  RZP_YEARY_PLAN_ID_DMD : {India:'plan_HzzRegMymqLWsl',
  Europe:"plan_IUtC7zo9XkKSyg",
  US:"plan_IUtDKuNkPWfzb2"
},

//Plan pricing
  MONTHLY_AMOUNT_GOLD:{India:59000,Europe:700,US:800},
  YEARLY_AMOUNT_GOLD:{India:590000,Europe:6900,US:7900},
  MONTHLY_AMOUNT_DMD:{India:94400,Europe: 1100,US:1300},
  YEARLY_AMOUNT_DMD:{India:944000,Europe:11100,US:12600},
  //
  CURRENCY:{
    India:"INR",
    Europe:"EUR",
    US:"USD"
  },
  //Configuration for testing
  /*
  firebaseConfig : {
    //Settings for testing environment
    apiKey: "AIzaSyAThoJEBI8AS7_jHn9S8yeFQYIyj-rOlq4",
    authDomain: "zenystesting2.firebaseapp.com",
    projectId: "zenystesting2",
    storageBucket: "zenystesting2.appspot.com",
    messagingSenderId: "1003908776899",
    appId: "1:1003908776899:web:eb880a58dabcd73a52b376",
    measurementId: "G-JJKCV43Q9L"
  },

  cloudFunctions : {
    createOrder: 'https://europe-west3-zenystesting2.cloudfunctions.net/createOrder',
    capturePayment: 'https://europe-west3-zenystesting2.cloudfunctions.net/capturePayments',
    subscription:"https://europe-west3-zenystesting2.cloudfunctions.net/subscriptions",
    getpayment:"https://europe-west3-zenystesting2.cloudfunctions.net/getpayment",
    subplans:"https://europe-west3-zenystesting2.cloudfunctions.net/getplansubs",
    invoices:"https://europe-west3-zenystesting2.cloudfunctions.net/getallinvoice"
  },
  RAZORPAY_KEY_ID: 'rzp_test_80BuFHmAHC5gaW'*/
};
