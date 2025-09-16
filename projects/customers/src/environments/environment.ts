// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    //Settings for localTesting environment
    // apiKey: "AIzaSyDkHIhzGjy358lVXGMUo12yRRGtO6OdfMI",
    // authDomain: "zenysdevelopment-f6491.firebaseapp.com",
    // databaseURL: "https://zenysdevelopment-f6491-default-rtdb.firebaseio.com",
    // projectId: "zenysdevelopment-f6491",
    // storageBucket: "zenysdevelopment-f6491.appspot.com",
    // messagingSenderId: "926474914640",
    // appId: "1:926474914640:web:276883d07682610c237a55",
    // measurementId: "G-S18ZSBDGY2"

    //Settings for development environment
    apiKey: "AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw",
    authDomain: "zenysdevelopment.firebaseapp.com",
    databaseURL: "https://zenysdevelopment.firebaseio.com",
    projectId: "zenysdevelopment",
    storageBucket: "zenysdevelopment.appspot.com",
    messagingSenderId: "1059747170002",
    appId: "1:1059747170002:web:ad21cf215001a49c9a8f0b",
    measurementId: "G-HWESCK7QW6 "
}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
