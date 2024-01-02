import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);
    if (data.user) {
      localStorage.setItem("chessmixed_currentUser", JSON.stringify(data.user));
      handleLogin();
      navigate("/games");
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      {/* <h1>Login</h1> */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
