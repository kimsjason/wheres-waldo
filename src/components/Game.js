import { ReactComponent as WaterPokemon } from "../assets/water-pokemon.svg";
import { useEffect, useState } from "react";

const Game = (props) => {
  const [targets, setTargets] = useState([
    { pokemon: "Quagsire", found: false },
    { pokemon: "Corsola", found: false },
    { pokemon: "Walrein", found: false },
  ]);
  const [selectionCoordinates, setSelectionCoordinates] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    startTimer();
  }, []);

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

  const handleSelection = (e) => {
    setSelectionCoordinates([e.pageX, e.pageY]);
    displaySelectionMenu(e);
  };

  const getTargetsFromDatabase = async () => {
    const targets = await props.getTargetsFromDatabase();
    return targets;
  };

  const getTargetPokemon = (pokemonName, targets) => {
    const [pokemon] = targets.filter(
      (target) => target.pokemon === pokemonName
    );
    return pokemon;
  };

  const evaluateSelection = async (e) => {
    const targetPokemon = e.target.innerHTML;
    const targets = await getTargetsFromDatabase();
    const pokemon = getTargetPokemon(targetPokemon, targets);

    const [xMin, xMax] = [
      pokemon.center.x - pokemon.radius,
      pokemon.center.x + pokemon.radius,
    ];

    const [yMin, yMax] = [
      pokemon.center.y - pokemon.radius,
      pokemon.center.y + pokemon.radius,
    ];

    // evaluate if selection is within target range
    if (
      selectionCoordinates[0] >= xMin &&
      selectionCoordinates[0] <= xMax &&
      selectionCoordinates[1] >= yMin &&
      selectionCoordinates[1] <= yMax
    ) {
      console.log("You found it!");
    } else {
      console.log("try again!");
    }
    // delete
    console.log(selectionCoordinates);
    console.log(xMin, xMax, "\n", yMin, yMax);
  };

  const startTimer = () => {
    setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
  };

  const formatTimer = (timer) => {
    const minutes = ("0" + Math.floor((timer / 60) % 60)).slice(-2);
    const seconds = ("0" + Math.floor(timer % 60)).slice(-2);

    const formattedTimer = `${minutes}:${seconds}`;
    return formattedTimer;
  };

  return (
    <div className="game">
      <div className="header">
        <div className="logo">Where's Waldo</div>
        <div className="timer">{formatTimer(timer)}</div>
        <div className="targets">Targets</div>
      </div>
      <WaterPokemon className="water-pokemon" onClick={handleSelection} />
      <div className="selection-menu hidden">
        {targets.map((target) => {
          return (
            <div
              key={target.pokemon}
              className={target.pokemon}
              onClick={evaluateSelection}
            >
              {target.pokemon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
