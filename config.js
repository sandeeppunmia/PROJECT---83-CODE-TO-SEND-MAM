import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyDAMCDVLS4PD9-Df0BZ_C6QlERgY6gIPbE",
    authDomain: "mybarterapp.firebaseapp.com",
    projectId: "mybarterapp",
    storageBucket: "mybarterapp.appspot.com",
    messagingSenderId: "1008876467983",
    appId: "1:1008876467983:web:3382ba4a75f3da7afaf07a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();