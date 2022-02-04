import { useEffect, useRef, useState } from "react";

const Game = (props) => {
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [targets, setTargets] = useState([
    { name: "Quagsire", found: false },
    { name: "Corsola", found: false },
    { name: "Walrein", found: false },
  ]);
  const [clickCoordinates, setClickCoordinates] = useState([]);
  const [message, setMessage] = useState();

  useEffect(() => {
    startTimer();

    let interval;
    if (!gameOver) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [gameOver]);

  const startTimer = async () => {
    await props.startTimer();
  };

  const stopTimer = async () => {
    await props.stopTimer();
  };

  const formatTimer = (timer) => {
    const minutes = ("0" + Math.floor((timer / 60) % 60)).slice(-2);
    const seconds = ("0" + Math.floor(timer % 60)).slice(-2);

    const formattedTimer = `${minutes}:${seconds}`;
    return formattedTimer;
  };

  const displaySelectionMenu = (e) => {
    const selectionMenu = document.querySelector(".selection-menu");
    selectionMenu.classList.toggle("hidden");
    setPosition(selectionMenu, e.pageX, e.pageY);
  };

  const setPosition = (element, x, y) => {
    // Offset elements by 25px
    element.style.left = `${x + 25}px`;
    element.style.top = `${y + 25}px`;
  };

  // Returns information about targets (name, coordinates, radius) from Firebase
  const getTargetInfo = async () => {
    const targetInfo = await props.getTargetInfo();
    return targetInfo;
  };

  // Returns information of a single target from a targets array
  const getTarget = (targetName, targets) => {
    const [target] = targets.filter((target) => target.name === targetName);
    return target;
  };

  // Evaluate if click is within target range and update states, accordingly
  const evaluateTarget = (target) => {
    if (
      clickCoordinates[0] >= target.xMin &&
      clickCoordinates[0] <= target.xMax &&
      clickCoordinates[1] >= target.yMin &&
      clickCoordinates[1] <= target.yMax
    ) {
      const targetName = target.name;
      const targetsCopy = [...targets];
      const updatedTargets = targetsCopy.map((target) => {
        if (target.name === targetName) {
          target.found = true;
        }
        return target;
      });
      setTargets(updatedTargets);
      setMessage(`You found ${target.name}!`);
      if (checkFoundAll()) {
        endGame();
      }
    } else {
      setMessage("Try again!");
    }
  };

  // Returns x, y coordinates (in percentages) of mouse click relative to image
  const getRelativeCoordinates = (e, element) => {
    const width = parseInt(window.getComputedStyle(element).width.slice(0, -2));
    const height = parseInt(
      window.getComputedStyle(element).height.slice(0, -2)
    );
    const x = Math.round((e.pageX / width) * 100);
    const y = Math.round((e.pageY / height) * 100);

    return [x, y];
  };

  // Returns true if all characters found, otherwise false
  const checkFoundAll = () => {
    return targets.every((target) => target.found === true);
  };

  const endGame = () => {
    setGameOver(true);
    stopTimer();
  };

  // CLICK EVENTS
  const handleClickBoard = (e) => {
    const board = document.querySelector(".water-pokemon");
    const [x, y] = getRelativeCoordinates(e, board);
    setClickCoordinates([x, y]);
    displaySelectionMenu(e);
  };

  const handleClickTarget = async (e) => {
    const targetName = e.target.innerHTML;
    const targetInfo = await getTargetInfo();
    const target = getTarget(targetName, targetInfo);

    evaluateTarget(target);
    console.log(targets);
  };

  return (
    <div className="game">
      <div className="fixed">
        <div className="header">
          <div className="logo">Where's Waldo</div>
          <div className="timer">{formatTimer(timer)}</div>
          <div className="targets">Targets</div>
        </div>
        <div className="display-message">{message}</div>
      </div>
      <div className="board">
        <img
          className="water-pokemon"
          src={require("../assets/water-pokemon.png")}
          onClick={handleClickBoard}
          alt="game board"
        />
        <div className="selection-menu hidden">
          {targets.map((target) => {
            return (
              <div
                key={target.name}
                className={target.name}
                onClick={handleClickTarget}
              >
                {target.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;
