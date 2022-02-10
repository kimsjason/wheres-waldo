import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import Home from "./Home";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import "../styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [docRef, setDocRef] = useState();
  const [leaderboard, setLeaderboard] = useState([]);
  const [submitName, setSubmitName] = useState();
  const boards = {
    board: "Pokemon Color Spectrum",
    credits: "Gogoatt",
    imagePaths: [
      require("../assets/pokemon-color-spectrum-1.png"),
      require("../assets/pokemon-color-spectrum-2.png"),
      require("../assets/pokemon-color-spectrum-3.png"),
      require("../assets/pokemon-color-spectrum-4.png"),
      require("../assets/pokemon-color-spectrum-5.png"),
      require("../assets/pokemon-color-spectrum-6.png"),
      require("../assets/pokemon-color-spectrum-7.png"),
      require("../assets/pokemon-color-spectrum-8.png"),
    ],
    targets: [
      {
        name: "Jynx",
        xMin: "85",
        xMax: "100",
        yMin: "20.237",
        yMax: "22.115",
        imagePath: require("../assets/jynx.png"),
      },
      {
        name: "Lapras",
        xMin: "66.417",
        xMax: "73.6",
        yMin: "53.167",
        yMax: "54.706",
        imagePath: require("../assets/lapras.png"),
      },
      {
        name: "Hitmonchan",
        xMin: "21.08",
        xMax: "35.16",
        yMin: "85.341",
        yMax: "86.411",
        imagePath: require("../assets/hitmonchan.png"),
      },
      {
        name: "Ursaring",
        xMin: "84.6",
        xMax: "100",
        yMin: "94.106",
        yMax: "95.248",
        imagePath: require("../assets/ursaring.png"),
      },
      {
        name: "Mew",
        xMin: "0.5",
        xMax: "10.5",
        yMin: "11.064",
        yMax: "11.829",
        imagePath: require("../assets/mew.png"),
      },
    ],
  };

  // Uncomment function inside useEffect to add targets to the database
  useEffect(() => {
    // Add targets to Cloud Firestore collection called 'targets'
    const addTargetsToDatabase = () => {
      // Store array of pokemon targets, their center coordinates / radius
      const targets = boards.targets;

      // Add each pokemon in target array to Cloud Firestore
      targets.forEach(async (target) => {
        try {
          await addDoc(collection(db, "targets"), target);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      });
    };

    // addTargetsToDatabase();
  }, []);

  // Gets leaderboard data from Firebase and store in state
  useEffect(() => {
    (async () => {
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
        setLeaderboard(leaderboard);
        setSubmitName(false);
      } catch (e) {
        console.error("Error retrieving times from the database", e);
      }
    })();
  }, [submitName]);

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
      console.error("Error updating document: ", e);
    }
  };

  const getTime = async () => {
    try {
      const docSnap = await getDoc(docRef);
      const record = docSnap.data();
      const time = formatTime(record.endTime - record.startTime);
      return time;
    } catch (e) {
      console.error("Error retrieving document: ", e);
    }
  };

  const formatTime = (time) => {
    const minutes = ("0" + Math.floor((time / 60) % 60)).slice(-2);
    const seconds = ("0" + Math.floor(time % 60)).slice(-2);

    const formattedTime = `${minutes}:${seconds}`;
    return formattedTime;
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
      setSubmitName(true);
    } catch (e) {
      console.log("Error updating document: ", e);
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
                getTime={getTime}
                formatTime={formatTime}
                getTargetInfo={getTargetInfo}
                onSubmitName={handleSubmitName}
              />
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Leaderboard leaderboard={leaderboard} formatTime={formatTime} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
