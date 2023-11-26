import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);
  return <div>{children}</div>;
};

export default AuthChecker;
