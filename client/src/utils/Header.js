import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LogoutButton = () => {
  const { handleLogout } = useContext(AuthContext);

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
