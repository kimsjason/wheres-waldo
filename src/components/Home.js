import { Link } from "react-router-dom";

const Home = (props) => {
  return (
    <div className="home">
      <div className="header">
        <div className="logo">Where's Waldo</div>
        <Link to="/leaderboard" className="leaderboard">
          Leaderboard
        </Link>
      </div>
      <div className="map">
        <img
          className="map-image"
          src={props.boards[0].imagePath}
          alt="Preview of map"
        />
        <div className="map-info">
          <div className="title">{props.boards[0].board}</div>
          <div className="credits">{props.boards[0].credits}</div>
          <div className="targets">
            {props.boards[0].targets.map((target) => {
              return (
                <div key={target.name} className="target">
                  <img
                    className="illustration"
                    src={target.imagePath}
                    alt="target illustration"
                  />
                  <div className="target-info">
                    <div className="name">{target.name}</div>
                    <div className="difficulty">{target.difficulty}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/game">
            <button className="start-game">Start Game</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
