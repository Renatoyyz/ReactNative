import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyA7jM917WYU1-pUVY4l9JNuJ9d4u2WCI5Q",
    authDomain: "applojaduckbill.firebaseapp.com",
    databaseURL: "https://applojaduckbill.firebaseio.com",
    projectId: "applojaduckbill",
    storageBucket: "applojaduckbill.appspot.com",
    messagingSenderId: "1061099511792",
    appId: "1:1061099511792:web:c19d2ac86015c150a0c735",
    measurementId: "G-JBNNMLKVF3"
  };
  if( !firebase.apps.length ){
    firebase.initializeApp(firebaseConfig);
}
export default firebase;