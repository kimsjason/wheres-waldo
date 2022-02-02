import Game from "./components/Game";
import "./styles/App.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // addTargetsToDatabase();
  }, []);

  // Configure & initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDE6YUVAajD1s6K2t_VSobJZxcWd0NuQ8M",
    authDomain: "where-s-waldo-d1661.firebaseapp.com",
    projectId: "where-s-waldo-d1661",
    storageBucket: "where-s-waldo-d1661.appspot.com",
    messagingSenderId: "278946544911",
    appId: "1:278946544911:web:2b6725d94261bcd2df527a",
    measurementId: "G-ZYLWNSR19C",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore();

  // Add targets to Cloud Firestore collection called 'targets'
  const addTargetsToDatabase = () => {
    // Store array of pokemon targets, their center coordinates / radius
    const targets = [
      {
        pokemon: "Quagsire",
        center: {
          x: 1330,
          y: 535,
        },
        radius: 125,
      },
      {
        pokemon: "Corsola",
        cemter: {
          x: 1160,
          y: 1570,
        },
        radius: 70,
      },
      {
        pokemon: "Walrein",
        center: {
          x: 480,
          y: 1380,
        },
        radius: 80,
      },
    ];

    // Add each pokemon in target array to Cloud Firestore
    targets.forEach(async (target) => {
      try {
        const docRef = await addDoc(collection(db, "targets"), target);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    });
  };

  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
