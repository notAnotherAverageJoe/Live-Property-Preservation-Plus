import React from "react";
import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/"); // Navigate to the home route
  };

  return (
    <button type="button" onClick={goHome}>
      Go to Home
    </button>
  );
}

export default HomeButton;
