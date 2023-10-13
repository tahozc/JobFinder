import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const CompanyRoute = ({ Component }) => {
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);

  return currentUser ? (
    currentUser.type === 0 ? (
      <Component />
    ) : (
      <Navigate to={"/"} />
    )
  ) : (
    <Navigate to={"/"} />
  );
};

export default CompanyRoute;
