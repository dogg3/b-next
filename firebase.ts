// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDzmj_EHvS8eKKdWa5wjeZPVzEoM9jBxws",
	authDomain: "boat-admin-383207.firebaseapp.com",
	projectId: "boat-admin-383207",
	storageBucket: "boat-admin-383207.appspot.com",
	messagingSenderId: "77770810500",
	appId: "1:77770810500:web:828f58afba038536b00ed1",
	measurementId: "G-70ESM65ME7"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { app};
