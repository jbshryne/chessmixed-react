import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    const reqBody = {
      displayName: formData.displayName,
      username: formData.username,
      password: formData.password,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      {/* <h1>Signup</h1> */}
      <form onSubmit={handleSubmit}>
        <label>
          Display Name:
          <input type="text" name="displayName" onChange={handleFormData} />
        </label>
        <label>
          Username:
          <input type="text" name="username" onChange={handleFormData} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={handleFormData} />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="passwordConfirm"
            onChange={handleFormData}
          />
        </label>
        <input className="button" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Signup;
