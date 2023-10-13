import React, { Fragment } from "react";
import { Blocks } from "react-loader-spinner";
import "./index.css";
const Loader = () => {
  return (
    <Fragment>
      <div className="overlay-container">
        <Blocks
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          color="#010b1d"
          secondaryColor="#0000FF"
        />
      </div>
    </Fragment>
  );
};

export default Loader;
