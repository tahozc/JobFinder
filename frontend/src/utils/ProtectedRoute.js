import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ Component }) => {
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);

  return currentUser ? <Component /> : <Navigate to={"/"} />;
};

export default ProtectedRoute;
