// import firebase from 'firebase'
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/firestore';
// change lines below with your own Firebase snippets!
var config = {
  apiKey: "AIzaSyCYDDt6eGVovSQ3UfEVKM4oCZ1iv9jwobM",
  authDomain: "company-brad.firebaseapp.com",
  databaseURL: "https://company-brad.firebaseio.com",
  projectId: "company-brad",
  storageBucket: "company-brad.appspot.com",
  messagingSenderId: "444805140762",
  appId: "1:444805140762:web:7b70efd4d511f1df"
};
const FirestoreCompany = firebase.initializeApp(config);
export default FirestoreCompany;