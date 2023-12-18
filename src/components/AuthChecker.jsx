import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  // console.log("AuthChecker");
  // console.log(currentUser);

  useEffect(() => {
    // console.log("Checking auth...");
    // console.log(currentUser);
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  return <div>{currentUser && children}</div>;
};

export default AuthChecker;
