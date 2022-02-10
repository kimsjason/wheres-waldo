import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Results = (props) => {
  const [name, setName] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    const getTime = async () => {
      const time = await props.getTime();
      setTime(time);
    };
    getTime();
  }, []);
  const onSubmitName = (e) => {
    const name = e.target.querySelector("input[type=text]").value;
    e.preventDefault();
    props.onSubmitName(e);
    setName(name);
  };

  return (
    <div className="results">
      {name ? (
        <div className="navigate">
          <Link to="/">
            <button> Home </button>
          </Link>
          <Link to="/leaderboard">
            <button> Leaderboard </button>
          </Link>
        </div>
      ) : (
        <div className="player-results">
          <div className="time">{time}</div>
          <form className="player-name-form" onSubmit={onSubmitName}>
            <label>
              <input
                type="text"
                name="player-name"
                placeholder="Your name..."
              />
            </label>
            <button>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Results;
