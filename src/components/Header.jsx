import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div id="navbar">
      <Link to="/">Home</Link>
      <Link to="/lobby">Main Lobby</Link>
      <Link to="/game">Current Game</Link>
      <Link to="/games">My Games</Link>
      <Link to="/login">Login</Link>
    </div>
    // <div className="header">Header</div>
  );
};

export default Header;
