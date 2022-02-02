import { ReactComponent as WaterPokemon } from "../assets/water-pokemon.svg";
import { useState } from "react";

const Game = () => {
  const [targets, setTargets] = useState([
    { pokemon: "Quagsire", found: false },
    { pokemon: "Corsola", found: false },
    { pokemon: "Walrein", found: false },
  ]);

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

  return (
    <div className="game">
      <WaterPokemon className="water-pokemon" onClick={displaySelectionMenu} />
      <div className="selection-menu hidden">
        {targets.map((target) => {
          return (
            <div key={target.pokemon} className={target.pokemon}>
              {target.pokemon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
