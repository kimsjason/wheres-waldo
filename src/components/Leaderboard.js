import { Link } from "react-router-dom";

const Leaderboard = (props) => {
  const formatTime = (time) => {
    return props.formatTime(time);
  };

  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <Link to="/">
        <button>Home</button>
      </Link>
      <div className="placements">
        <div className="table-header">
          <div className="header-place">Place</div>
          <div className="header-name">Player Name</div>
          <div className="header-time">Time</div>
        </div>
        {props.leaderboard.map((record) => {
          const place = props.leaderboard.indexOf(record) + 1;
          return (
            <div
              key={record.place + record.name + record.time}
              className="player"
            >
              <div className="player-place">{place}</div>
              <div className="player-name">{record.name}</div>
              <div className="player-time">
                {formatTime(record.endTime - record.startTime)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
