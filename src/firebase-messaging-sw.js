// import { firebaseConfig } from "firebase-functions";
// import {environment} from "./environments/environment"
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBI56WjWQbehuQKXtWW6fPm6RRF0KRQCBw",
      authDomain: "zenysdevelopment.firebaseapp.com",
      databaseURL: "https://zenysdevelopment.firebaseio.com",
      projectId: "zenysdevelopment",
      storageBucket: "zenysdevelopment.appspot.com",
      messagingSenderId: "1059747170002", 
      appId: "1:1059747170002:web:ad21cf215001a49c9a8f0b",
      measurementId: "G-HWESCK7QW6 "
 });
const messaging = firebase.messaging();