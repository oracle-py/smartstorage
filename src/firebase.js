// REMOVE the placeholder object destructuring — completely unnecessary

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics"; // OPTIONAL but recommended with measurementId

const firebaseConfig = {
  apiKey: "AIzaSyDM5SWJBZEIEzz_8gbRvtYyqLAqSahV2ME",
  authDomain: "nurahomes-test.firebaseapp.com",
  databaseURL: "https://nurahomes-test-default-rtdb.firebaseio.com",
  projectId: "nurahomes-test",
  storageBucket: "nurahomes-test.firebasestorage.app",
  messagingSenderId: "660161771931",
  appId: "1:660161771931:web:aeeb55902fe5c52888893e",
  measurementId: "G-STMRH73W4J",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Only run analytics in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, database, analytics };
