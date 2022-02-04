import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Game from "./components/Game";
import "./styles/App.css";

function App() {
  const [docRef, setDocRef] = useState();
  // let timeDocID = "";
  const boards = [
    {
      board: "pokemon",
      imagePath: "../assets/water-pokemon.svg",
      targets: [
        {
          name: "Quagsire",
          xMin: "74",
          xMax: "91",
          yMin: "20",
          yMax: "34",
        },
        { name: "Corsola", xMin: "66", xMax: "80", yMin: "74", yMax: "83" },
        { name: "Walrein", xMin: "25", xMax: "35", yMin: "63", yMax: "75" },
      ],
    },
  ];

  useEffect(() => {
    // Uncomment line below to add targets to the database
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

  const startTimer = async () => {
    const record = { name: "", startTime: new Date(), endTime: "" };
    try {
      const docRef = await addDoc(collection(db, "times"), record);
      setDocRef(docRef); // Store Firebase document reference to update information
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const stopTimer = async () => {
    try {
      await updateDoc(docRef, {
        endTime: new Date(),
      });
    } catch (e) {
      console.log("Error updating document: ", e);
    }
  };

  // Add targets to Cloud Firestore collection called 'targets'
  const addTargetsToDatabase = () => {
    // Store array of pokemon targets, their center coordinates / radius
    const targets = boards[0].targets;

    // Add each pokemon in target array to Cloud Firestore
    targets.forEach(async (target) => {
      try {
        const docRef = await addDoc(collection(db, "targets"), target);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    });
  };

  const getTargetInfo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "targets"));
      const targets = [];
      querySnapshot.forEach((doc) => {
        targets.push(doc.data());
      });
      return targets;
    } catch (e) {
      console.error("Error retrieving targets from the database", e);
    }
  };

  return (
    <div className="App">
      <Game
        getTargetInfo={getTargetInfo}
        startTimer={startTimer}
        stopTimer={stopTimer}
      />
    </div>
  );
}

export default App;
