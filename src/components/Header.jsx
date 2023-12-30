import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem("chessmixed_currentUser");
    localStorage.removeItem("chessmixed_selectedGame");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div id="navbar">
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/lobby">
        <button>Main Lobby</button>
      </Link>
      <Link to="/game">
        <button>Current Game</button>
      </Link>
      <Link to="/games">
        <button>My Games</button>
      </Link>
      {!isLoggedIn ? (
        <Link to="/login">
          <button>Login</button>
        </Link>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default Header;
