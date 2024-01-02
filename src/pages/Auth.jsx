import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { Link } from "react-router-dom";

const Auth = ({ isLoggedIn, setIsLoggedIn }) => {
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  console.log(currentUser);

  // const [testShown, setTestShown] = useState(false);
  const [isConnected, setIsConnected] = useState("");
  const [component, setComponent] = useState(null);

  const handleTest = async () => {
    setIsConnected("waiting...");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/hi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      setIsConnected("Connected!");
    } else {
      setIsConnected("Not connected");
    }
  };

  const handleComponentChange = (component) => {
    setComponent(component);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div id="auth-page">
      <section style={{ display: "flex" }}>
        <button onClick={handleTest}>Test API Connection</button>
        <p className="status-box">{isConnected}</p>
      </section>
      {!isLoggedIn ? (
        <div className="controls">
          <section style={{ display: "flex", flexDirection: "row" }}></section>
          <button
            onClick={() =>
              handleComponentChange(<Login handleLogin={handleLogin} />)
            }
          >
            Login
          </button>
          <button onClick={() => handleComponentChange(<Signup />)}>
            Signup
          </button>
          {component}
        </div>
      ) : (
        <div>
          <p>You are logged in as {currentUser.username}</p>
          <p>
            <Link to="/games">
              <button>Proceed to Games</button>
            </Link>
          </p>
        </div>
      )}
      <img
        src="art/chess-hero2.png"
        alt="art of two opposing castles over grided landscape"
        style={{ width: "640px" }}
      />
    </div>
  );
};

export default Auth;
