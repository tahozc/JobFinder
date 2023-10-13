import React from "react";
import "./index.css";
const Button = ({ text, className, onClick, disabled }) => {
  return (
    <button
      className={`button ${className}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
