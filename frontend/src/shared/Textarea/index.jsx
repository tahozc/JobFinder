import React, { Fragment } from "react";
import "./index.css";

const Textarea = ({ name, onChange, value }) => {
  return (
    <Fragment>
      <textarea
        className="textarea"
        rows={8}
        name={name}
        value={value}
        onChange={onChange}
      ></textarea>
    </Fragment>
  );
};

export default Textarea;
