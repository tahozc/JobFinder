import React, { Fragment } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Input = ({
  type,
  value,
  placeholder,
  className,
  onChange,
  onClick,
  icon,
  disabled,
  name,
  isNumber,
}) => {
  return (
    <Fragment>
      <div className="input-container">
        <input
          value={value}
          type={type}
          className={`input ${className} ${icon && "input-icon"}`}
          placeholder={placeholder}
          onChange={(e) => {
            e.target.isNumber = isNumber;
            onChange(e);
          }}
          onClick={onClick}
          disabled={disabled}
          name={name}
        />
        {icon && (
          <div className="input-icon-container">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Input;
