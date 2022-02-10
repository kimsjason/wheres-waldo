import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Results from "./Results";

const Game = (props) => {
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [targets, setTargets] = useState(
    props.boards.targets.map((target) => {
      return { name: target.name, found: false };
    })
  );
  const [clickCoordinates, setClickCoordinates] = useState([]);
  const [message, setMessage] = useState();

  useEffect(() => {
    let interval;
    if (!gameOver) {
      startTimer(); // Official time in backend - Firebase record
      // Display time in the header
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

  const getTime = async () => {
    const time = await props.getTime();
    return time;
  };

  const formatTime = (time) => {
    const formattedTime = props.formatTime(time);
    return formattedTime;
  };

  // Returns x, y coordinates (in percentages) of mouse click relative to image
  const getRelativeCoordinates = (e, element) => {
    const width = parseInt(window.getComputedStyle(element).width.slice(0, -2));
    const height = parseInt(
      window.getComputedStyle(element).height.slice(0, -2)
    );
    const x = (e.pageX / width) * 100;
    const y = (e.pageY / height) * 100;

    return [x, y];
  };

  const displaySelectionMenu = (e) => {
    const selectionMenu = document.querySelector(".selection-menu");
    selectionMenu.classList.toggle("hidden");
    setPosition(selectionMenu, e.pageX, e.pageY);
  };

  const hideSelectionMenu = () => {
    const selectionMenu = document.querySelector(".selection-menu");
    selectionMenu.classList.add("hidden");
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

  // Returns true if all characters found, otherwise false
  const checkFoundAll = () => {
    return targets.every((target) => target.found === true);
  };

  const onSubmitName = (e) => {
    props.onSubmitName(e);
  };

  const endGame = () => {
    setGameOver(true);
    stopTimer();
  };

  const displayMessage = () => {
    const message = document.querySelector(".display-message");
    message.classList.remove("hidden");
  };

  const hideMessage = () => {
    const message = document.querySelector(".display-message");
    message.classList.add("hidden");
  };

  // CLICK EVENTS
  const handleClickBoard = (e) => {
    const board = document.querySelector(".board .image-container");
    const [x, y] = getRelativeCoordinates(e, board);
    setClickCoordinates([x, y]);
    displaySelectionMenu(e);
  };

  const handleClickTarget = async (e) => {
    const targetName = e.target.innerHTML;
    const targetInfo = await getTargetInfo();
    const target = getTarget(targetName, targetInfo);

    evaluateTarget(target);
    displayMessage();
    setTimeout(hideMessage, 3000);
    hideSelectionMenu();
  };

  const handleClickCharacterLegend = () => {
    const characterLegend = document.querySelector(".characters");
    characterLegend.classList.toggle("hidden");
  };

  return (
    <div className="game">
      <div className="header">
        <div className="header-main">
          <Link className="link" to="/">
            <div className="logo">Where's Waldo</div>
          </Link>
          <div className="timer">{formatTime(timer)}</div>
          <div
            className="character-legend"
            onClick={handleClickCharacterLegend}
          >
            Characters
          </div>
        </div>
        <div className="characters hidden">
          {props.boards.targets.map((target) => {
            return (
              <div key={target.name} className="character">
                <div className="image-container">
                  <img
                    className={target.name}
                    src={target.imagePath}
                    alt="character illustration"
                  />
                </div>
                <div className="name">{target.name}</div>
              </div>
            );
          })}
        </div>
        <div className="display-message hidden">{message}</div>
      </div>
      <div className="board">
        <div className="image-container">
          {props.boards.imagePaths.map((imagePath) => {
            return (
              <img
                key={imagePath}
                className="image-map"
                src={imagePath}
                onClick={handleClickBoard}
                alt="game board"
              />
            );
          })}
        </div>
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
      {gameOver ? (
        <Results onSubmitName={onSubmitName} getTime={getTime} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Game;
