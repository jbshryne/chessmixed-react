import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
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
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
    // <div className="header">Header</div>
  );
};

export default Header;
