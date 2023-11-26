import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Auth = ({ setCurrentUser }) => {
  const [component, setComponent] = useState(
    <Login setCurrentUser={setCurrentUser} />
  );

  const handleComponentChange = (component) => {
    setComponent(component);
  };

  return (
    <div>
      <button
        onClick={() =>
          handleComponentChange(<Login setCurrentUser={setCurrentUser} />)
        }
      >
        Login
      </button>
      <button
        onClick={() =>
          handleComponentChange(<Signup setCurrentUser={setCurrentUser} />)
        }
      >
        Signup
      </button>
      {component}
    </div>
  );
};

export default Auth;
