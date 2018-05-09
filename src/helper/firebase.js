import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCnIe2O44dqns9weKNyV97vQsONuWwjyAQ",
    authDomain: "lim-database.firebaseapp.com",
    databaseURL: "https://lim-database.firebaseio.com",
    projectId: "lim-database",
    storageBucket: "lim-database.appspot.com",
    messagingSenderId: "699216167047"
  }

firebase.initializeApp(config)
const firebaseInstance = firebase
export default firebaseInstance