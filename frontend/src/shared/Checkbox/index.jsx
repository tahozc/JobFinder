import React, { Fragment } from "react";
import "./index.css";

const Checkbox = ({ text, checked, setChecked }) => {
  return (
    <Fragment>
      <div className="checkbox-container">
        <div
          className={`checkbox ${checked && "checked"}`}
          onClick={() => setChecked(!checked)}
        >
          {checked && "✓"}
        </div>
        <div className="checkbox-text">{text}</div>
      </div>
    </Fragment>
  );
};

export default Checkbox;
