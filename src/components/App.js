import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Home from "./Home";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import "../styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [docRef, setDocRef] = useState();
  const [leaderboard, setLeaderboard] = useState([]);
  const boards = [
    {
      board: "Water-Type Pokemon - Blastoise Map",
      credits: "credits...",
      imagePath: require("../assets/water-pokemon.png"),
      targets: [
        {
          name: "Quagsire",
          xMin: "74",
          xMax: "91",
          yMin: "20",
          yMax: "34",
          imagePath: require("../assets/quagsire.png"),
          difficulty: "easy",
        },
        {
          name: "Corsola",
          xMin: "66",
          xMax: "80",
          yMin: "74",
          yMax: "83",
          imagePath: require("../assets/corsola.png"),
          difficulty: "medium",
        },
        {
          name: "Walrein",
          xMin: "25",
          xMax: "35",
          yMin: "63",
          yMax: "75",
          imagePath: require("../assets/walrein.png"),
          difficulty: "hard",
        },
      ],
    },
  ];

  useEffect(async () => {
    // Uncomment line below to add targets to the database
    // addTargetsToDatabase();
    const leaderboard = await getLeaderboard();
    setLeaderboard(leaderboard);
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

  // Record player start time in a new Firebase document
  const startTimer = async () => {
    const record = { name: "", startTime: new Date(), endTime: "" };
    try {
      const docRef = await addDoc(collection(db, "times"), record);
      setDocRef(docRef); // Store Firebase document reference to update information
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Record player end time in an existing Firebase document
  const stopTimer = async () => {
    try {
      await updateDoc(docRef, {
        endTime: new Date(),
      });
    } catch (e) {
      console.log("Error updating document: ", e);
    }
  };

  const formatTime = (time) => {
    const minutes = ("0" + Math.floor((time / 60) % 60)).slice(-2);
    const seconds = ("0" + Math.floor(time % 60)).slice(-2);

    const formattedTime = `${minutes}:${seconds}`;
    return formattedTime;
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

  // CLICK EVENTS
  const handleSubmitName = async (e) => {
    const name = e.target.querySelector("input[type=text]").value;
    try {
      await updateDoc(docRef, {
        name: name,
      });
    } catch (e) {
      console.log("Error updating document: ", e);
    }
  };

  const getLeaderboard = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "times"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      // Filter for records with a valid name - player finished game & entered name
      const leaderboard = data.filter((record) => {
        return record.name !== "";
      });
      sortLeaderboard(leaderboard);
      return leaderboard;
    } catch (e) {
      console.error("Error retrieving times from the database", e);
    }
  };

  const sortLeaderboard = (leaderboard) => {
    leaderboard.sort((a, b) => {
      if (a.endTime - a.startTime > b.endTime - b.startTime) {
        return 1;
      } else if (a.endTime - a.startTime < b.endTime - b.startTime) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home boards={boards} />} />
          <Route
            path="/game"
            element={
              <Game
                boards={boards}
                startTimer={startTimer}
                stopTimer={stopTimer}
                formatTime={formatTime}
                getTargetInfo={getTargetInfo}
                onSubmitName={handleSubmitName}
              />
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Leaderboard
                leaderboard={leaderboard}
                getLeaderboard={getLeaderboard}
                formatTime={formatTime}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
