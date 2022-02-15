import { Link } from "react-router-dom";

const Home = (props) => {
  return (
    <div className="home">
      <div className="header">
        <div className="game-title">
          <div className="text">Where's that</div>
          <img className="logo" src={props.boards.logoPath} alt="" />
        </div>
        <Link to="/leaderboard" className="leaderboard">
          <button>Leaderboard</button>
        </Link>
      </div>
      <div className="map">
        <div className="image-container">
          <img
            className="map-image"
            src={props.boards.imagePaths[0]}
            alt="Preview of map"
          />
        </div>
        <div className="map-content">
          <div className="map-info">
            <div className="title">{props.boards.board}</div>
            <div className="credits">Artwork by {props.boards.credits}</div>
          </div>
          <div className="targets">
            {props.boards.targets.map((target) => {
              return (
                <div key={target.name} className="target">
                  <img
                    className="illustration"
                    src={target.imagePath}
                    alt="target illustration"
                  />
                  <div className="target-info">
                    <div className="name">{target.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/game" className="start-game">
            <button>START</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
