import { useState } from "react";

const Results = (props) => {
  const [name, setName] = useState();

  const onSubmitName = (e) => {
    const name = e.target.querySelector("input[type=text]").value;
    e.preventDefault();
    props.onSubmitName(e);
    setName(name);
  };

  return (
    <div className="results">
      {name ? (
        <div className="buttons">
          <div className="home"> Home </div>
          <div className="leaderboard"> Leaderboard </div>
        </div>
      ) : (
        <div>
          <div className="time">Your time!</div>
          <form className="player-name" onSubmit={onSubmitName}>
            <label>
              Name:
              <input type="text" name="player-name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Results;
